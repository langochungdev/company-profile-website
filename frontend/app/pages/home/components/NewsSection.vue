<template>
    <section class="news-section">
        <div class="news-wrapper">
            <div class="news-intro">
                <div class="intro-content">
                    <div class="news-badge">
                        <span class="badge-pulse">
                            <span class="pulse-ring" />
                            <span class="pulse-dot" />
                        </span>
                        Tin Tức Mới Nhất
                    </div>
                    <h2 class="news-main-title">
                        <span data-field="sectionTitle">{{ displayData.sectionTitle }}</span>
                        <span class="text-primary" data-field="highlightText"> {{ displayData.highlightText }}</span>
                    </h2>
                </div>
                <div class="intro-action">
                    <NuxtLink to="/post" class="view-all-btn">
                        <span class="btn-text">XEM TẤT CẢ BÀI VIẾT</span>
                        <Icon name="mdi:arrow-right" class="btn-icon" />
                    </NuxtLink>
                </div>
            </div>

            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
            </div>

            <div v-else class="news-grid">
                <NuxtLink v-for="(post, index) in displayItems" :key="post.id || index" :to="`/post/${post.slug || post.link}`" class="news-card">
                    <div class="card-image-wrapper">
                        <img :src="post.thumbnail || post.image || 'https://placehold.co/400x300/webp?text=400x300'" :alt="post.title" loading="lazy" class="card-image" :data-field="`items.${index}.thumbnail`" data-field-type="image" />
                        <div class="card-gradient" />
                    </div>
                    <div class="card-overlay">
                        <span class="card-category" :data-field="`items.${index}.category`">{{ post.category }}</span>
                        <div class="card-info">
                            <div class="card-meta">
                                <Icon name="mdi:calendar-blank" class="meta-icon" />
                                <span :data-field="`items.${index}.publishedAt`">{{ post.publishedAt }}</span>
                            </div>
                            <h3 class="card-title" :data-field="`items.${index}.title`">{{ post.title }}</h3>
                            <p class="card-excerpt" :data-field="`items.${index}.description`">{{ post.description || post.excerpt }}</p>
                            <div class="card-action">
                                <span class="read-more">
                                    Đọc tiếp
                                    <Icon name="mdi:arrow-right" class="action-icon" />
                                </span>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'

interface NewsItem {
    id?: string
    slug?: string
    link?: string
    title: string
    description?: string
    excerpt?: string
    thumbnail?: string
    image?: string
    category: string
    publishedAt: string
}

interface NewsData {
    sectionTitle?: string
    highlightText?: string
    items?: NewsItem[]
}

const props = defineProps<{
    data?: NewsData
}>()

const { previews, loading, loadPreviews } = usePreviewContext('collections/posts/items')

const defaultData = {
    sectionTitle: 'Kiến Thức &',
    highlightText: 'Giải Pháp'
}

const placeholderPosts: NewsItem[] = [
    { id: 'p-1', slug: '#', title: 'Lorem Ipsum Dolor Sit Amet', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', thumbnail: 'https://placehold.co/400x300/webp?text=400x300', category: 'Lorem', publishedAt: '01/01/2024' },
    { id: 'p-2', slug: '#', title: 'Ut Enim Ad Minim Veniam', description: 'Ut enim ad minim veniam, quis nostrud exercitation.', thumbnail: 'https://placehold.co/400x300/webp?text=400x300', category: 'Ipsum', publishedAt: '01/01/2024' },
    { id: 'p-3', slug: '#', title: 'Duis Aute Irure Dolor', description: 'Duis aute irure dolor in reprehenderit in voluptate.', thumbnail: 'https://placehold.co/400x300/webp?text=400x300', category: 'Dolor', publishedAt: '01/01/2024' }
]

const displayData = computed(() => ({
    sectionTitle: props.data?.sectionTitle || defaultData.sectionTitle,
    highlightText: props.data?.highlightText || defaultData.highlightText
}))

const displayItems = computed(() => {
    if (props.data?.items && props.data.items.length > 0) {
        return props.data.items.slice(0, 3)
    }
    const posts = previews.value.slice(0, 3)
    return posts.length > 0 ? posts : placeholderPosts
})

onMounted(() => {
    loadPreviews({ limitCount: 3, orderByField: 'publishedAt', orderDirection: 'desc' })
})
</script>

<style scoped>
@import "@/styles/home/news-section/desktop.css";
@import "@/styles/home/news-section/mobile.css";
</style>
