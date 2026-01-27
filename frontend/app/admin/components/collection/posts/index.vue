<template>
    <div class="posts-collection-wrapper">
        <PostTable :items="items" :has-more="previewContext.hasMore.value" :loading="loading" @add="openAddModal" @edit="openEditModal" @delete="handleDelete" @manage-categories="isCategoryManagerOpen = true" @manage-tags="isTagManagerOpen = true" @load-more="handleLoadMore" />

        <PostEditor :is-open="isEditorOpen" :is-new="isNewItem" :initial-data="editingItem" @close="closeEditor" @save="handleSave" />

        <PostConfigManager :is-open="isCategoryManagerOpen" @close="isCategoryManagerOpen = false" @updated="handleConfigUpdated" />

        <ProductTagManager :is-open="isTagManagerOpen" @close="isTagManagerOpen = false" @updated="handleConfigUpdated" />
    </div>
</template>

<script setup lang="ts">
import PostTable from './PostTable.vue'
import PostEditor from './PostEditor.vue'
import PostConfigManager from './PostConfigManager.vue'
import ProductTagManager from '../products/ProductTagManager.vue'
import { useCollectionContext } from '@/admin/composables/useCollectionContext'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { useDeleteQueue } from '@/admin/composables/useDeleteQueue'
import { useToast } from '@/admin/composables/useToast'
import { PostsApiService } from '@/admin/services/posts-api.service'

const toast = useToast()
const { addToDeleteQueue, processDeleteQueue, clearQueue } = useDeleteQueue()

const collectionContext = useCollectionContext({
    path: 'collections/posts/items',
    itemFields: {
        title: { type: 'text', label: 'Tiêu đề', isPreview: true },
        slug: { type: 'text', label: 'Slug', isPreview: true },
        category: { type: 'select', label: 'Danh mục', isPreview: true },
        tags: { type: 'dynamic-multi-select', label: 'Tags', isPreview: true, previewCount: 3 },
        excerpt: { type: 'textarea', label: 'Tóm tắt', isPreview: true, previewMaxLength: 200 },
        thumbnail: { type: 'image', label: 'Ảnh đại diện', isPreview: true },
        content: { type: 'richtext', label: 'Nội dung' },
        author: { type: 'text', label: 'Tác giả', isPreview: true },
        publishedAt: { type: 'date', label: 'Ngày xuất bản', isPreview: true },
        featured: { type: 'boolean', label: 'Nổi bật', isPreview: true },
        status: { type: 'select', label: 'Trạng thái', isPreview: true },
    },
})

const previewContext = usePreviewContext('collections/posts/items')

const items = computed(() => previewContext.previews.value || [])
const loading = ref(false)

const isEditorOpen = ref(false)
const isNewItem = ref(true)
const editingItem = ref<Record<string, unknown>>({})
const isCategoryManagerOpen = ref(false)
const isTagManagerOpen = ref(false)

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
        console.error('[PostsPage] Load item error:', error)
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
            const newId = await collectionContext.addItem(data)
            if (newId) {
                await PostsApiService.syncCreate(newId, data)
            }
            toast.success('Đã thêm bài viết thành công!')
        } else {
            const id = data.id as string
            const { id: _, ...updateData } = data
            await collectionContext.updateItem(id, updateData)
            await PostsApiService.syncUpdate(id, updateData)
            toast.success('Đã cập nhật bài viết thành công!')
        }
        closeEditor()
        await previewContext.loadPreviews()
    } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra!')
        console.error('[PostsPage] Save error:', error)
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
    if (!confirm(`Xóa "${item.title}"?`)) return

    loading.value = true
    clearQueue()

    try {
        const fullItem = await collectionContext.getItem(item.id as string)
        const itemToDelete = fullItem || item

        console.log('[PostsPage] Deleting item:', itemToDelete)

        if (itemToDelete.thumbnail && typeof itemToDelete.thumbnail === 'object' && (itemToDelete.thumbnail as any)?.url) {
            console.log('[PostsPage] Adding thumbnail to delete queue:', (itemToDelete.thumbnail as any).url)
            addToDeleteQueue((itemToDelete.thumbnail as any).url)
        }
        if (itemToDelete.content && typeof itemToDelete.content === 'string') {
            const contentUrls = extractCloudinaryUrls(itemToDelete.content)
            console.log('[PostsPage] Adding content images to delete queue:', contentUrls)
            contentUrls.forEach(url => addToDeleteQueue(url))
        }

        await collectionContext.deleteItem(item.id as string)
        await PostsApiService.syncDelete(item.id as string)
        await processDeleteQueue()

        toast.success('Đã xóa bài viết thành công!')
        await previewContext.loadPreviews()
    } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra khi xóa!')
        console.error('[PostsPage] Delete error:', error)
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
.posts-collection-wrapper {
    height: 100%;
}
</style>
