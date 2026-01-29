<!-- Chức năng: Quản lý collection Products (Sản phẩm) -->
<template>
    <div class="product-page">
        <ProductTable :items="items" :has-more="previewContext.hasMore.value" :loading="loading" @add="openAddModal" @edit="openEditModal" @delete="handleDelete" @manage-categories="openConfigManager('categories')" @manage-tags="openConfigManager('tags')" @load-more="handleLoadMore" />

        <ProductEditor :is-open="isEditorOpen" :is-new="isNewItem" :initial-data="editingItem" @close="closeEditor" @save="handleSave" />

        <ProductConfigManager :is-open="isConfigManagerOpen" :initial-tab="configTab" @close="isConfigManagerOpen = false" @updated="handleConfigUpdated" />
    </div>
</template>

<script setup lang="ts">
import ProductTable from './ProductTable.vue'
import ProductEditor from './ProductEditor.vue'
import ProductConfigManager from './ProductConfigManager.vue'
import { useCollectionContext } from '@/admin/composables/useCollectionContext'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { useDeleteQueue } from '@/admin/composables/useDeleteQueue'
import { useToast } from '@/admin/composables/useToast'
import { ProductsApiService } from '@/admin/services/products-api.service'

const toast = useToast()
const { addToDeleteQueue, processDeleteQueue, clearQueue } = useDeleteQueue()

const collectionContext = useCollectionContext({
    path: 'collections/products/items',
    itemFields: {
        name: { type: 'text', label: 'Tên', isPreview: true },
        slug: { type: 'text', label: 'Slug', isPreview: true },
        category: { type: 'text', label: 'Danh mục', isPreview: true },
        tags: { type: 'dynamic-multi-select', label: 'Tags', isPreview: true },
        description: { type: 'richtext', label: 'Mô tả', isPreview: true, previewMaxLength: 150 },
        price: { type: 'number', label: 'Giá', isPreview: true },
        image: { type: 'image', label: 'Ảnh', isPreview: true },
        images: { type: 'array', label: 'Ảnh', isPreview: true, previewCount: 1 },
    },
})

const previewContext = usePreviewContext('collections/products/items')

const items = computed(() => previewContext.previews.value || [])
const loading = ref(false)

const isEditorOpen = ref(false)
const isNewItem = ref(true)
const editingItem = ref<Record<string, unknown>>({})

const isConfigManagerOpen = ref(false)
const configTab = ref<'categories' | 'tags'>('categories')

const loadData = async () => {
    loading.value = true
    try {
        await previewContext.loadPreviews()
    } finally {
        loading.value = false
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

const openConfigManager = (tab: 'categories' | 'tags') => {
    configTab.value = tab
    isConfigManagerOpen.value = true
}

const handleSave = async (data: any) => {
    loading.value = true
    try {
        if (isNewItem.value) {
            const newId = await collectionContext.addItem(data)
            if (newId) {
                await ProductsApiService.syncCreate(newId, data)
            }
            toast.success('Đã thêm sản phẩm thành công!')
        } else {
            const id = data.id as string
            const { id: _, ...updateData } = data
            await collectionContext.updateItem(id, updateData)
            await ProductsApiService.syncUpdate(id, updateData)
            toast.success('Đã cập nhật sản phẩm thành công!')
        }
        closeEditor()
        await previewContext.loadPreviews()
    } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra!')

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
        if (itemToDelete.image && typeof itemToDelete.image === 'object' && (itemToDelete.image as any)?.url) {
            addToDeleteQueue((itemToDelete.image as any).url)
        }
        if (itemToDelete.content && typeof itemToDelete.content === 'string') {
            extractCloudinaryUrls(itemToDelete.content).forEach(url => addToDeleteQueue(url))
        }
        if (itemToDelete.description && typeof itemToDelete.description === 'string') {
            extractCloudinaryUrls(itemToDelete.description).forEach(url => addToDeleteQueue(url))
        }

        await collectionContext.deleteItem(item.id as string)
        await ProductsApiService.syncDelete(item.id as string)
        await processDeleteQueue()

        toast.success('Đã xóa sản phẩm thành công!')
        await previewContext.loadPreviews()
    } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra khi xóa!')

    } finally {
        loading.value = false
    }
}

const handleLoadMore = async () => {
    await previewContext.loadMore()
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
.product-page {
    height: 100%;
}
</style>
