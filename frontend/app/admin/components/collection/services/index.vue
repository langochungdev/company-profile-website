<!-- Chức năng: Quản lý collection Services (Dự án) -->
<template>
    <div class="service-page">
        <ServiceTable :items="items" @add="openAddModal" @edit="openEditModal" @delete="handleDelete" @manage-categories="isCategoryManagerOpen = true" @manage-tags="isTagManagerOpen = true" />

        <ServiceEditor :is-open="isEditorOpen" :is-new="isNewItem" :initial-data="editingItem" @close="closeEditor" @save="handleSave" />

        <ServiceCategoryManager :is-open="isCategoryManagerOpen" @close="isCategoryManagerOpen = false" @updated="handleConfigUpdated" />

        <ProductTagManager :is-open="isTagManagerOpen" @close="isTagManagerOpen = false" @updated="handleConfigUpdated" />
    </div>
</template>

<script setup lang="ts">
import ServiceTable from './ServiceTable.vue'
import ServiceEditor from './ServiceEditor.vue'
import ServiceCategoryManager from './ServiceCategoryManager.vue'
import ProductTagManager from '../products/ProductTagManager.vue'
import { useCollectionContext } from '@/admin/composables/useCollectionContext'
import { useDeleteQueue } from '@/admin/composables/useDeleteQueue'
import { useToast } from '@/admin/composables/useToast'

const toast = useToast()
const { addToDeleteQueue, processDeleteQueue, clearQueue } = useDeleteQueue()

const collectionContext = useCollectionContext({
    path: 'collections/services/items',
    itemFields: {},
})

const items = computed(() => collectionContext.items.value || [])
const loading = computed(() => collectionContext.loading.value)

const isEditorOpen = ref(false)
const isNewItem = ref(true)
const editingItem = ref<Record<string, unknown>>({})
const isCategoryManagerOpen = ref(false)
const isTagManagerOpen = ref(false)

const loadData = async () => {
    try {
        await collectionContext.loadItems()
        console.log('[Services] Loaded items:', collectionContext.items.value)
    } catch (error) {
        console.error('[Services] Load error:', error)
    }
}

const openAddModal = () => {
    isNewItem.value = true
    editingItem.value = {}
    isEditorOpen.value = true
}

const openEditModal = async (item: Record<string, unknown>) => {
    isNewItem.value = false
    loading.value = true
    try {
        const fullItem = await collectionContext.getItem(item.id as string)
        editingItem.value = fullItem ? { ...fullItem } : { ...item }
        isEditorOpen.value = true
    } catch (error) {
        console.error('[ServicePage] Load item error:', error)
        editingItem.value = { ...item }
        isEditorOpen.value = true
    } finally {
        loading.value = false
    }
}

const closeEditor = () => {
    isEditorOpen.value = false
    editingItem.value = {}
}

const handleSave = async (data: any) => {
    loading.value = true
    try {
        if (isNewItem.value) {
            await collectionContext.addItem(data)
            toast.success('Đã thêm dự án thành công!')
        } else {
            const id = data.id as string
            const { id: _, ...updateData } = data
            await collectionContext.updateItem(id, updateData)
            toast.success('Đã cập nhật dự án thành công!')
        }
        closeEditor()
        await collectionContext.loadItems()
    } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra!')
        console.error('[ServicePage] Save error:', error)
    } finally {
        loading.value = false
    }
}

const extractCloudinaryUrls = (html: string): string[] => {
    if (!html) return []
    const regex = /https?:\/\/res\.cloudinary\.com\/[^"\s<>)]+/gi
    return html.match(regex) || []
}

const handleDelete = async (item: Record<string, unknown>) => {
    if (!confirm(`Xóa "${item.name}"?`)) return

    loading.value = true
    clearQueue()

    try {
        const fullItem = await collectionContext.getItem(item.id as string)
        const itemToDelete = fullItem || item

        if (itemToDelete.images && Array.isArray(itemToDelete.images)) {
            itemToDelete.images.forEach((img: any) => {
                if (img?.url) addToDeleteQueue(img.url)
            })
        }
        if (itemToDelete.description && typeof itemToDelete.description === 'string') {
            extractCloudinaryUrls(itemToDelete.description).forEach(url => addToDeleteQueue(url))
        }

        await collectionContext.deleteItem(item.id as string)
        await processDeleteQueue()
        toast.success('Đã xóa dự án thành công!')
        await collectionContext.loadItems()
    } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra khi xóa!')
        console.error('[ServicePage] Delete error:', error)
    } finally {
        loading.value = false
    }
}

const handleConfigUpdated = () => {
    toast.success('Đã cập nhật cấu hình!')
}

onMounted(() => {
    loadData()
})

defineExpose({
    loading,
    refresh: loadData,
})
</script>

<style scoped>
.service-page {
    height: 100%;
}
</style>
