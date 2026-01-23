<!-- Chức năng: Trang chi tiết sản phẩm -->
<template>
    <NuxtLayout name="main">
        <div class="product-detail-wrapper">
            <div v-if="loading" class="loading-container">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải sản phẩm...</span>
            </div>

            <div v-else-if="product" class="container">
                <nav class="breadcrumb">
                    <NuxtLink to="/">Trang chủ</NuxtLink>
                    <Icon name="mdi:chevron-right" />
                    <NuxtLink to="/product">Sản phẩm</NuxtLink>
                    <Icon name="mdi:chevron-right" />
                    <span>{{ product.name }}</span>
                </nav>

                <div class="product-detail-grid">
                    <div class="media-section">
                        <div class="main-media">
                            <img v-if="!isVideoSelected" :src="selectedMedia" :alt="product.name" />
                            <div v-else class="video-wrapper">
                                <iframe :src="selectedMedia" frameborder="0" allowfullscreen></iframe>
                            </div>
                        </div>

                        <div v-if="allMedia.length > 1" class="media-thumbs">
                            <button v-for="(media, idx) in allMedia" :key="idx" class="thumb-item" :class="{ active: selectedMediaIndex === idx, 'is-video': media.type === 'video' }" @click="selectMedia(idx)">
                                <img v-if="media.type === 'image'" :src="media.url" :alt="media.caption || `Media ${idx + 1}`" />
                                <div v-else class="video-thumb">
                                    <Icon name="mdi:play-circle" />
                                </div>
                            </button>
                        </div>
                    </div>

                    <div class="info-section">
                        <div class="category-label">{{ product.category }}</div>
                        <h1 class="product-title">{{ product.name }}</h1>

                        <div v-if="product.tags?.length" class="tags-list">
                            <span v-for="tag in product.tags" :key="tag" class="tag-item">{{ tag }}</span>
                        </div>

                        <div class="price-section">
                            <div class="price-label">Giá tham khảo:</div>
                            <div class="price-value" v-if="product.price">{{ formatPrice(product.price) }}</div>
                            <div class="price-contact" v-else>Liên hệ để biết giá</div>
                        </div>

                        <div class="description-section">
                            <p>{{ product.description }}</p>
                        </div>

                        <div class="action-buttons">
                            <NuxtLink to="/contact" class="btn-contact">
                                <Icon name="mdi:phone" />
                                Liên hệ tư vấn
                            </NuxtLink>
                            <button class="btn-quote">
                                <Icon name="mdi:file-document" />
                                Yêu cầu báo giá
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="product.content" class="content-section">
                    <h2>Thông tin chi tiết</h2>
                    <div class="richtext-content" v-html="product.content"></div>
                </div>

                <div class="related-section">
                    <h2>Sản phẩm liên quan</h2>
                    <div class="related-grid">
                        <NuxtLink v-for="item in displayRelated" :key="item.id" :to="item.isPlaceholder ? '#' : `/product/${item.slug}`" class="related-card" :class="{ 'is-placeholder': item.isPlaceholder }">
                            <div class="related-image">
                                <img :src="item.image" :alt="item.name" loading="lazy" />
                            </div>
                            <div class="related-info">
                                <div class="related-category">{{ item.category }}</div>
                                <h4 class="related-name">{{ item.name }}</h4>
                                <div class="related-price" v-if="item.price">{{ formatPrice(item.price) }}</div>
                                <div class="related-contact" v-else>Liên hệ</div>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div v-else class="not-found">
                <Icon name="mdi:alert-circle-outline" />
                <h2>Không tìm thấy sản phẩm</h2>
                <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <NuxtLink to="/product" class="btn-back">
                    <Icon name="mdi:arrow-left" />
                    Quay lại danh sách
                </NuxtLink>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { useCollectionContext } from '@/admin/composables/useCollectionContext'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { PLACEHOLDER_PRODUCT_DETAIL, PLACEHOLDER_RELATED_PRODUCTS } from '@/constants/placeholders'

const route = useRoute()
const slug = route.params.slug

const product = ref(null)
const loading = ref(true)
const selectedMediaIndex = ref(0)
const relatedProducts = ref([])

const { items, loadItems } = useCollectionContext({ path: 'collections/products/items' })
const { previews, loadPreviews } = usePreviewContext('collections/products/items')

const allMedia = computed(() => {
    if (!product.value) return []

    const mediaList = []

    if (product.value.image) {
        mediaList.push({ type: 'image', url: product.value.image, caption: 'Ảnh chính' })
    }

    if (product.value.media?.length) {
        mediaList.push(...product.value.media)
    } else if (product.value.gallery?.length) {
        product.value.gallery.forEach(img => {
            mediaList.push({ type: 'image', url: img.url, caption: img.caption })
        })
    }

    return mediaList
})

const selectedMedia = computed(() => {
    return allMedia.value[selectedMediaIndex.value]?.url || product.value?.image || ''
})

const isVideoSelected = computed(() => {
    return allMedia.value[selectedMediaIndex.value]?.type === 'video'
})

const displayRelated = computed(() => {
    if (relatedProducts.value.length > 0) {
        return relatedProducts.value
    }
    return PLACEHOLDER_RELATED_PRODUCTS
})

const selectMedia = (index) => {
    selectedMediaIndex.value = index
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

onMounted(async () => {
    try {
        await loadItems()

        const foundProduct = items.value.find(p => p.slug === slug)

        if (foundProduct) {
            product.value = foundProduct

            await loadPreviews({ limitCount: 5 })
            relatedProducts.value = previews.value
                .filter(p => p.category === foundProduct.category && p.slug !== slug)
                .slice(0, 4)
        } else {
            product.value = PLACEHOLDER_PRODUCT_DETAIL
        }
    } catch (error) {
        console.error('Error loading product:', error)
        product.value = PLACEHOLDER_PRODUCT_DETAIL
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
@import "./styles/product-slug.css";
</style>
