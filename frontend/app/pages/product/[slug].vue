<template>
    <NuxtLayout name="main">
        <main v-if="loading" class="loading-wrapper">
            <div class="container">
                <Icon name="mdi:loading" class="spin loading-icon" />
                <p>Đang tải sản phẩm...</p>
            </div>
        </main>

        <main v-else-if="product" class="product-detail-wrapper">
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

                            <div class="features-section" v-if="product.features?.length">
                                <h3 class="features-title">Tính năng nổi bật</h3>
                                <ul class="features-list">
                                    <li v-for="(feature, index) in product.features" :key="index">
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
import { useDetailContext } from '@/admin/composables/useDetailContext'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { productDetailConfig } from './productDetail.cms'
import { generateProductSchema, generateBreadcrumbSchema } from '@/admin/utils/schema-generator'

const SITE_URL = 'https://sht.langochung.me'

const route = useRoute()
const slug = route.params.slug

const { items, loading, loadItems } = useDetailContext(productDetailConfig)
const { previews, loadPreviews } = usePreviewContext('collections/products/items')

const product = ref(null)
const relatedProducts = ref([])

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

const productSchema = computed(() => {
    if (!product.value) return null
    return generateProductSchema(product.value, SITE_URL)
})

const breadcrumbSchema = computed(() => {
    if (!product.value) return null
    return generateBreadcrumbSchema([
        { name: 'Trang Chủ', url: SITE_URL },
        { name: 'Sản Phẩm', url: `${SITE_URL}/product` },
        { name: product.value.name, url: `${SITE_URL}/product/${product.value.slug}` },
    ])
})

useSeoMeta({
    title: () => product.value ? `${product.value.name} - SHT Security` : 'Sản phẩm không tồn tại',
    description: () => product.value?.description || '',
    ogTitle: () => product.value?.name || '',
    ogDescription: () => product.value?.description || '',
    ogImage: () => product.value?.image || '',
    ogType: 'product',
})

useHead({
    script: computed(() => {
        if (!product.value) return []
        const scripts = []
        if (productSchema.value) {
            scripts.push({ type: 'application/ld+json', innerHTML: JSON.stringify(productSchema.value) })
        }
        if (breadcrumbSchema.value) {
            scripts.push({ type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbSchema.value) })
        }
        return scripts
    }),
})
</script>

<style scoped>
@import "@/styles/product/slug/desktop.css";
@import "@/styles/product/slug/mobile.css";
</style>
