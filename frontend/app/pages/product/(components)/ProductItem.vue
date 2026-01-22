<template>
    <NuxtLink :to="`/product/${product.slug}`" class="product-card">
        <div class="card-image-wrapper">
            <img :src="product.image" :alt="product.name" class="product-img" loading="lazy" />
            <div v-if="product.badge" class="badge" :class="getBadgeClass(product.badge)">
                {{ product.badge }}
            </div>
            <div class="action-overlay">
                <button class="btn-detail">Xem Chi Tiết</button>
            </div>
        </div>

        <div class="card-content">
            <div class="category">{{ product.category }}</div>
            <h3 class="product-name">{{ product.name }}</h3>

            <div class="features-list" v-if="product.features?.length">
                <div v-for="(feature, index) in product.features.slice(0, 3)" :key="index" class="feature-item">
                    <Icon name="mdi:check-circle" class="check-icon" />
                    <span>{{ feature.text || feature }}</span>
                </div>
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
</template>

<script setup>
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const getBadgeClass = (badge) => {
    if (badge === 'Best Seller') return 'badge-hot'
    if (badge === 'New') return 'badge-new'
    return 'badge-default'
}
</script>

<style scoped>
@import "../styles/product-item.css";
</style>
