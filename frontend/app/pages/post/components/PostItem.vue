<template>
    <NuxtLink :to="`/post/${post.slug}`" class="post-card group">
        <div class="card-image-wrapper">
            <img :src="post.thumbnail" :alt="post.title" class="card-image" loading="lazy" />
            <div class="card-overlay">
                <span class="read-more">Đọc Tiếp</span>
            </div>
            <span class="category-badge">{{ post.category }}</span>
        </div>

        <div class="card-content">
            <div class="meta-info">
                <span class="date">
                    <Icon name="mdi:calendar-blank" class="meta-icon" />
                    {{ post.publishedAt }}
                </span>
                <span class="author">
                    <Icon name="mdi:account" class="meta-icon" />
                    {{ post.author }}
                </span>
            </div>

            <h3 class="card-title">{{ post.title }}</h3>
            <p class="card-desc">{{ post.description }}</p>

            <div class="card-footer">
                <span class="link-text">
                    Xem chi tiết
                    <Icon name="mdi:arrow-right" class="arrow-icon" />
                </span>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
defineProps({
    post: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
@import "../styles/post-item/desktop.css";
@import "../styles/post-item/mobile.css";
</style>
