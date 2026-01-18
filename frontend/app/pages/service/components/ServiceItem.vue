<template>
    <NuxtLink :to="`/service/${service.slug}`" class="service-card group">
        <div class="card-image-wrapper">
            <img :src="service.thumbnail" :alt="service.title" class="card-image" loading="lazy" />
            <div class="card-overlay">
                <span class="read-more">Xem Chi Tiết</span>
            </div>
            <span class="category-badge">{{ service.category }}</span>
        </div>

        <div class="card-content">
            <div class="price-tag">
                <Icon name="mdi:currency-usd" class="price-icon" />
                {{ service.price }}
            </div>

            <h3 class="card-title">{{ service.title }}</h3>
            <p class="card-desc">{{ service.description }}</p>

            <div class="features-list">
                <div v-for="(feature, index) in service.features.slice(0, 3)" :key="index" class="feature-item">
                    <Icon name="mdi:check-circle" class="check-icon" />
                    <span>{{ feature }}</span>
                </div>
            </div>

            <div class="card-footer">
                <span class="link-text">
                    Tìm hiểu thêm
                    <Icon name="mdi:arrow-right" class="arrow-icon" />
                </span>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
defineProps({
    service: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
@import "@/styles/service/service-item/desktop.css";
@import "@/styles/service/service-item/mobile.css";
</style>
