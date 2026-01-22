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
                            <div class="main-media">
                                <div class="media-display">
                                    <img v-if="activeMediaType === 'image'" :src="activeMedia" :alt="displayProduct.name" />
                                    <div v-else class="video-placeholder">
                                        <Icon name="mdi:play-circle" class="play-icon" />
                                        <span>Video Demo</span>
                                    </div>
                                    <span v-if="displayProduct.badge" class="badge" :class="getBadgeClass(displayProduct.badge)">
                                        {{ displayProduct.badge }}
                                    </span>
                                </div>
                            </div>
                            <div class="media-thumbnails">
                                <button v-for="(media, index) in displayMedia" :key="index" class="thumb-item" :class="{ active: activeMediaIndex === index }" @click="activeMediaIndex = index">
                                    <img v-if="media.type === 'image'" :src="media.url" :alt="`Media ${index + 1}`" />
                                    <div v-else class="thumb-video">
                                        <Icon name="mdi:play-circle" />
                                    </div>
                                    <span class="media-type-badge">{{ media.type === 'image' ? 'IMG' : 'VID' }}</span>
                                </button>
                            </div>
                        </div>

                        <div class="product-info">
                            <span class="category-badge" :class="{ 'is-placeholder': !displayProduct.category }">
                                {{ displayProduct.category || 'Chưa phân loại' }}
                            </span>

                            <h1 class="product-name" :class="{ 'is-placeholder': !displayProduct.name }">
                                {{ displayProduct.name || 'Tên sản phẩm' }}
                            </h1>

                            <p class="product-summary" :class="{ 'is-placeholder': !displayProduct.description }">
                                {{ displayProduct.description || 'Mô tả sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.' }}
                            </p>

                            <div class="price-box">
                                <span class="price-label">Giá tham khảo:</span>
                                <span class="price-value" v-if="displayProduct.price">{{ formatPrice(displayProduct.price) }}</span>
                                <span class="price-contact" v-else>Liên hệ để được báo giá</span>
                            </div>

                            <div class="tags-section" v-if="displayTags.length">
                                <h3 class="tags-title">Phân loại</h3>
                                <div class="tags-list">
                                    <span v-for="tag in displayTags" :key="tag" class="tag-item">{{ tag }}</span>
                                </div>
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

                    <div class="article-section" v-if="displayProduct.content || displayProduct.isPlaceholder">
                        <h2 class="article-title">
                            <Icon name="mdi:text-box-outline" class="title-icon" />
                            Bài Viết Chi Tiết
                        </h2>
                        <div class="article-note">
                            <Icon name="mdi:information" />
                            <span>Hỗ trợ nhúng: YouTube, TikTok, Facebook, Bảng, Media</span>
                        </div>
                        <div v-if="displayProduct.content" class="article-content tiptap-content" v-html="displayProduct.content"></div>
                        <div v-else class="article-content tiptap-content placeholder-content">
                            <p>Nội dung đang được cập nhật...</p>
                            <div class="embed-placeholder">
                                <div class="embed-item youtube">
                                    <Icon name="mdi:youtube" />
                                    <span>YouTube Video</span>
                                </div>
                                <div class="embed-item tiktok">
                                    <Icon name="mdi:music-note" />
                                    <span>TikTok</span>
                                </div>
                                <div class="embed-item facebook">
                                    <Icon name="mdi:facebook" />
                                    <span>Facebook</span>
                                </div>
                            </div>
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
const activeMediaIndex = ref(0)

const mockMedia = ref([
    { type: 'image', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
    { type: 'video', url: '' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
])

const mockTags = ref(['Sản phẩm nổi bật', 'Best Seller', 'Doanh nghiệp'])

const activeMedia = computed(() => {
    const media = displayMedia.value[activeMediaIndex.value]
    if (media?.type === 'image') {
        return media.url || displayProduct.value.image
    }
    return ''
})

const activeMediaType = computed(() => {
    return displayMedia.value[activeMediaIndex.value]?.type || 'image'
})

const displayMedia = computed(() => {
    if (product.value?.media && Array.isArray(product.value.media) && product.value.media.length > 0) {
        return product.value.media
    }
    return mockMedia.value
})

const displayProduct = computed(() => {
    if (product.value) {
        return product.value
    }
    return PLACEHOLDER_PRODUCT_DETAIL
})

const displayTags = computed(() => {
    if (product.value?.tags && Array.isArray(product.value.tags) && product.value.tags.length > 0) {
        return product.value.tags
    }
    return mockTags.value
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
