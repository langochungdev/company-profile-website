<template>
    <NuxtLayout name="main">
        <main v-if="loading" class="loading-wrapper">
            <div class="container">
                <Icon name="mdi:loading" class="spin loading-icon" />
                <p>Đang tải sản phẩm...</p>
            </div>
        </main>

        <main v-else class="product-detail-wrapper" :class="{ 'is-placeholder': displayProduct.isPlaceholder }">
            <section class="product-detail-content">
                <div class="container">
                    <div class="detail-grid">
                        <div class="product-gallery">
                            <div class="main-image">
                                <img :src="displayProduct.image" :alt="displayProduct.name" />
                                <span v-if="displayProduct.badge" class="badge" :class="getBadgeClass(displayProduct.badge)">
                                    {{ displayProduct.badge }}
                                </span>
                            </div>
                        </div>

                        <div class="product-info">
                            <span class="category">{{ displayProduct.category }}</span>
                            <h1 class="product-name">{{ displayProduct.name }}</h1>
                            <p class="product-desc">{{ displayProduct.description }}</p>

                            <div class="price-box">
                                <span class="price-label">Giá tham khảo:</span>
                                <span class="price-value" v-if="displayProduct.price">{{ formatPrice(displayProduct.price) }}</span>
                                <span class="price-contact" v-else>Liên hệ để được báo giá</span>
                            </div>

                            <div class="features-section" v-if="displayProduct.features?.length">
                                <h3 class="features-title">Tính năng nổi bật</h3>
                                <ul class="features-list">
                                    <li v-for="(feature, index) in displayProduct.features" :key="index">
                                        <Icon name="mdi:check-circle" class="check-icon" />
                                        {{ feature.text || feature }}
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

                    <div class="article-section" v-if="displayProduct.content">
                        <h2 class="article-title">
                            <Icon name="mdi:text-box-outline" class="title-icon" />
                            Thông Tin Chi Tiết
                        </h2>
                        <div class="article-content tiptap-content" v-html="displayProduct.content"></div>
                    </div>

                    <div class="article-section" v-else-if="displayProduct.isPlaceholder">
                        <h2 class="article-title">
                            <Icon name="mdi:text-box-outline" class="title-icon" />
                            Thông Tin Chi Tiết
                        </h2>
                        <div class="article-content tiptap-content placeholder-content">
                            <p>Nội dung đang được cập nhật...</p>
                            <p>Vui lòng liên hệ với chúng tôi để được tư vấn chi tiết về sản phẩm này.</p>
                        </div>
                    </div>

                    <div class="related-section" v-if="relatedProducts.length">
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
    </NuxtLayout>
</template>

<script setup>
import { useCollectionContext } from '@/admin/composables/useCollectionContext'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { useAutoSeo } from '@/admin/composables/useAutoSeo'
import { productDetailConfig } from './productDetail.cms'
import { PLACEHOLDER_PRODUCT_DETAIL } from '@/constants/placeholders'

const route = useRoute()
const slug = route.params.slug

const { items, loading, loadItems } = useCollectionContext(productDetailConfig)
const { previews, loadPreviews } = usePreviewContext('collections/products/items')

const product = ref(null)
const relatedProducts = ref([])

const displayProduct = computed(() => {
    if (product.value) {
        return product.value
    }
    return PLACEHOLDER_PRODUCT_DETAIL
})

onMounted(async () => {
    await loadItems()
    product.value = items.value.find(p => p.slug === slug)

    if (product.value) {
        await loadPreviews({ category: product.value.category, limitCount: 4 })
        relatedProducts.value = previews.value.filter(p => p.id !== product.value.id).slice(0, 3)
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

useAutoSeo(productDetailConfig, product)
</script>

<style scoped>
@import "@/styles/product/slug/desktop.css";
@import "@/styles/product/slug/mobile.css";
</style>
