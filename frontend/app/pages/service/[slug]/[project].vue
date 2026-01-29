<!-- Chức năng: Page chi tiết dự án service - Load từ slug -->
<template>
    <NuxtLayout name="main">
        <main class="project-detail-wrapper">
            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải...</span>
            </div>

            <template v-else-if="project">
                <div class="container">
                    <nav class="breadcrumb">
                        <NuxtLink to="/">Trang chủ</NuxtLink>
                        <span class="separator">/</span>
                        <NuxtLink :to="`/service/${categorySlug}`">{{ project.categories?.[0] || 'Dịch vụ' }}</NuxtLink>
                        <span class="separator">/</span>
                        <span class="current">{{ project.name }}</span>
                    </nav>

                    <div class="project-header">
                        <h1 class="project-title">{{ project.name }}</h1>
                        <div class="project-meta">
                            <span v-if="project.completedDate" class="meta-item">
                                <Icon name="mdi:calendar-check" />
                                {{ formatDate(project.completedDate) }}
                            </span>
                            <span v-if="project.location" class="meta-item">
                                <Icon name="mdi:map-marker" />
                                {{ project.location }}
                            </span>
                        </div>
                        <div v-if="project.categories?.length" class="project-categories">
                            <span v-for="(cat, idx) in project.categories" :key="idx" class="category-badge">
                                {{ cat }}
                            </span>
                        </div>
                    </div>

                    <div v-if="project.description" class="project-description">
                        <p>{{ project.description }}</p>
                    </div>

                    <div class="project-gallery">
                        <div class="gallery-grid">
                            <div v-for="(image, idx) in project.images" :key="idx" class="gallery-item" :class="{ featured: idx === 0 }" @click="openLightbox(idx)">
                                <img :src="image.url" :alt="image.alt || `${project.name} - Hình ${idx + 1}`" loading="lazy" />
                                <div class="gallery-overlay">
                                    <Icon name="mdi:magnify-plus" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="relatedProjects.length > 0" class="related-projects">
                        <h2 class="related-title">Dự án liên quan</h2>
                        <div class="related-grid">
                            <article v-for="relProject in relatedProjects" :key="relProject.id" class="related-card" @click="navigateToProject(relProject)">
                                <div class="card-thumbnail">
                                    <img :src="relProject.images?.[0]?.url || 'https://placehold.co/400x300/f1f5f9/94a3b8?text=No+Image'" :alt="relProject.images?.[0]?.alt || relProject.name" loading="lazy" />
                                </div>
                                <div class="card-info">
                                    <h3 class="card-title">{{ relProject.name }}</h3>
                                    <p v-if="relProject.location" class="card-location">
                                        <Icon name="mdi:map-marker" />
                                        {{ relProject.location }}
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </template>

            <div v-else class="error-state">
                <Icon name="mdi:alert-circle" class="error-icon" />
                <h2>Không tìm thấy dự án</h2>
                <p>Dự án bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <NuxtLink :to="`/service/${categorySlug}`" class="back-btn">
                    <Icon name="mdi:arrow-left" />
                    Quay lại danh sách
                </NuxtLink>
            </div>

            <Teleport to="body">
                <div v-if="lightbox.show" class="lightbox-overlay" @click.self="closeLightbox">
                    <button class="lightbox-close" @click="closeLightbox">
                        <Icon name="mdi:close" />
                    </button>
                    <button v-if="project.images.length > 1" class="lightbox-nav prev" @click="prevImage">
                        <Icon name="mdi:chevron-left" />
                    </button>
                    <div class="lightbox-content">
                        <img :src="project.images[lightbox.currentIndex]?.url" :alt="project.images[lightbox.currentIndex]?.alt || 'Hình ảnh'" />
                        <div class="lightbox-counter">{{ lightbox.currentIndex + 1 }} / {{ project.images.length }}</div>
                    </div>
                    <button v-if="project.images.length > 1" class="lightbox-nav next" @click="nextImage">
                        <Icon name="mdi:chevron-right" />
                    </button>
                </div>
            </Teleport>
        </main>
    </NuxtLayout>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const categorySlug = computed(() => route.params.slug)
const projectSlug = computed(() => route.params.project)

const { data: fetchedProject } = await useAsyncData(
    `service-project-${projectSlug.value}`,
    async () => {
        try {
            return await $fetch(`/api/seo/service/${projectSlug.value}`)
        } catch (error) {
            if (error?.statusCode === 404) {
                return null
            }
            console.error('[ServiceProject] Failed to fetch:', error)
            return null
        }
    }
)

const project = ref(fetchedProject.value)
const loading = ref(false)
const relatedProjects = ref([])

onMounted(async () => {
    if (!project.value) return

    loading.value = true
    try {
        const { $db } = useNuxtApp()
        const { collection, getDocs, query, where } = await import('firebase/firestore')
        const { getFirestorePath } = await import('@/admin/utils/firestore')

        const path = getFirestorePath('collections/services/items')
        const colRef = collection($db, path)

        if (project.value.categories && project.value.categories.length > 0) {
            const q = query(
                colRef,
                where('categories', 'array-contains-any', project.value.categories.slice(0, 10))
            )
            const snapshot = await getDocs(q)

            const related = []
            snapshot.forEach((doc) => {
                if (doc.id !== project.value.id) {
                    related.push({
                        id: doc.id,
                        ...doc.data(),
                    })
                }
            })

            relatedProjects.value = related.slice(0, 4)
        }
    } catch (error) {
        console.error('[ServiceProject] Load related error:', error)
    } finally {
        loading.value = false
    }
})

const lightbox = reactive({
    show: false,
    currentIndex: 0,
})

const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const openLightbox = (index) => {
    lightbox.currentIndex = index
    lightbox.show = true
    document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
    lightbox.show = false
    document.body.style.overflow = ''
}

const nextImage = () => {
    if (!project.value?.images) return
    lightbox.currentIndex = (lightbox.currentIndex + 1) % project.value.images.length
}

const prevImage = () => {
    if (!project.value?.images) return
    lightbox.currentIndex = (lightbox.currentIndex - 1 + project.value.images.length) % project.value.images.length
}

const navigateToProject = (relProject) => {
    if (!relProject.slug) return
    router.push(`/service/${categorySlug.value}/${relProject.slug}`)
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

const { public: { siteUrl } } = useRuntimeConfig()

useSeoMeta({
    title: () => project.value ? `${project.value.name} - SHT Security` : 'Dự án - SHT Security',
    description: () => project.value?.description || 'Chi tiết dự án',

    ogTitle: () => project.value ? `${project.value.name} - SHT Security` : 'Dự án',
    ogDescription: () => project.value?.description || 'Chi tiết dự án đã triển khai',
    ogImage: () => project.value?.images?.[0]?.url || '',
    ogUrl: () => `${siteUrl}/service/${categorySlug.value}/${projectSlug.value}`,
    ogType: 'article',

    twitterCard: 'summary_large_image',
    twitterTitle: () => project.value ? `${project.value.name} - SHT Security` : 'Dự án',
    twitterDescription: () => project.value?.description || 'Chi tiết dự án đã triển khai',
    twitterImage: () => project.value?.images?.[0]?.url || ''
})
</script>

<style scoped>
.project-detail-wrapper {
    min-height: 80vh;
    padding-top: calc(var(--header-offset, 120px) + 20px);
    padding-bottom: 60px;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 16px;
}

.loading-state .spin {
    font-size: 48px;
    color: #3b82f6;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-icon {
    font-size: 64px;
    color: #ef4444;
}

.error-state h2 {
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.error-state p {
    color: #64748b;
    margin: 8px 0 24px;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #3b82f6;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
}

.back-btn:hover {
    background: #2563eb;
    transform: translateY(-2px);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 32px;
    font-size: 14px;
}

.breadcrumb a {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s;
}

.breadcrumb a:hover {
    color: #2563eb;
}

.separator {
    color: #cbd5e1;
}

.current {
    color: #64748b;
}

.project-header {
    margin-bottom: 32px;
}

.project-title {
    font-size: 36px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 16px;
    line-height: 1.2;
}

.project-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 16px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    color: #64748b;
}

.meta-item .iconify {
    font-size: 18px;
}

.project-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.category-badge {
    padding: 6px 14px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
}

.project-description {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 40px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.project-description p {
    font-size: 16px;
    line-height: 1.8;
    color: #475569;
    margin: 0;
}

.project-gallery {
    margin-bottom: 60px;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
}

.gallery-item {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
}

.gallery-item.featured {
    grid-column: span 2;
    grid-row: span 2;
}

.gallery-item:hover {
    transform: scale(1.02);
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gallery-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.gallery-item:hover .gallery-overlay {
    opacity: 1;
}

.gallery-overlay .iconify {
    font-size: 48px;
    color: white;
}

.related-projects {
    margin-top: 60px;
}

.related-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 24px;
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.related-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.related-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.related-card .card-thumbnail {
    aspect-ratio: 16 / 10;
    overflow: hidden;
}

.related-card .card-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.related-card:hover .card-thumbnail img {
    transform: scale(1.1);
}

.related-card .card-info {
    padding: 16px;
}

.related-card .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.related-card .card-location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #64748b;
    margin: 0;
}

.lightbox-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    cursor: pointer;
    transition: background 0.3s;
    z-index: 10001;
}

.lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 28px;
    cursor: pointer;
    transition: background 0.3s;
    z-index: 10001;
}

.lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav.prev {
    left: 20px;
}

.lightbox-nav.next {
    right: 20px;
}

.lightbox-content {
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
}

.lightbox-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
}

.lightbox-counter {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 14px;
    font-weight: 500;
}

@media (max-width: 768px) {
    .project-title {
        font-size: 28px;
    }

    .gallery-item.featured {
        grid-column: span 1;
        grid-row: span 1;
    }

    .related-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
}
</style>
