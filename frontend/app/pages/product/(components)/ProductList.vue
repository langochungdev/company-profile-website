<template>
    <section class="product-list-wrapper">
        <div class="container">
            <div class="search-section">
                <div class="search-input-wrapper">
                    <Icon name="mdi:magnify" class="search-icon" />
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm sản phẩm..." class="search-input" @input="handleSearch" />
                    <button v-if="searchQuery" @click="clearSearch" class="btn-clear-search">
                        <Icon name="mdi:close" />
                    </button>
                </div>
            </div>

            <div class="filter-wrapper">
                <div class="filter-label">Danh mục:</div>
                <div class="filter-list">
                    <button v-for="cat in categories" :key="cat" class="filter-chip" :class="{ active: currentCategory === cat }" @click="setCategory(cat)">
                        {{ cat }}
                    </button>
                </div>
            </div>

            <div class="main-content-wrapper">
                <ClientOnly>
                    <aside v-if="availableTags.length > 0" class="tags-sidebar">
                        <div class="sidebar-header">
                            <h3>Tags</h3>
                            <button v-if="selectedTags.length > 0" @click="clearTags" class="btn-clear-tags">
                                <Icon name="mdi:close" />
                                Xóa
                            </button>
                        </div>
                        <div class="tags-list-vertical">
                            <button v-for="tag in availableTags" :key="tag" @click="toggleTag(tag)" class="tag-item-vertical" :class="{ active: selectedTags.includes(tag) }">
                                <span class="tag-name">{{ tag }}</span>
                                <Icon v-if="selectedTags.includes(tag)" name="mdi:check" class="tag-check" />
                            </button>
                        </div>
                    </aside>
                </ClientOnly>

                <div class="products-content">
                    <div v-if="loading || isSearching" class="loading-state">
                        <Icon name="mdi:loading" class="spin" />
                        <span>{{ isSearching ? 'Đang tìm kiếm...' : 'Đang tải sản phẩm...' }}</span>
                    </div>

                    <div v-else class="product-grid">
                        <NuxtLink v-for="product in displayProducts" :key="product.id" :to="`/product/${product.slug}`" class="product-card">
                            <div class="card-image-wrapper">
                                <img :src="getProductImage(product)" :alt="getProductImageAlt(product)" class="product-img" loading="lazy" />
                                <div class="action-overlay">
                                    <button class="btn-detail">Xem Chi Tiết</button>
                                </div>
                            </div>

                            <div class="card-content">
                                <h3 class="product-name">{{ product.name }}</h3>

                                <div class="tags-list" v-if="product.tags?.length">
                                    <span v-for="(tag, index) in product.tags.slice(0, 3)" :key="index" class="tag-item">
                                        {{ tag.value || tag }}
                                    </span>
                                </div>

                                <div class="card-footer">
                                    <div class="price-box">
                                        <span class="price-value" v-if="product.price">{{ formatPrice(product.price) }}</span>
                                        <span class="price-contact" v-else>Liên hệ</span>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
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
        </div>
    </section>
</template>

<script setup>
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'
import { ProductsApiService } from '@/admin/services/products-api.service'
import { PLACEHOLDER_PRODUCTS } from '@/constants/placeholders'

const LISTING_CONFIG = {
    gridColumns: 3,
    itemsPerPage: 12,
    showPrice: true,
}

const currentCategory = ref('Tất cả')
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const currentPage = ref(1)
const selectedTags = ref([])
let searchTimeout = null

const { config, loadConfig } = useCollectionConfig('collections/products/items')
const { previews, loading, filterByCategory } = usePreviewContext('collections/products/items')

const categories = computed(() => {
    if (!config.value?.categories?.length) return ['Tất cả']
    return ['Tất cả', ...config.value.categories.map(c => c.name)]
})

const availableTags = computed(() => {
    if (!config.value?.tags?.length) return []
    return config.value.tags.map(t => t.name).sort()
})

const getDisplayTags = (tags) => {
    if (!tags) return []
    return tags.map(tag => {
        if (typeof tag === 'string') return tag
        if (typeof tag === 'object' && tag !== null && 'value' in tag) return tag.value
        if (typeof tag === 'object' && tag !== null && 'name' in tag) return tag.name
        return String(tag)
    })
}

const allProducts = computed(() => {
    let products = []

    if (searchQuery.value.trim()) {
        products = searchResults.value.length > 0 ? searchResults.value : []
    } else if (previews.value.length === 0 && !loading.value) {
        products = PLACEHOLDER_PRODUCTS
    } else {
        products = previews.value
    }

    if (currentCategory.value && currentCategory.value !== 'Tất cả') {
        products = products.filter(product => product.category === currentCategory.value)
    }

    if (selectedTags.value.length > 0) {
        products = products.filter(product => {
            const productTags = getDisplayTags(product.tags || [])
            return selectedTags.value.some(tag => productTags.includes(tag))
        })
    }

    return products
})

const totalPages = computed(() => {
    return Math.ceil(allProducts.value.length / LISTING_CONFIG.itemsPerPage)
})

const displayProducts = computed(() => {
    const start = (currentPage.value - 1) * LISTING_CONFIG.itemsPerPage
    const end = start + LISTING_CONFIG.itemsPerPage
    return allProducts.value.slice(start, end)
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

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const getProductImage = (product) => {
    // Try new format: image object
    if (product.image?.url) return product.image.url

    // Try old format: images array
    if (product.images?.[0]?.url) return product.images[0].url

    // Fallback: direct string
    return product.image || product.images?.[0] || ''
}

const getProductImageAlt = (product) => {
    // Try new format: image object
    if (product.image?.alt) return product.image.alt

    // Try old format: images array
    if (product.images?.[0]?.alt) return product.images[0].alt

    // Fallback: product name
    return product.name || ''
}

onMounted(async () => {
    await loadConfig()
    await filterByCategory(null)
})

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)

    searchTimeout = setTimeout(async () => {
        if (!searchQuery.value.trim()) {
            searchResults.value = []
            isSearching.value = false
            currentPage.value = 1
            return
        }

        isSearching.value = true
        currentPage.value = 1
        try {
            const { hits } = await ProductsApiService.search(searchQuery.value)
            searchResults.value = hits
        } catch (error) {

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
    currentCategory.value = 'Tất cả'
    currentPage.value = 1
}

const setCategory = async (cat) => {
    if (searchQuery.value.trim()) {
        clearSearch()
    }

    currentCategory.value = cat
    currentPage.value = 1
    if (cat === 'Tất cả') {
        await filterByCategory(null)
    } else {
        await filterByCategory(cat)
    }
}

const toggleTag = (tag) => {
    const index = selectedTags.value.indexOf(tag)
    if (index > -1) {
        selectedTags.value.splice(index, 1)
    } else {
        selectedTags.value.push(tag)
    }
    currentPage.value = 1
}

const clearTags = () => {
    selectedTags.value = []
    currentPage.value = 1
}
</script>

<style scoped>
@import "../styles/product-list.css";
</style>
