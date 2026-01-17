<template>
    <NuxtLayout name="main">
        <main v-if="product">
            <section class="product-detail-content">
                <div class="container">
                    <div class="detail-grid">
                        <div class="product-gallery">
                            <div class="main-image">
                                <img :src="product.image" :alt="product.name" />
                                <span v-if="product.badge" class="badge" :class="getBadgeClass(product.badge)">
                                    {{ product.badge }}
                                </span>
                            </div>
                        </div>

                        <div class="product-info">
                            <span class="category">{{ product.category }}</span>
                            <h1 class="product-name">{{ product.name }}</h1>
                            <p class="product-desc">{{ product.description }}</p>

                            <div class="price-box">
                                <span class="price-label">Giá tham khảo:</span>
                                <span class="price-value" v-if="product.price">{{ formatPrice(product.price) }}</span>
                                <span class="price-contact" v-else>Liên hệ để được báo giá</span>
                            </div>

                            <div class="features-section">
                                <h3 class="features-title">Tính năng nổi bật</h3>
                                <ul class="features-list">
                                    <li v-for="(feature, index) in product.features" :key="index">
                                        <Icon name="mdi:check-circle" class="check-icon" />
                                        {{ feature }}
                                    </li>
                                </ul>
                            </div>

                            <div class="action-buttons">
                                <NuxtLink to="/contact" class="btn-primary">
                                    <Icon name="mdi:phone" />
                                    Liên Hệ Tư Vấn
                                </NuxtLink>
                                <a href="https://zalo.me/0901234567" target="_blank" class="btn-zalo">
                                    <Icon name="mdi:chat" />
                                    Chat Zalo
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="related-section">
                        <h2 class="related-title">Sản Phẩm Liên Quan</h2>
                        <div class="related-grid">
                            <NuxtLink v-for="item in relatedProducts" :key="item.id" :to="`/product/${item.slug}`" class="related-card">
                                <div class="related-image">
                                    <img :src="item.image" :alt="item.name" />
                                </div>
                                <div class="related-info">
                                    <span class="related-category">{{ item.category }}</span>
                                    <h4 class="related-name">{{ item.name }}</h4>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <main v-else class="not-found">
            <div class="container">
                <Icon name="mdi:alert-circle-outline" class="not-found-icon" />
                <h1>Không tìm thấy sản phẩm</h1>
                <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <NuxtLink to="/product" class="back-btn">Quay lại trang sản phẩm</NuxtLink>
            </div>
        </main>
    </NuxtLayout>
</template>

<script setup>
import { PRODUCTS } from '../productListing.cms'

const route = useRoute()
const slug = route.params.slug

const product = computed(() => PRODUCTS.find(p => p.slug === slug))

const relatedProducts = computed(() => {
    if (!product.value) return []
    return PRODUCTS.filter(p => p.category === product.value.category && p.id !== product.value.id).slice(0, 3)
})

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const getBadgeClass = (badge) => {
    if (badge === 'Best Seller') return 'badge-hot'
    if (badge === 'New') return 'badge-new'
    return 'badge-default'
}

useSeoMeta({
    title: () => product.value ? `${product.value.name} - SHT Security` : 'Sản phẩm không tồn tại',
    description: () => product.value?.description || '',
    ogTitle: () => product.value?.name || '',
    ogDescription: () => product.value?.description || '',
})
</script>

<style scoped>
@import "./styles/product-detail/desktop.css";
@import "./styles/product-detail/mobile.css";
</style>
