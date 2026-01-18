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
                <ProductItem v-for="product in previews" :key="product.id" :product="product" />
            </div>

            <div v-if="!loading && previews.length === 0" class="empty-state">
                <div class="empty-icon">
                    <Icon name="mdi:package-variant-closed-remove" />
                </div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Vui lòng thử chọn danh mục khác</p>
            </div>

            <div v-if="hasMore && !loading" class="load-more-wrapper">
                <button class="load-more-btn" @click="loadMore">
                    <Icon name="mdi:plus" />
                    Xem thêm sản phẩm
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import ProductItem from './ProductItem.vue'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'

const LISTING_CONFIG = {
    gridColumns: 3,
    itemsPerPage: 12,
    showPrice: true,
    showBadge: true,
}

const CATEGORIES = ['Tất cả', 'Camera AI', 'WiFi Doanh Nghiệp', 'Switch & Router', 'Báo Cháy', 'Access Control']

const categories = CATEGORIES
const currentCategory = ref('Tất cả')

const { previews, loading, hasMore, loadPreviews, loadMore: loadMorePreviews, filterByCategory } = usePreviewContext('collections/products/items')

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
@import "@/styles/product/product-list/desktop.css";
@import "@/styles/product/product-list/mobile.css";
</style>
