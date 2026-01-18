<template>
    <section class="product-list-section">
        <div class="container">

            <div class="filter-wrapper">
                <div class="filter-label">Danh mục:</div>
                <div class="filter-list">
                    <button v-for="cat in categories" :key="cat" class="filter-chip" :class="{ active: currentCategory === cat }" @click="setCategory(cat)">
                        {{ cat }}
                    </button>
                </div>
            </div>


            <div class="product-grid">
                <ProductItem v-for="product in filteredProducts" :key="product.id" :product="product" />
            </div>


            <div v-if="filteredProducts.length === 0" class="empty-state">
                <div class="empty-icon">
                    <Icon name="mdi:package-variant-closed-remove" />
                </div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Vui lòng thử chọn danh mục khác</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import ProductItem from './ProductItem.vue'
import { PRODUCTS, PRODUCT_CATEGORIES } from '../productListing.cms'

const categories = PRODUCT_CATEGORIES
const currentCategory = ref('Tất cả')

const setCategory = (cat) => {
    currentCategory.value = cat
}

const filteredProducts = computed(() => {
    if (currentCategory.value === 'Tất cả') return PRODUCTS
    return PRODUCTS.filter(product => product.category === currentCategory.value)
})
</script>

<style scoped>
@import "@/styles/product/product-list/desktop.css";
@import "@/styles/product/product-list/mobile.css";
</style>
