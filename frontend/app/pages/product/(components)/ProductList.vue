<template>
    <section class="product-list-wrapper">
        <div class="container">
            <div class="filter-wrapper">
                <div class="filter-label">Danh mục:</div>
                <div class="filter-list">
                    <button v-for="cat in categories" :key="cat" class="filter-chip" :class="{ active: currentCategory === cat }" @click="setCategory(cat)">
                        {{ cat }}
                    </button>
                </div>
            </div>

            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải sản phẩm...</span>
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
                        <div class="category">{{ product.category }}</div>
                        <h3 class="product-name">{{ product.name }}</h3>

                        <div class="tags-list" v-if="product.tags?.length">
                            <span v-for="(tag, index) in product.tags.slice(0, 3)" :key="index" class="tag-item">
                                {{ tag.value || tag }}
                            </span>
                        </div>

                        <div class="card-footer">
                            <div class="price-box">
                                <span class="price-label">Giá tham khảo:</span>
                                <span class="price-value" v-if="product.price">{{ formatPrice(product.price) }}</span>
                                <span class="price-contact" v-else>Liên hệ</span>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div v-if="hasMore && !loading && previews.length > 0" class="load-more-wrapper">
                <button class="load-more-btn" @click="loadMore">
                    <Icon name="mdi:plus" />
                    Xem thêm sản phẩm
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { PLACEHOLDER_PRODUCTS } from '@/constants/placeholders'

const LISTING_CONFIG = {
    gridColumns: 3,
    itemsPerPage: 12,
    showPrice: true,
}

const CATEGORIES = ['Tất cả', 'Camera AI', 'WiFi Doanh Nghiệp', 'Switch & Router', 'Báo Cháy', 'Access Control']

const categories = CATEGORIES
const currentCategory = ref('Tất cả')

const { previews, loading, hasMore, loadPreviews, loadMore: loadMorePreviews, filterByCategory } = usePreviewContext('collections/products/items')

const displayProducts = computed(() => {
    if (previews.value.length === 0 && !loading.value) {
        return PLACEHOLDER_PRODUCTS
    }
    return previews.value
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

onMounted(() => {
    loadPreviews({ limitCount: LISTING_CONFIG.itemsPerPage })
})

const setCategory = async (cat) => {
    currentCategory.value = cat
    if (cat === 'Tất cả') {
        await filterByCategory(null)
    } else {
        await filterByCategory(cat)
    }
}

const loadMore = () => {
    loadMorePreviews()
}
</script>

<style scoped>
@import "../styles/product-list.css";
</style>
