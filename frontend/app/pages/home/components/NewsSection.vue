<template>
    <section class="news-section">
        <div class="container">
            <div class="section-header">
                <div class="header-left">
                    <span class="badge">Tin Tức Mới Nhất</span>
                    <h2 class="title">Kiến Thức & <span class="highlight">Giải Pháp</span></h2>
                </div>
                <NuxtLink to="/post" class="view-all">
                    Xem Tất Cả Bài Viết
                    <Icon name="mdi:arrow-right" />
                </NuxtLink>
            </div>

            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
            </div>

            <div v-else class="news-grid">
                <NuxtLink v-for="post in recentPosts" :key="post.id" :to="`/post/${post.slug}`" class="news-card">
                    <div class="card-image">
                        <img :src="post.thumbnail || post.image" :alt="post.title" loading="lazy" />
                        <span class="card-category">{{ post.category }}</span>
                    </div>
                    <div class="card-body">
                        <div class="card-meta">
                            <span>
                                <Icon name="mdi:calendar-blank" /> {{ post.publishedAt }}
                            </span>
                        </div>
                        <h3 class="card-title">{{ post.title }}</h3>
                        <p class="card-excerpt">{{ post.description || post.excerpt }}</p>
                        <div class="card-footer">
                            <span class="read-more">Đọc tiếp
                                <Icon name="mdi:arrow-right" />
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div v-if="!loading && recentPosts.length === 0" class="empty-state">
                <p>Chưa có bài viết nào.</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { usePreviewContext } from '@/admin/composables/usePreviewContext'

const { previews, loading, loadPreviews } = usePreviewContext('collections/posts/items')

onMounted(() => {
    loadPreviews({ limitCount: 3, orderByField: 'publishedAt', orderDirection: 'desc' })
})

const recentPosts = computed(() => previews.value.slice(0, 3))
</script>

<style scoped>
@import "@/styles/home/news-section/desktop.css";
@import "@/styles/home/news-section/mobile.css";
</style>
