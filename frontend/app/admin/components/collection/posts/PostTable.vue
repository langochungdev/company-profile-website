<template>
    <div class="post-table-wrapper">
        <div class="table-header">
            <h3>{{ filteredItemsCount }} bài viết</h3>
            <div class="header-actions">
                <div class="search-input-wrapper">
                    <Icon name="mdi:magnify" class="search-icon" />
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm bài viết..." class="search-input" @input="handleSearch" />
                    <button v-if="searchQuery" @click="clearSearch" class="btn-clear-search">
                        <Icon name="mdi:close" />
                    </button>
                </div>
                <button @click="$emit('manage-categories')" class="btn-secondary">
                    <Icon name="mdi:cog" />
                    Danh mục
                </button>
                <button @click="$emit('manage-tags')" class="btn-secondary">
                    <Icon name="mdi:tag-multiple" />
                    Tags
                </button>
                <button @click="$emit('add')" class="btn-add">
                    <Icon name="mdi:plus" />
                    Thêm bài viết
                </button>
            </div>
        </div>

        <div class="filters-section">
            <div class="filter-group">
                <label>Danh mục</label>
                <select v-model="selectedCategory" class="filter-select">
                    <option value="">Tất cả</option>
                    <option v-for="cat in availableCategories" :key="cat" :value="cat">
                        {{ cat }}
                    </option>
                </select>
            </div>

            <div class="filter-group">
                <label>Trạng thái</label>
                <select v-model="selectedStatus" class="filter-select">
                    <option value="">Tất cả</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            <div class="filter-group">
                <label>Nổi bật</label>
                <select v-model="selectedFeatured" class="filter-select">
                    <option value="">Tất cả</option>
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                </select>
            </div>

            <div class="filter-group">
                <label>Tags</label>
                <div class="tags-filter">
                    <button v-for="tag in availableTags.slice(0, 5)" :key="tag" @click="toggleTag(tag)" class="tag-filter-btn" :class="{ active: selectedTags.includes(tag) }">
                        {{ tag }}
                    </button>
                </div>
            </div>

            <button v-if="selectedCategory || selectedStatus || selectedFeatured || selectedTags.length > 0" @click="clearFilters" class="btn-clear-filters">
                <Icon name="mdi:close" />
                Xóa bộ lọc
            </button>
        </div>

        <div class="table-container">
            <div class="post-grid">
                <div v-for="post in displayItems" :key="post.id" class="post-card" :class="{ 'is-placeholder': post.isPlaceholder }">
                    <div class="card-image-wrapper">
                        <img v-if="getPostThumbnail(post)" :src="getPostThumbnail(post)" :alt="getPostThumbnailAlt(post)" class="post-img" />
                        <div v-else class="thumbnail-placeholder">
                            <Icon name="mdi:image-off" />
                        </div>
                        <div v-if="post.featured" class="featured-badge">
                            <Icon name="mdi:star" />
                        </div>
                        <div class="status-badge" :class="`status-${post.status || 'draft'}`">
                            {{ post.status === 'published' ? 'Published' : 'Draft' }}
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="card-header">
                            <span v-if="post.category" class="badge badge-primary">
                                {{ post.category }}
                            </span>
                            <strong class="post-title">{{ post.title }}</strong>
                        </div>

                        <span v-if="post.slug" class="post-slug">/post/{{ post.slug }}</span>

                        <div v-if="post.tags?.length > 0" class="tags-container">
                            <span v-for="(tag, idx) in getDisplayTags(post.tags).slice(0, 3)" :key="idx" class="tag">
                                {{ tag }}
                            </span>
                            <span v-if="post.tags.length > 3" class="tag-more">
                                +{{ post.tags.length - 3 }}
                            </span>
                        </div>

                        <div v-if="post.excerpt" class="excerpt-preview">
                            {{ truncate(post.excerpt, 100) }}
                        </div>

                        <div class="card-meta">
                            <div class="meta-item">
                                <Icon name="mdi:account" />
                                <span>{{ post.author || 'shtcam.vn' }}</span>
                            </div>
                            <div class="meta-item">
                                <Icon name="mdi:calendar" />
                                <span>{{ formatDate(post.publishedAt) }}</span>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="footer-info">
                                <span class="view-count">{{ post.views || 0 }} lượt xem</span>
                            </div>

                            <div v-if="!post.isPlaceholder" class="action-buttons">
                                <button @click="$emit('edit', post)" class="btn-action btn-edit" title="Chỉnh sửa">
                                    <Icon name="mdi:pencil" />
                                </button>
                                <button @click="$emit('delete', post)" class="btn-action btn-delete" title="Xóa">
                                    <Icon name="mdi:delete" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="totalPages > 1" class="pagination-section">
                <button @click="goToPage(currentPage - 1)" class="pagination-btn" :disabled="currentPage === 1">
                    <Icon name="mdi:chevron-left" />
                </button>

                <button v-for="(page, idx) in paginationPages" :key="idx" @click="typeof page === 'number' ? goToPage(page) : null" class="pagination-btn" :class="{ active: page === currentPage, dots: page === '...' }" :disabled="page === '...'">
                    {{ page }}
                </button>

                <button @click="goToPage(currentPage + 1)" class="pagination-btn" :disabled="currentPage === totalPages">
                    <Icon name="mdi:chevron-right" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PostsApiService } from '@/admin/services/posts-api.service'

const props = defineProps<{
    items: any[]
    hasMore?: boolean
    loading?: boolean
}>()

defineEmits<{
    add: []
    edit: [post: any]
    delete: [post: any]
    'manage-categories': []
    'manage-tags': []
    'load-more': []
}>()

const currentPage = ref(1)
const itemsPerPage = 9
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedFeatured = ref('')
const selectedTags = ref<string[]>([])
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

const allPlaceholders = Array.from({ length: 30 }, (_, i) => ({
    id: `placeholder-${i + 1}`,
    title: `Bài viết mẫu ${i + 1}`,
    slug: `placeholder-${i + 1}`,
    category: ['Kiến thức', 'Tin tức', 'Sự kiện', 'Hướng dẫn'][i % 4],
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    thumbnail: { url: 'https://placehold.co/800x600/e2e8f0/94a3b8?text=No+Data', alt: 'Placeholder' },
    author: 'shtcam.vn',
    publishedAt: new Date().toISOString(),
    featured: i % 5 === 0,
    status: i % 2 === 0 ? 'published' : 'draft',
    tags: ['Camera', 'WiFi'],
    isPlaceholder: true,
}))

const availableCategories = computed(() => {
    const cats = new Set<string>()
    props.items.forEach(item => {
        if (item.category) cats.add(item.category)
    })
    return Array.from(cats).sort()
})

const availableTags = computed(() => {
    const tags = new Set<string>()
    props.items.forEach(item => {
        if (item.tags) {
            getDisplayTags(item.tags).forEach(tag => tags.add(tag))
        }
    })
    return Array.from(tags).sort()
})

const filteredItems = computed(() => {
    const baseItems = searchQuery.value.trim() ? searchResults.value : (props.items.length > 0 ? props.items : allPlaceholders)

    const filtered = baseItems.filter(item => {
        if (selectedCategory.value && item.category !== selectedCategory.value) {
            return false
        }

        if (selectedStatus.value && item.status !== selectedStatus.value) {
            return false
        }

        if (selectedFeatured.value) {
            const isFeatured = item.featured === true
            if (selectedFeatured.value === 'true' && !isFeatured) return false
            if (selectedFeatured.value === 'false' && isFeatured) return false
        }

        if (selectedTags.value.length > 0) {
            const itemTags = getDisplayTags(item.tags || [])
            const hasSelectedTag = selectedTags.value.some(tag => itemTags.includes(tag))
            if (!hasSelectedTag) return false
        }

        return true
    })

    return filtered.length > 0 ? filtered : allPlaceholders
})

const filteredItemsCount = computed(() => filteredItems.value.length)

const displayItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredItems.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredItems.value.length / itemsPerPage)
})

const paginationPages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, 4, '...', total)
        } else if (current >= total - 2) {
            pages.push(1, '...', total - 3, total - 2, total - 1, total)
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total)
        }
    }
    return pages
})

const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
}

const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag)
    if (index > -1) {
        selectedTags.value.splice(index, 1)
    } else {
        selectedTags.value.push(tag)
    }
    currentPage.value = 1
}

const clearFilters = () => {
    selectedCategory.value = ''
    selectedStatus.value = ''
    selectedFeatured.value = ''
    selectedTags.value = []
    currentPage.value = 1
}

const handleSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)

    searchTimeout = setTimeout(async () => {
        if (!searchQuery.value.trim()) {
            searchResults.value = []
            isSearching.value = false
            return
        }

        isSearching.value = true
        try {
            const { hits } = await PostsApiService.search(searchQuery.value)
            searchResults.value = hits
        } catch (error) {
            console.error('[PostTable] Search error:', error)
            searchResults.value = []
        } finally {
            isSearching.value = false
        }
    }, 300)
}

const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
}

watch([selectedCategory, selectedStatus, selectedFeatured], () => {
    currentPage.value = 1
})

function formatDate(dateString: string): string {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date)
}

function truncate(text: string, maxLength: number) {
    if (!text) return ''
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function getPostThumbnail(post: any): string {
    if (post.thumbnail?.url) return post.thumbnail.url
    return ''
}

function getPostThumbnailAlt(post: any): string {
    if (post.thumbnail?.alt) return post.thumbnail.alt
    return post.title || ''
}

function getDisplayTags(tags: any[]): string[] {
    if (!tags) return []
    return tags.map(tag => {
        if (typeof tag === 'string') return tag
        if (typeof tag === 'object' && tag !== null && 'value' in tag) return tag.value
        if (typeof tag === 'object' && tag !== null && 'name' in tag) return tag.name
        return String(tag)
    })
}
</script>

<style scoped>
.post-table-wrapper {
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
}

.table-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 12px;
    color: #9ca3af;
    font-size: 18px;
    pointer-events: none;
}

.search-input {
    padding: 10px 40px 10px 40px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    width: 300px;
    transition: all 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-clear-search {
    position: absolute;
    right: 8px;
    padding: 4px;
    border: none;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
}

.btn-clear-search:hover {
    background: #f3f4f6;
    color: #374151;
}

.btn-secondary {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: #f9fafb;
    border-color: #9ca3af;
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: #2563eb;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-add:hover {
    background: #1d4ed8;
}

.filters-section {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    padding: 16px 24px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 150px;
}

.filter-group label {
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
}

.filter-select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    background: white;
    cursor: pointer;
}

.filter-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.tags-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tag-filter-btn {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    color: #374151;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.tag-filter-btn:hover {
    border-color: #3b82f6;
    background: #eff6ff;
}

.tag-filter-btn.active {
    border-color: #3b82f6;
    background: #3b82f6;
    color: white;
}

.btn-clear-filters {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    color: #dc2626;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-clear-filters:hover {
    background: #fee2e2;
    border-color: #dc2626;
}

.table-container {
    padding: 24px;
}

.post-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.post-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
}

.post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
}

.post-card.is-placeholder {
    opacity: 0.6;
    pointer-events: none;
}

.post-card.is-placeholder:hover {
    transform: none;
    box-shadow: none;
    border-color: #e5e7eb;
}

.card-image-wrapper {
    position: relative;
    padding-top: 60%;
    background: #f8fafc;
    overflow: hidden;
}

.post-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.thumbnail-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    color: #9ca3af;
    font-size: 32px;
}

.featured-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(250, 204, 21, 0.95);
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
}

.status-published {
    background: rgba(16, 185, 129, 0.95);
    color: white;
}

.status-draft {
    background: rgba(107, 114, 128, 0.95);
    color: white;
}

.card-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.post-title {
    font-weight: 600;
    color: #111827;
    font-size: 15px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.post-slug {
    font-size: 12px;
    color: #6b7280;
}

.badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    align-self: flex-start;
}

.badge-primary {
    background: #dbeafe;
    color: #1e40af;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.tag {
    padding: 3px 8px;
    background: #f3f4f6;
    border-radius: 4px;
    font-size: 11px;
    color: #4b5563;
}

.tag-more {
    padding: 3px 8px;
    background: #e5e7eb;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
}

.excerpt-preview {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #6b7280;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
    margin-top: auto;
}

.footer-info {
    font-size: 12px;
    color: #9ca3af;
}

.action-buttons {
    display: flex;
    gap: 6px;
}

.btn-action {
    padding: 6px;
    background: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-action:hover {
    transform: scale(1.1);
}

.btn-edit:hover {
    background: #dbeafe;
    border-color: #3b82f6;
    color: #2563eb;
}

.btn-delete:hover {
    background: #fee2e2;
    border-color: #f87171;
    color: #dc2626;
}

.pagination-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 24px 0;
    border-top: 1px solid #f3f4f6;
}

.pagination-btn {
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    color: #374151;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
}

.pagination-btn.active {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-btn.dots {
    border: none;
    pointer-events: none;
}
</style>
