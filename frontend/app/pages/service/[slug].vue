<template>
    <NuxtLayout name="main">
        <main class="category-projects-wrapper">
            <div class="container">
                <div class="breadcrumb">
                    <NuxtLink to="/service">Dịch vụ</NuxtLink>
                    <Icon name="mdi:chevron-right" />
                    <span>{{ categoryName }}</span>
                </div>

                <div class="category-header">
                    <h1>{{ categoryName }}</h1>
                    <p class="category-subtitle">{{ projects.length }} dự án đã hoàn thành</p>
                </div>

                <div v-if="projects.length === 0" class="empty-state">
                    <Icon name="mdi:folder-open" class="empty-icon" />
                    <h3>Chưa có dự án nào</h3>
                    <p>Hạng mục này chưa có dự án được cập nhật</p>
                </div>

                <div v-else class="projects-grid">
                    <article v-for="project in projects" :key="project.id" class="project-card" @click="openLightbox(project.images, 0)">
                        <div class="card-thumbnail">
                            <div class="thumbnail-grid">
                                <div v-for="(image, idx) in project.images.slice(0, 4)" :key="idx" class="thumbnail-item">
                                    <img :src="image.url" :alt="image.alt || `${project.name} - Hình ${idx + 1}`" loading="lazy" />
                                </div>
                            </div>
                            <div class="thumbnail-overlay">
                                <Icon name="mdi:magnify-plus" class="overlay-icon" />
                                <span class="image-count">{{ project.images.length }} ảnh</span>
                            </div>
                        </div>
                        <div class="card-info">
                            <h2 class="card-title">{{ project.name }}</h2>
                            <p class="card-description">{{ project.description }}</p>
                            <div class="card-meta">
                                <span v-if="project.completedDate" class="meta-item">
                                    <Icon name="mdi:calendar-check" />
                                    {{ formatDate(project.completedDate) }}
                                </span>
                                <span v-if="project.location" class="meta-item">
                                    <Icon name="mdi:map-marker" />
                                    {{ project.location }}
                                </span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </main>

        <Teleport to="body">
            <div v-if="lightbox.show" class="lightbox-overlay" @click.self="closeLightbox">
                <button class="lightbox-close" @click="closeLightbox">
                    <Icon name="mdi:close" />
                </button>
                <button v-if="lightbox.images.length > 1" class="lightbox-nav prev" @click="prevImage">
                    <Icon name="mdi:chevron-left" />
                </button>
                <div class="lightbox-content">
                    <img :src="lightbox.images[lightbox.currentIndex]?.url" :alt="lightbox.images[lightbox.currentIndex]?.alt || 'Hình ảnh'" />
                    <div class="lightbox-counter">{{ lightbox.currentIndex + 1 }} / {{ lightbox.images.length }}</div>
                </div>
                <button v-if="lightbox.images.length > 1" class="lightbox-nav next" @click="nextImage">
                    <Icon name="mdi:chevron-right" />
                </button>
            </div>
        </Teleport>
    </NuxtLayout>
</template>

<script setup>
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { PLACEHOLDER_SERVICE_PROJECTS } from '@/constants/placeholders'

const route = useRoute()
const slug = route.params.slug

const loading = ref(true)
const categoryName = ref('')
const { previews, filterByCategory } = usePreviewContext('collections/services/items')

const projects = computed(() => {
    if (previews.value && previews.value.length > 0) {
        return previews.value
    }
    return PLACEHOLDER_SERVICE_PROJECTS
})

const lightbox = reactive({
    show: false,
    images: [],
    currentIndex: 0,
})

const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
}

const openLightbox = (images, startIndex) => {
    lightbox.images = images
    lightbox.currentIndex = startIndex
    lightbox.show = true
    document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
    lightbox.show = false
    document.body.style.overflow = ''
}

const nextImage = () => {
    lightbox.currentIndex = (lightbox.currentIndex + 1) % lightbox.images.length
}

const prevImage = () => {
    lightbox.currentIndex = (lightbox.currentIndex - 1 + lightbox.images.length) % lightbox.images.length
}

const handleKeydown = (e) => {
    if (!lightbox.show) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
})

    ; (async () => {
        loading.value = true

        categoryName.value = slug.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

        await filterByCategory(categoryName.value)

        loading.value = false
    })()

useSeoMeta({
    title: () => `${categoryName.value} - Dịch Vụ SHT`,
    description: () => `Các dự án ${categoryName.value} đã hoàn thành`,
})
</script>

<style scoped>
@import "./styles/service-slug.css";
</style>
