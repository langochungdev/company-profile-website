<template>
    <section class="service-gallery-wrapper">
        <div class="container">
            <div class="section-header">
                <h1 class="main-title">Lĩnh Vực Hoạt Động</h1>
                <p class="main-subtitle">Các dự án đã hoàn thành</p>
            </div>

            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải...</span>
            </div>

            <template v-else>
                <div class="category-filters">
                    <button v-for="category in categories" :key="category.id" :class="['filter-btn', { active: activeCategory === category.id }]" @click="selectCategory(category.id)">
                        {{ category.name }}
                        <span class="count">({{ category.projectCount || 0 }})</span>
                    </button>
                </div>

                <div v-if="filteredProjects.length === 0" class="empty-state">
                    <Icon name="mdi:folder-open" class="empty-icon" />
                    <h3>Chưa có dự án nào</h3>
                    <p>Hạng mục này chưa có dự án được cập nhật</p>
                </div>

                <div v-else class="projects-grid">
                    <article v-for="project in paginatedProjects" :key="project.id" class="project-card" @click="openLightbox(project.images, 0)">
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

                <div v-if="totalPages > 1" class="pagination">
                    <button :disabled="currentPage === 1" class="pagination-btn" @click="goToPage(currentPage - 1)">
                        <Icon name="mdi:chevron-left" />
                    </button>
                    <button v-for="page in displayedPages" :key="page" :class="['page-btn', { active: currentPage === page }]" @click="goToPage(page)">
                        {{ page }}
                    </button>
                    <button :disabled="currentPage === totalPages" class="pagination-btn" @click="goToPage(currentPage + 1)">
                        <Icon name="mdi:chevron-right" />
                    </button>
                </div>
            </template>
        </div>

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
    </section>
</template>

<script setup>
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { PLACEHOLDER_SERVICE_PROJECTS } from '@/constants/placeholders'

const loading = ref(false)
const activeCategory = ref(null)
const currentPage = ref(1)
const itemsPerPage = 8

const { config, loadConfig } = useCollectionConfig('collections/services/items')
const { allPreviews, loadAll } = usePreviewContext('collections/services/items')

const categories = computed(() => {
    if (!config.value?.categories?.length) {
        return [
            { id: '1', name: 'Camera AI', projectCount: allProjects.value.filter(p => p.category === 'Camera AI').length },
            { id: '2', name: 'Mạng WiFi', projectCount: allProjects.value.filter(p => p.category === 'Mạng WiFi').length },
            { id: '3', name: 'Hạ tầng mạng', projectCount: allProjects.value.filter(p => p.category === 'Hạ tầng mạng').length },
            { id: '4', name: 'Báo cháy', projectCount: allProjects.value.filter(p => p.category === 'Báo cháy').length },
            { id: '5', name: 'Kiểm soát ra vào', projectCount: allProjects.value.filter(p => p.category === 'Kiểm soát ra vào').length },
            { id: '6', name: 'Tổng đài IP', projectCount: allProjects.value.filter(p => p.category === 'Tổng đài IP').length },
            { id: '7', name: 'Rào chắn', projectCount: allProjects.value.filter(p => p.category === 'Rào chắn').length },
            { id: '8', name: 'Âm thanh', projectCount: allProjects.value.filter(p => p.category === 'Âm thanh').length }
        ]
    }

    return config.value.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        projectCount: allProjects.value.filter(p => p.category === cat.name).length
    }))
})

const allProjects = computed(() => {
    if (!allPreviews.value || allPreviews.value.length === 0) {
        return PLACEHOLDER_SERVICE_PROJECTS
    }
    return allPreviews.value
})

const filteredProjects = computed(() => {
    if (!activeCategory.value) return []
    const category = categories.value.find(c => c.id === activeCategory.value)
    if (!category) return []
    return allProjects.value.filter(p => p.category === category.name)
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / itemsPerPage))

const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredProjects.value.slice(start, end)
})

const displayedPages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

const lightbox = reactive({
    show: false,
    images: [],
    currentIndex: 0,
})

const selectCategory = (categoryId) => {
    activeCategory.value = categoryId
    currentPage.value = 1
}

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

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

onMounted(async () => {
    loading.value = true
    await Promise.all([loadConfig(), loadAll()])
    if (categories.value.length > 0) {
        activeCategory.value = categories.value[0].id
    }
    loading.value = false
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
@import "../styles/service-list.css";
</style>
