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
                        Kiến Thức & <span class="text-primary">Giải Pháp</span>
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
                <NuxtLink v-for="post in recentPosts" :key="post.id" :to="`/post/${post.slug}`" class="news-card">
                    <div class="card-image-wrapper">
                        <img :src="post.thumbnail || post.image || 'https://placehold.co/400x300/webp?text=400x300'" :alt="post.title" loading="lazy" class="card-image" />
                        <div class="card-gradient" />
                    </div>
                    <div class="card-overlay">
                        <span class="card-category">{{ post.category }}</span>
                        <div class="card-info">
                            <div class="card-meta">
                                <Icon name="mdi:calendar-blank" class="meta-icon" />
                                <span>{{ post.publishedAt }}</span>
                            </div>
                            <h3 class="card-title">{{ post.title }}</h3>
                            <p class="card-excerpt">{{ post.description || post.excerpt }}</p>
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

<script setup>
import { usePreviewContext } from '@/admin/composables/usePreviewContext'

const { previews, loading, loadPreviews } = usePreviewContext('collections/posts/items')

const placeholderPosts = [
    {
        id: 'placeholder-1',
        slug: '#',
        title: 'Lorem Ipsum Dolor Sit Amet Consectetur',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        thumbnail: 'https://placehold.co/400x300/webp?text=400x300',
        category: 'Lorem',
        publishedAt: '01/01/2024'
    },
    {
        id: 'placeholder-2',
        slug: '#',
        title: 'Ut Enim Ad Minim Veniam Quis Nostrud',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        thumbnail: 'https://placehold.co/400x300/webp?text=400x300',
        category: 'Ipsum',
        publishedAt: '01/01/2024'
    },
    {
        id: 'placeholder-3',
        slug: '#',
        title: 'Duis Aute Irure Dolor In Reprehenderit',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        thumbnail: 'https://placehold.co/400x300/webp?text=400x300',
        category: 'Dolor',
        publishedAt: '01/01/2024'
    }
]

onMounted(() => {
    loadPreviews({ limitCount: 3, orderByField: 'publishedAt', orderDirection: 'desc' })
})

const recentPosts = computed(() => {
    const posts = previews.value.slice(0, 3)
    return posts.length > 0 ? posts : placeholderPosts
})
</script>

<style scoped>
@import "@/styles/home/news-section/desktop.css";
@import "@/styles/home/news-section/mobile.css";
</style>
