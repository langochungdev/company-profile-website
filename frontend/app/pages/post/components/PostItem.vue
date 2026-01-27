<template>
    <NuxtLink :to="`/post/${post.slug}`" class="post-card group">
        <div class="card-image-wrapper">
            <img :src="thumbnailUrl" :alt="thumbnailAlt" class="card-image" loading="lazy" />
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
            <p class="card-desc">{{ post.excerpt || post.description }}</p>

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
const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

const thumbnailUrl = computed(() => {
    if (!props.post.thumbnail) return '/images/placeholder.jpg'

    if (typeof props.post.thumbnail === 'object' && props.post.thumbnail.url) {
        return props.post.thumbnail.url
    }

    if (typeof props.post.thumbnail === 'string') {
        return props.post.thumbnail
    }

    return '/images/placeholder.jpg'
})

const thumbnailAlt = computed(() => {
    if (typeof props.post.thumbnail === 'object' && props.post.thumbnail.alt) {
        return props.post.thumbnail.alt
    }

    return props.post.title
})
</script>

<style scoped>
@import "../styles/post-item.css";
</style>
