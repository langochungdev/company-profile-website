<!-- Chức năng: Hiển thị danh sách sản phẩm dạng grid card
     DB Structure:
     - Items (collections/products/items): { images: [{ url, alt, width, height }], ... }
     - Previews (collections/products/previews): { image: { url, alt, width, height }, ... }
-->
<template>
    <div class="product-table-wrapper">
        <div class="table-header">
            <h3>{{ filteredItemsCount }} sản phẩm</h3>
            <div class="header-actions">
                <div class="search-input-wrapper">
                    <Icon name="mdi:magnify" class="search-icon" />
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm sản phẩm..." class="search-input" @input="handleSearch" />
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
                    Thêm sản phẩm
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
                <label>Tags</label>
                <div class="tags-filter">
                    <button v-for="tag in availableTags" :key="tag" @click="toggleTag(tag)" class="tag-filter-btn" :class="{ active: selectedTags.includes(tag) }">
                        {{ tag }}
                    </button>
                </div>
            </div>

            <button v-if="selectedCategory || selectedTags.length > 0" @click="clearFilters" class="btn-clear-filters">
                <Icon name="mdi:close" />
                Xóa bộ lọc
            </button>
        </div>

        <div class="table-container">
            <div class="product-grid">
                <div v-for="product in displayItems" :key="product.id" class="product-card" :class="{ 'is-placeholder': product.isPlaceholder }">
                    <div class="card-image-wrapper">
                        <img v-if="getProductImage(product)" :src="getProductImage(product)" :alt="getProductImageAlt(product)" class="product-img" />
                        <div v-else class="thumbnail-placeholder">
                            <Icon name="mdi:image-off" />
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="card-header">
                            <span v-if="product.category" class="badge badge-primary">
                                {{ product.category }}
                            </span>
                            <strong class="product-name">{{ product.name }}</strong>
                        </div>

                        <span v-if="product.slug" class="product-slug">/{{ product.slug }}</span>

                        <div v-if="product.tags?.length > 0" class="tags-container">
                            <span v-for="(tag, idx) in getDisplayTags(product.tags).slice(0, 3)" :key="idx" class="tag">
                                {{ tag }}
                            </span>
                            <span v-if="product.tags.length > 3" class="tag-more">
                                +{{ product.tags.length - 3 }}
                            </span>
                        </div>

                        <div v-if="product.description" class="description-preview">
                            <div class="richtext-content" v-html="stripHtmlTags(product.description, 100)"></div>
                        </div>

                        <div class="card-footer">
                            <span v-if="product.price > 0" class="product-price">
                                {{ formatCurrency(product.price) }}
                            </span>
                            <span v-else class="text-muted">Liên hệ</span>

                            <div v-if="!product.isPlaceholder" class="action-buttons">
                                <button @click="$emit('edit', product)" class="btn-action btn-edit" title="Chỉnh sửa">
                                    <Icon name="mdi:pencil" />
                                </button>
                                <button @click="$emit('delete', product)" class="btn-action btn-delete" title="Xóa">
                                    <Icon name="mdi:delete" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="totalPages > 1" class="pagination-section">
                <button @click="goToPage(currentPage - 1)" class="pagination-btn" :disabled="currentPage === 1" title="Trang trước">
                    <Icon name="mdi:chevron-left" />
                </button>

                <button v-for="(page, idx) in paginationPages" :key="idx" @click="typeof page === 'number' ? goToPage(page) : null" class="pagination-btn" :class="{ active: page === currentPage, dots: page === '...' }" :disabled="page === '...'">
                    {{ page }}
                </button>

                <button @click="goToPage(currentPage + 1)" class="pagination-btn" :disabled="currentPage === totalPages" title="Trang sau">
                    <Icon name="mdi:chevron-right" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ProductsApiService } from '@/admin/services/products-api.service';

const props = defineProps<{
    items: any[]
    hasMore?: boolean
    loading?: boolean
}>()

defineEmits<{
    add: []
    edit: [product: any]
    delete: [product: any]
    'manage-categories': []
    'manage-tags': []
    'load-more': []
}>()

const currentPage = ref(1)
const itemsPerPage = 10
const selectedCategory = ref('')
const selectedTags = ref<string[]>([])
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

const allPlaceholders = Array.from({ length: 50 }, (_, i) => ({
    id: `placeholder-${i + 1}`,
    name: `Lorem ipsum dolor ${i + 1}`,
    slug: `placeholder-${i + 1}`,
    category: ['Camera AI', 'WiFi Doanh Nghiệp', 'Switch & Router', 'Báo Cháy'][i % 4],
    description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</p>',
    image: { url: 'https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Data', alt: 'Placeholder' },
    price: i % 3 === 0 ? 0 : (i + 1) * 1000000,
    tags: [{ value: 'Placeholder' }],
    isPlaceholder: true
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

    return baseItems.filter(item => {
        if (selectedCategory.value && item.category !== selectedCategory.value) {
            return false
        }

        if (selectedTags.value.length > 0) {
            const itemTags = getDisplayTags(item.tags || [])
            const hasSelectedTag = selectedTags.value.some(tag => itemTags.includes(tag))
            if (!hasSelectedTag) return false
        }

        return true
    })
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
            const { hits } = await ProductsApiService.search(searchQuery.value)
            searchResults.value = hits
        } catch (error) {
            console.error('Search error:', error)
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

watch([selectedCategory], () => {
    currentPage.value = 1
})

function formatCurrency(value: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value)
}

function truncate(text: string, maxLength: number) {
    if (!text) return ''
    return text.length > maxLength
        ? text.slice(0, maxLength) + '...'
        : text
}

function stripHtmlTags(html: string, maxLength: number = 100): string {
    if (!html) return ''
    const text = html.replace(/<[^>]*>/g, '')
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function getProductImage(product: any): string {
    if (product.image?.url) return product.image.url
    if (product.images?.[0]?.url) return product.images[0].url
    return ''
}

function getProductImageAlt(product: any): string {
    if (product.image?.alt) return product.image.alt
    if (product.images?.[0]?.alt) return product.images[0].alt
    return product.name || ''
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
.product-table-wrapper {
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
    min-width: 200px;
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
    max-width: 600px;
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

.table-container {
    padding: 24px;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
}

.product-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
}

.product-card.is-placeholder {
    opacity: 0.6;
    pointer-events: none;
}

.product-card.is-placeholder:hover {
    transform: none;
    box-shadow: none;
    border-color: #e5e7eb;
}

.product-card.is-placeholder {
    opacity: 0.6;
    pointer-events: none;
}

.product-card.is-placeholder:hover {
    transform: none;
    box-shadow: none;
    border-color: #e5e7eb;
}

.card-image-wrapper {
    position: relative;
    padding-top: 75%;
    background: #f8fafc;
    overflow: hidden;
}

.product-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 90%;
    object-fit: contain;
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

.product-name {
    font-weight: 600;
    color: #111827;
    font-size: 15px;
    line-height: 1.4;
}

.product-slug {
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

.description-preview {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
    flex: 1;
}

.description-preview .richtext-content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
    margin-top: auto;
}

.product-price {
    font-weight: 600;
    color: #059669;
    font-size: 14px;
}

.text-muted {
    color: #9ca3af;
    font-style: italic;
    font-size: 13px;
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

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-state svg {
    font-size: 48px;
    color: #d1d5db;
    margin-bottom: 16px;
}

.empty-state p {
    margin: 0 0 16px;
    color: #6b7280;
    font-size: 16px;
}

.btn-empty {
    padding: 10px 20px;
    background: #2563eb;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-empty:hover {
    background: #1d4ed8;
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
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    padding: 0 12px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled):not(.dots) {
    background: #f9fafb;
    border-color: #2563eb;
    color: #2563eb;
}

.pagination-btn.active {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
}

.pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.pagination-btn.dots {
    border: none;
    cursor: default;
    pointer-events: none;
}
</style>
