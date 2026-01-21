<template>
    <NuxtLayout name="main">
        <main v-if="loading" class="loading-wrapper">
            <div class="container">
                <Icon name="mdi:loading" class="spin loading-icon" />
                <p>Đang tải bài viết...</p>
            </div>
        </main>

        <main v-else class="post-detail-wrapper" :class="{ 'is-placeholder': displayPost.isPlaceholder }">
            <article class="post-detail-content">
                <div class="container">
                    <div class="post-grid">
                        <div class="post-main">
                            <div class="post-meta">
                                <span class="meta-category">{{ displayPost.category }}</span>
                                <span class="meta-date">
                                    <Icon name="mdi:calendar-blank" />
                                    {{ displayPost.publishedAt || displayPost.date }}
                                </span>
                                <span class="meta-author">
                                    <Icon name="mdi:account" />
                                    {{ displayPost.author }}
                                </span>
                            </div>

                            <h1 class="post-title">{{ displayPost.title }}</h1>

                            <div class="post-thumbnail">
                                <img :src="displayPost.thumbnail || displayPost.image" :alt="displayPost.title" />
                            </div>

                            <div class="post-body" v-html="displayPost.content || defaultContent"></div>

                            <div class="post-tags">
                                <span class="tag">{{ displayPost.category }}</span>
                                <span class="tag">SHT Security</span>
                                <span class="tag">Giải pháp</span>
                            </div>

                            <div class="post-share">
                                <span class="share-label">Chia sẻ:</span>
                                <a href="#" class="share-btn facebook">
                                    <Icon name="mdi:facebook" />
                                </a>
                                <a href="#" class="share-btn twitter">
                                    <Icon name="mdi:twitter" />
                                </a>
                                <a href="#" class="share-btn linkedin">
                                    <Icon name="mdi:linkedin" />
                                </a>
                            </div>
                        </div>

                        <aside class="post-sidebar">
                            <div class="sidebar-cta">
                                <h3>Cần Tư Vấn?</h3>
                                <p>Liên hệ ngay để được hỗ trợ miễn phí!</p>
                                <NuxtLink to="/contact" class="cta-btn">
                                    <Icon name="mdi:phone" />
                                    Liên Hệ Ngay
                                </NuxtLink>
                            </div>

                            <div class="sidebar-related" v-if="relatedPosts.length">
                                <h3>Bài Viết Liên Quan</h3>
                                <div class="related-list">
                                    <NuxtLink v-for="item in relatedPosts" :key="item.id" :to="`/post/${item.slug}`" class="related-item">
                                        <img :src="item.thumbnail || item.image" :alt="item.title" class="related-thumb" />
                                        <div class="related-info">
                                            <span class="related-date">{{ item.publishedAt }}</span>
                                            <h4 class="related-title">{{ item.title }}</h4>
                                        </div>
                                    </NuxtLink>
                                </div>
                            </div>
                        </aside>
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

const defaultContent = `
    <p class="lead">Bài viết đang được cập nhật nội dung...</p>
    <h2>Giới thiệu</h2>
    <p>Trong bối cảnh công nghệ phát triển nhanh chóng, việc cập nhật những xu hướng mới nhất là điều cần thiết cho mọi doanh nghiệp.</p>
`

onMounted(async () => {
    await loadPreviews({ limitCount: 50 })
    post.value = previews.value.find(p => p.slug === slug)

    if (post.value) {
        relatedPosts.value = previews.value.filter(p => p.category === post.value.category && p.id !== post.value.id).slice(0, 3)
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
@import "@/styles/post/slug/desktop.css";
@import "@/styles/post/slug/mobile.css";

.is-placeholder {
    opacity: 0.7;
}
</style>
