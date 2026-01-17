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

            <div class="news-grid">
                <NuxtLink v-for="post in recentPosts" :key="post.id" :to="`/post/${post.slug}`" class="news-card">
                    <div class="card-image">
                        <img :src="post.thumbnail" :alt="post.title" loading="lazy" />
                        <span class="card-category">{{ post.category }}</span>
                    </div>
                    <div class="card-body">
                        <div class="card-meta">
                            <span>
                                <Icon name="mdi:calendar-blank" /> {{ post.publishedAt }}
                            </span>
                        </div>
                        <h3 class="card-title">{{ post.title }}</h3>
                        <p class="card-excerpt">{{ post.description }}</p>
                        <div class="card-footer">
                            <span class="read-more">Đọc tiếp
                                <Icon name="mdi:arrow-right" />
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { POSTS } from '../../post/postListing.cms'

const recentPosts = computed(() => POSTS.slice(0, 3))
</script>

<style scoped>
@import "../styles/news-section/desktop.css";
@import "../styles/news-section/mobile.css";
</style>
