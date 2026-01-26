<!-- Chức năng: Bảng danh sách dự án (Services) -->
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

            <div v-else class="table-wrapper">
                <table class="service-table">
                    <thead>
                        <tr>
                            <th style="width: 80px">Ảnh</th>
                            <th>Tên dự án</th>
                            <th style="width: 180px">Danh mục</th>
                            <th style="width: 150px">Địa điểm</th>
                            <th style="width: 120px">Ngày hoàn thành</th>
                            <th style="width: 100px">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in paginatedItems" :key="item.id" class="item-row" :class="{ 'is-placeholder': item.isPlaceholder }" @click="!item.isPlaceholder && $emit('edit', item)">
                            <td>
                                <img :src="getImageUrl(item)" class="item-image" />
                            </td>
                            <td>
                                <span class="item-name">{{ item.name }}</span>
                            </td>
                            <td>
                                <div class="category-tags">
                                    <span v-for="(cat, idx) in getCategoriesDisplay(item)" :key="idx" class="category-badge">{{ cat }}</span>
                                    <span v-if="hasMoreCategories(item)" class="more-badge">+{{ getMoreCategoriesCount(item) }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="item-location">{{ item.location }}</span>
                            </td>
                            <td>
                                <span class="item-date">{{ formatDate(item.completedDate) }}</span>
                            </td>
                            <td class="actions-cell">
                                <button v-if="!item.isPlaceholder" class="action-btn edit-btn" @click.stop="$emit('edit', item)" title="Sửa">
                                    <Icon name="mdi:pencil" />
                                </button>
                                <button v-if="!item.isPlaceholder" class="action-btn delete-btn" @click.stop="$emit('delete', item)" title="Xóa">
                                    <Icon name="mdi:delete" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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

const getImageUrl = (item: ServiceItem) => {
    if (item.images && item.images.length > 0 && item.images[0]?.url) {
        return item.images[0].url
    }
    return '/images/placeholder.png'
}

const getCategoriesDisplay = (item: ServiceItem) => {
    return (item.categories || []).slice(0, 2)
}

const hasMoreCategories = (item: ServiceItem) => {
    return item.categories && item.categories.length > 2
}

const getMoreCategoriesCount = (item: ServiceItem) => {
    return item.categories ? item.categories.length - 2 : 0
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
    background: #dbeafe;
    color: #2563eb;
}

.tags-btn:hover {
    background: #bfdbfe;
}

.service-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
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
    padding: 8px 16px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.empty-icon {
    font-size: 48px;
    color: #cbd5e1;
    margin-bottom: 16px;
}

.empty-state p {
    color: #64748b;
    margin-bottom: 20px;
}

.add-first-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: #f1f5f9;
    color: #475569;
    border: 2px dashed #cbd5e1;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.add-first-btn:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
}

.table-wrapper {
    overflow-x: auto;
}

.service-table {
    width: 100%;
    border-collapse: collapse;
}

.service-table th {
    text-align: left;
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.service-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
}

.item-row {
    cursor: pointer;
    transition: background 0.2s;
}

.item-row:hover {
    background: #f8fafc;
}

.item-row.is-placeholder {
    opacity: 0.6;
    cursor: default;
}

.item-row.is-placeholder:hover {
    background: transparent;
}

.item-image {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 8px;
}

.item-name {
    font-weight: 500;
    color: #1e293b;
}

.category-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.category-badge {
    display: inline-block;
    padding: 2px 8px;
    background: #fef3c7;
    color: #d97706;
    font-size: 11px;
    font-weight: 500;
    border-radius: 4px;
}

.more-badge {
    display: inline-block;
    padding: 2px 6px;
    background: #e2e8f0;
    color: #64748b;
    font-size: 11px;
    border-radius: 4px;
}

.item-location {
    color: #64748b;
    font-size: 13px;
}

.item-date {
    color: #64748b;
    font-size: 13px;
}

.actions-cell {
    display: flex;
    gap: 4px;
}

.action-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.edit-btn {
    background: #dbeafe;
    color: #2563eb;
}

.edit-btn:hover {
    background: #bfdbfe;
}

.delete-btn {
    background: #fee2e2;
    color: #dc2626;
}

.delete-btn:hover {
    background: #fecaca;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #e2e8f0;
}

.pagination button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    background: #f1f5f9;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination span {
    font-size: 13px;
    color: #64748b;
}
</style>
