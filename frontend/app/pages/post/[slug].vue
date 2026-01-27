<template>
    <NuxtLayout name="main">
        <main v-if="loading" class="loading-wrapper" role="status" aria-live="polite">
            <div class="container">
                <Icon name="mdi:loading" class="spin loading-icon" aria-hidden="true" />
                <p>Đang Tải Bài Viết…</p>
            </div>
        </main>

        <main v-else class="post-detail-wrapper" :class="{ 'is-placeholder': displayPost.isPlaceholder }">
            <article class="post-detail-content">
                <div class="container">
                    <div class="post-container">
                        <div class="post-meta">
                            <span class="meta-category">{{ displayPost.category }}</span>
                            <span class="meta-date">
                                <Icon name="mdi:calendar-blank" aria-hidden="true" />
                                {{ displayPost.publishedAt || displayPost.date }}
                            </span>
                            <span class="meta-author">
                                <Icon name="mdi:account" aria-hidden="true" />
                                {{ displayPost.author }}
                            </span>
                        </div>

                        <h1 class="post-title">{{ displayPost.title }}</h1>

                        <figure class="post-thumbnail">
                            <img :src="thumbnailUrl" :alt="`Hình ảnh minh họa cho bài viết: ${displayPost.title}`" width="1200" height="675" loading="eager" />
                        </figure>

                        <div class="post-body" v-html="displayPost.content || defaultContent"></div>

                        <div v-if="displayTags.length > 0" class="post-tags" role="list">
                            <span v-for="(tag, idx) in displayTags" :key="idx" class="tag" role="listitem">
                                {{ tag }}
                            </span>
                        </div>

                        <div class="post-share">
                            <span class="share-label">Chia Sẻ:</span>
                            <a :href="shareUrls.facebook" class="share-btn facebook" target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ trên Facebook">
                                <Icon name="mdi:facebook" aria-hidden="true" />
                            </a>
                            <a :href="shareUrls.twitter" class="share-btn twitter" target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ trên Twitter">
                                <Icon name="mdi:twitter" aria-hidden="true" />
                            </a>
                            <a :href="shareUrls.linkedin" class="share-btn linkedin" target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ trên LinkedIn">
                                <Icon name="mdi:linkedin" aria-hidden="true" />
                            </a>
                        </div>

                        <section class="cta-section">
                            <div class="cta-content">
                                <h2>Cần Tư Vấn Giải Pháp?</h2>
                                <p>Liên hệ ngay để được hỗ trợ miễn phí từ chuyên gia của chúng tôi!</p>
                                <NuxtLink to="/contact" class="cta-btn">
                                    <Icon name="mdi:phone" aria-hidden="true" />
                                    Liên Hệ Ngay
                                </NuxtLink>
                            </div>
                        </section>

                        <section class="related-section" v-if="relatedPosts.length">
                            <h2 class="related-heading">Bài Viết Liên Quan</h2>
                            <div class="related-grid">
                                <NuxtLink v-for="item in relatedPosts" :key="item.id" :to="`/post/${item.slug}`" class="related-card">
                                    <div class="related-thumb-wrapper">
                                        <img :src="getRelatedThumbnail(item)" :alt="`Hình ảnh cho bài viết: ${item.title}`" class="related-thumb" width="400" height="225" loading="lazy" />
                                    </div>
                                    <div class="related-info">
                                        <time class="related-date" :datetime="item.publishedAt">
                                            {{ item.publishedAt }}
                                        </time>
                                        <h3 class="related-title">{{ item.title }}</h3>
                                    </div>
                                </NuxtLink>
                            </div>
                        </section>
                    </div>
                </div>
            </article>
        </main>
    </NuxtLayout>
</template>

<script setup>
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { generatePostSchema, generateBreadcrumbSchema } from '@/admin/utils/schema-generator'
import { PLACEHOLDER_POST_DETAIL } from '@/constants/placeholders'

const SITE_URL = 'https://sht.langochung.me'

const route = useRoute()
const slug = route.params.slug

const { previews, loading, loadPreviews } = usePreviewContext('collections/posts/items')

const post = ref(null)
const relatedPosts = ref([])

const displayPost = computed(() => {
    if (post.value) {
        return post.value
    }
    return PLACEHOLDER_POST_DETAIL
})

const thumbnailUrl = computed(() => {
    if (!displayPost.value.thumbnail) return PLACEHOLDER_POST_DETAIL.thumbnail

    if (typeof displayPost.value.thumbnail === 'object' && displayPost.value.thumbnail.url) {
        return displayPost.value.thumbnail.url
    }

    if (typeof displayPost.value.thumbnail === 'string') {
        return displayPost.value.thumbnail
    }

    return PLACEHOLDER_POST_DETAIL.thumbnail
})

const defaultContent = `
    <p class="lead">Bài viết đang được cập nhật nội dung...</p>
    <h2>Giới thiệu</h2>
    <p>Trong bối cảnh công nghệ phát triển nhanh chóng, việc cập nhật những xu hướng mới nhất là điều cần thiết cho mọi doanh nghiệp.</p>
`

onMounted(async () => {
    await loadPreviews({ limitCount: 50 })

    const publishedPosts = previews.value.filter(p => p.status === 'published')
    post.value = publishedPosts.find(p => p.slug === slug)

    if (post.value) {
        relatedPosts.value = publishedPosts
            .filter(p => p.category === post.value.category && p.id !== post.value.id)
            .slice(0, 3)
    }
})

const getRelatedThumbnail = (item) => {
    if (!item.thumbnail) return '/images/placeholder.jpg'
    if (typeof item.thumbnail === 'object' && item.thumbnail.url) {
        return item.thumbnail.url
    }
    if (typeof item.thumbnail === 'string') {
        return item.thumbnail
    }
    return '/images/placeholder.jpg'
}

const displayTags = computed(() => {
    if (!displayPost.value?.tags || !Array.isArray(displayPost.value.tags)) return []

    return displayPost.value.tags.map(tag => {
        if (typeof tag === 'string') return tag
        if (typeof tag === 'object' && tag !== null && 'value' in tag) return tag.value
        if (typeof tag === 'object' && tag !== null && 'name' in tag) return tag.name
        return String(tag)
    })
})

const shareUrls = computed(() => {
    if (!post.value) return { facebook: '', twitter: '', linkedin: '' }

    const url = `${SITE_URL}/post/${post.value.slug}`
    const title = encodeURIComponent(post.value.title)
    const description = encodeURIComponent(post.value.description || post.value.excerpt || '')

    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${title}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
})

const postSchema = computed(() => {
    if (!post.value) return null
    return generatePostSchema(post.value, SITE_URL)
})


const breadcrumbSchema = computed(() => {
    if (!post.value) return null
    return generateBreadcrumbSchema([
        { name: 'Trang Chủ', url: SITE_URL },
        { name: 'Tin Tức', url: `${SITE_URL}/post` },
        { name: post.value.title, url: `${SITE_URL}/post/${post.value.slug}` },
    ])
})

useSeoMeta({
    title: () => post.value ? `${post.value.title} - SHT Security Blog` : 'Bài viết không tồn tại',
    description: () => post.value?.description || post.value?.excerpt || '',
    ogTitle: () => post.value?.title || '',
    ogDescription: () => post.value?.description || post.value?.excerpt || '',
    ogImage: () => post.value?.thumbnail || post.value?.image || '',
    ogType: 'article',
})

useHead({
    script: computed(() => {
        if (!post.value) return []
        const scripts = []
        if (postSchema.value) {
            scripts.push({ type: 'application/ld+json', innerHTML: JSON.stringify(postSchema.value) })
        }
        if (breadcrumbSchema.value) {
            scripts.push({ type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbSchema.value) })
        }
        return scripts
    }),
})
</script>

<style scoped>
@import "./styles/post-slug.css";
</style>
