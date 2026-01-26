<!-- Chức năng: Bảng danh sách dự án (Services) - Card Layout -->
<template>
    <div class="service-content">
        <div class="service-toolbar">
            <div class="search-box">
                <Icon name="mdi:magnify" />
                <input v-model="searchQuery" type="text" placeholder="Tìm kiếm dự án..." class="search-input" />
            </div>

            <div class="toolbar-actions">
                <button class="config-btn categories-btn" @click="$emit('manage-categories')">
                    <Icon name="mdi:folder-multiple" />
                    <span>Danh mục</span>
                </button>
                <button class="config-btn tags-btn" @click="$emit('manage-tags')">
                    <Icon name="mdi:tag-multiple" />
                    <span>Tags</span>
                </button>
            </div>
        </div>

        <div class="service-list">
            <div class="list-header">
                <div class="list-info">
                    <span class="items-count">{{ filteredItems.length }} dự án</span>
                </div>
                <button class="add-btn" @click="$emit('add')">
                    <Icon name="mdi:plus" />
                    <span>Thêm dự án</span>
                </button>
            </div>

            <div v-if="filteredItems.length === 0" class="empty-state">
                <Icon name="mdi:briefcase-outline" class="empty-icon" />
                <p>Chưa có dự án nào</p>
                <button class="add-first-btn" @click="$emit('add')">
                    <Icon name="mdi:plus" />
                    <span>Thêm dự án đầu tiên</span>
                </button>
            </div>

            <div v-else class="projects-grid">
                <article v-for="item in paginatedItems" :key="item.id" class="project-card" :class="{ 'is-placeholder': item.isPlaceholder }">
                    <div class="card-thumbnail">
                        <div class="thumbnail-grid">
                            <div v-for="(image, idx) in getDisplayImages(item)" :key="idx" class="thumbnail-item">
                                <img :src="image.url" :alt="image.alt || `${item.name} - Hình ${idx + 1}`" />
                            </div>
                        </div>
                        <div v-if="item.images && item.images.length > 4" class="image-count-badge">
                            +{{ item.images.length - 4 }}
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">{{ item.name }}</h3>

                        <div v-if="getDisplayCategories(item).length > 0" class="card-categories">
                            <span v-for="(cat, idx) in getDisplayCategories(item)" :key="idx" class="category-badge">{{ cat }}</span>
                            <span v-if="hasMoreCategories(item)" class="more-badge">+{{ getMoreCategoriesCount(item) }}</span>
                        </div>

                        <p v-if="item.description" class="card-description">{{ truncateText(item.description, 120) }}</p>

                        <div class="card-meta">
                            <span v-if="item.completedDate" class="meta-item">
                                <Icon name="mdi:calendar-check" />
                                {{ formatDate(item.completedDate) }}
                            </span>
                            <span v-if="item.location" class="meta-item">
                                <Icon name="mdi:map-marker" />
                                {{ item.location }}
                            </span>
                        </div>

                        <div v-if="!item.isPlaceholder" class="card-actions">
                            <button class="action-btn edit-btn" @click.stop="$emit('edit', item)" title="Sửa">
                                <Icon name="mdi:pencil" />
                                <span>Sửa</span>
                            </button>
                            <button class="action-btn delete-btn" @click.stop="$emit('delete', item)" title="Xóa">
                                <Icon name="mdi:delete" />
                                <span>Xóa</span>
                            </button>
                        </div>
                    </div>
                </article>
            </div>

            <div v-if="totalPages > 1" class="pagination">
                <button :disabled="currentPage === 1" @click="currentPage--">
                    <Icon name="mdi:chevron-left" />
                </button>
                <span>{{ currentPage }} / {{ totalPages }}</span>
                <button :disabled="currentPage === totalPages" @click="currentPage++">
                    <Icon name="mdi:chevron-right" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface ServiceItem {
    id: string
    name?: string
    description?: string
    categories?: string[]
    location?: string
    completedDate?: string
    images?: Array<{ url: string; alt: string }>
    isPlaceholder?: boolean
    [key: string]: unknown
}

const props = defineProps<{
    items: ServiceItem[]
}>()

const emit = defineEmits<{
    add: []
    edit: [item: ServiceItem]
    delete: [item: ServiceItem]
    'manage-categories': []
    'manage-tags': []
}>()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const allPlaceholders = Array.from({ length: 50 }, (_, i) => ({
    id: `placeholder-${i + 1}`,
    name: `Dự án mẫu ${i + 1}`,
    categories: [['Camera AI', 'WiFi Doanh Nghiệp', 'Báo Cháy', 'Tổng Đài'][i % 4]],
    location: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ'][i % 4] + ', Việt Nam',
    completedDate: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    images: [{ url: 'https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Data', alt: 'Placeholder' }],
    isPlaceholder: true
} as ServiceItem))

const baseItems = computed(() => {
    return props.items.length > 0 ? props.items : allPlaceholders
})

const filteredItems = computed(() => {
    if (!searchQuery.value) return baseItems.value
    const query = searchQuery.value.toLowerCase()
    return baseItems.value.filter(item =>
        (item.name || '').toLowerCase().includes(query) ||
        (item.location || '').toLowerCase().includes(query) ||
        (item.categories || []).some(c => c.toLowerCase().includes(query))
    )
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1)

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredItems.value.slice(start, start + itemsPerPage)
})

watch(searchQuery, () => {
    currentPage.value = 1
})

const getDisplayImages = (item: ServiceItem) => {
    if (!item.images || item.images.length === 0) {
        return [{ url: '/images/placeholder.png', alt: 'Placeholder' }]
    }
    return item.images.slice(0, 4)
}

const getDisplayCategories = (item: ServiceItem) => {
    if (!Array.isArray(item.categories)) return []
    return item.categories.slice(0, 3)
}

const hasMoreCategories = (item: ServiceItem) => {
    return Array.isArray(item.categories) && item.categories.length > 3
}

const getMoreCategoriesCount = (item: ServiceItem) => {
    if (!Array.isArray(item.categories)) return 0
    return item.categories.length - 3
}

const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
}
</script>

<style scoped>
.service-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.service-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f8fafc;
    border-radius: 8px;
    min-width: 280px;
}

.search-box .iconify {
    color: #94a3b8;
    font-size: 18px;
}

.search-input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    width: 100%;
}

.toolbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.config-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.categories-btn {
    background: #fef3c7;
    color: #d97706;
}

.categories-btn:hover {
    background: #fde68a;
}

.tags-btn {
    background: #ddd6fe;
    color: #7c3aed;
}

.tags-btn:hover {
    background: #c4b5fd;
}

.service-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
}

.items-count {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.add-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.add-btn:hover {
    background: #2563eb;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    background: white;
    border-radius: 12px;
    border: 2px dashed #e2e8f0;
}

.empty-icon {
    font-size: 64px;
    color: #cbd5e1;
    margin-bottom: 16px;
}

.empty-state p {
    color: #94a3b8;
    margin-bottom: 20px;
}

.add-first-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
}

.project-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    border: 1px solid #e2e8f0;
}

.project-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.project-card.is-placeholder {
    opacity: 0.6;
}

.card-thumbnail {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #f1f5f9;
}

.thumbnail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    width: 100%;
    height: 100%;
    gap: 2px;
}

.thumbnail-item {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.thumbnail-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-count-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.card-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.category-badge {
    padding: 4px 10px;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
}

.more-badge {
    padding: 4px 8px;
    background: #f1f5f9;
    color: #64748b;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
}

.card-description {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 8px;
    border-top: 1px solid #f1f5f9;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #94a3b8;
}

.meta-item .iconify {
    font-size: 14px;
}

.card-actions {
    display: flex;
    gap: 8px;
    padding-top: 8px;
}

.action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.edit-btn {
    color: #3b82f6;
}

.edit-btn:hover {
    background: #eff6ff;
    border-color: #3b82f6;
}

.delete-btn {
    color: #ef4444;
}

.delete-btn:hover {
    background: #fef2f2;
    border-color: #ef4444;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px;
}

.pagination button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #3b82f6;
}

.pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.pagination span {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}
</style>
