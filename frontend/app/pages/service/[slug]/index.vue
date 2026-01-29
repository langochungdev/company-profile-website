<template>
    <NuxtLayout name="main">
        <main class="service-gallery-wrapper">
            <div class="container">
                <div class="section-header">
                    <h1 class="main-title">Lĩnh Vực Hoạt Động</h1>
                    <p class="main-subtitle">Các dự án đã hoàn thành</p>
                </div>

                <div v-if="previewLoading" class="loading-state">
                    <Icon name="mdi:loading" class="spin" />
                    <span>Đang tải...</span>
                </div>

                <template v-else>
                    <div class="category-filters">
                        <NuxtLink v-for="category in categories" :key="category.id" :to="`/service/${category.slug}`" :class="['filter-btn', { active: currentSlug === category.slug }]">
                            {{ category.name }}
                            <span class="count">({{ category.projectCount || 0 }})</span>
                        </NuxtLink>
                    </div>

                    <div class="projects-grid">
                        <article v-for="project in paginatedProjects" :key="project.id" class="project-card">
                            <div class="card-thumbnail" @click.stop="openLightbox(project.images, 0)">
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
                            <div class="card-info" @click="navigateToProject(project)">
                                <h2 class="card-title">{{ project.name }}</h2>
                                <div v-if="project.tags && project.tags.length > 0" class="card-tags">
                                    <span v-for="(tag, idx) in project.tags.slice(0, 3)" :key="idx" class="tag-badge">{{ tag }}</span>
                                    <span v-if="project.tags.length > 3" class="more-badge">+{{ project.tags.length - 3 }}</span>
                                </div>
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
        </main>
    </NuxtLayout>
</template>

<script setup>
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'
import { PLACEHOLDER_SERVICE_PROJECTS } from '@/constants/placeholders'

const route = useRoute()
const router = useRouter()
const currentSlug = computed(() => route.params.slug)

const currentPage = ref(1)
const itemsPerPage = 8

const { config, loadConfig } = useCollectionConfig('collections/services/items')

const allProjects = ref([])
const loading = ref(false)

const loadProjects = async () => {
    loading.value = true
    try {
        const { $db } = useNuxtApp()
        const { collection, getDocs } = await import('firebase/firestore')
        const { getFirestorePath } = await import('@/admin/utils/firestore')

        const path = getFirestorePath('collections/services/items')
        const colRef = collection($db, path)
        const snapshot = await getDocs(colRef)

        const items = []
        snapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data(),
            })
        })

        allProjects.value = items.length > 0 ? items : PLACEHOLDER_SERVICE_PROJECTS
    } catch (error) {

        allProjects.value = PLACEHOLDER_SERVICE_PROJECTS
    } finally {
        loading.value = false
    }
}

const previewLoading = computed(() => loading.value)

const categories = computed(() => {
    if (!config.value?.categories?.length) {
        return [
            { id: '1', name: 'Camera AI', slug: 'camera-ai', projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes('Camera AI') : p.category === 'Camera AI').length },
            { id: '2', name: 'Mạng WiFi', slug: 'mang-wifi', projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes('Mạng WiFi') : p.category === 'Mạng WiFi').length },
            { id: '3', name: 'Hạ tầng mạng', slug: 'ha-tang-mang', projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes('Hạ tầng mạng') : p.category === 'Hạ tầng mạng').length },
            { id: '4', name: 'Báo cháy', slug: 'bao-chay', projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes('Báo cháy') : p.category === 'Báo cháy').length },
            { id: '5', name: 'Kiểm soát ra vào', slug: 'kiem-soat-ra-vao', projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes('Kiểm soát ra vào') : p.category === 'Kiểm soát ra vào').length },
            { id: '6', name: 'Tổng đài IP', slug: 'tong-dai-ip', projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes('Tổng đài IP') : p.category === 'Tổng đài IP').length },
            { id: '7', name: 'Rào chắn', slug: 'rao-chan', projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes('Rào chắn') : p.category === 'Rào chắn').length },
            { id: '8', name: 'Âm thanh', slug: 'am-thanh', projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes('Âm thanh') : p.category === 'Âm thanh').length }
        ]
    }

    return config.value.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        projectCount: allProjects.value.filter(p => Array.isArray(p.categories) ? p.categories.includes(cat.name) : p.category === cat.name).length
    }))
})

const currentCategory = computed(() => {
    return categories.value.find(c => c.slug === currentSlug.value)
})

const filteredProjects = computed(() => {
    if (!currentCategory.value) return PLACEHOLDER_SERVICE_PROJECTS
    const filtered = allProjects.value.filter(p => {
        if (Array.isArray(p.categories)) {
            return p.categories.includes(currentCategory.value.name)
        }
        return p.category === currentCategory.value.name
    })
    return filtered.length > 0 ? filtered : PLACEHOLDER_SERVICE_PROJECTS
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

const lightbox = reactive({
    show: false,
    images: [],
    currentIndex: 0,
})

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

const navigateToProject = (project) => {
    if (!project.slug) return
    router.push(`/service/${currentSlug.value}/${project.slug}`)
}

watch(() => route.params.slug, () => {
    currentPage.value = 1
})

onMounted(async () => {
    await Promise.all([loadConfig(), loadProjects()])
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
})


const { public: { siteUrl } } = useRuntimeConfig()

useSeoMeta({
    title: () => `${currentCategory.value?.name || 'Dịch vụ'} - Dự án đã hoàn thành`,
    description: () => `Các dự án ${currentCategory.value?.name || 'dịch vụ'} đã hoàn thành bởi SHT Security`,

    ogTitle: () => `${currentCategory.value?.name || 'Dịch vụ'} - SHT Security`,
    ogDescription: () => `Xem gallery dự án ${currentCategory.value?.name || 'dịch vụ'} đã triển khai`,
    ogImage: () => filteredProjects.value[0]?.images[0]?.url || '',
    ogUrl: () => `${siteUrl}/service/${currentSlug.value}`,
    ogType: 'website',

    twitterCard: 'summary_large_image',
    twitterTitle: () => `${currentCategory.value?.name || 'Dịch vụ'} - SHT Security`,
    twitterDescription: () => `Xem gallery dự án ${currentCategory.value?.name || 'dịch vụ'} đã triển khai`,
    twitterImage: () => filteredProjects.value[0]?.images[0]?.url || ''
})
</script>

<style scoped>
@import "../styles/service-slug.css";
</style>
