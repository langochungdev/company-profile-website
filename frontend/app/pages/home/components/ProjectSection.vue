<!-- Chức năng: Hiển thị danh sách dự án tiêu biểu với hiệu ứng hover mở rộng -->
<template>
    <section class="project-section">
        <div class="project-wrapper">
            <div class="project-intro">
                <div class="intro-content">
                    <div class="project-badge">
                        <span class="badge-pulse">
                            <span class="pulse-ring" />
                            <span class="pulse-dot" />
                        </span>
                        <span data-field="badge">{{ displayData.badge }}</span>
                    </div>
                    <h2 class="project-main-title" data-field="sectionTitle">
                        {{ displayData.sectionTitle }}
                    </h2>
                    <p class="project-main-desc" data-field="description">
                        {{ displayData.description }}
                    </p>
                </div>

                <div class="intro-action">
                    <NuxtLink to="/post" class="view-all-btn">
                        <span class="btn-text">XEM TẤT CẢ DỰ ÁN</span>
                        <Icon name="mdi:arrow-right" class="btn-icon" />
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="project-wrapper">
            <div class="project-container">
                <NuxtLink v-for="(project, index) in displayItems" :key="index" :to="project.link" :style="{ '--aspect-ratio': aspectRatios[index] || 1.5 }" class="project-card" :class="{ 'project-card-hidden': index >= 3 }" @mouseenter="onMouseEnter(index)" @mouseleave="onMouseLeave">
                    <div class="project-image-wrapper">
                        <img :src="project.image" :alt="project.title" loading="lazy" class="project-image" :class="{ 'project-image-active': hoveredIndex === index }" :data-field="`items.${index}.image`" data-field-type="image" />
                    </div>

                    <div class="project-overlay">
                        <div class="project-category-wrapper" :class="{ 'project-category-hovered': hoveredIndex === index, 'project-category-other': hoveredIndex !== null && hoveredIndex !== index }">
                            <span class="project-category-badge" :class="project.badgeColor" :data-field="`items.${index}.category`">
                                {{ project.category }}
                            </span>
                        </div>
                        <div class="project-info" :class="{ 'project-info-visible': hoveredIndex === index }">
                            <h3 class="project-title" :data-field="`items.${index}.title`">{{ project.title }}</h3>
                            <p class="project-desc" :data-field="`items.${index}.description`">
                                {{ project.description }}
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface ProjectItem {
    title: string
    titleHtml?: string
    category: string
    badgeColor: string
    location?: string
    year?: string
    description: string
    image: string
    link: string
}

interface ProjectsData {
    badge?: string
    sectionTitle?: string
    description?: string
    items?: ProjectItem[]
}

const props = defineProps<{
    data?: ProjectsData
}>()

const hoveredIndex = ref<number | null>(null)
const aspectRatios = ref<Record<number, number>>({})
const isMobile = ref(false)

const defaultData: Required<ProjectsData> = {
    badge: 'Hồ sơ năng lực',
    sectionTitle: 'Dự Án Hạ Tầng Đã làm',
    description: 'Chúng tôi triển khai các giải pháp an ninh tích hợp và hạ tầng mạng cho các doanh nghiệp.',
    items: [
        { title: 'Lorem Ipsum Project', titleHtml: 'Lorem Ipsum<br>Dolor Sit', category: 'CATEGORY A', badgeColor: 'bg-cyan-400', description: 'Lorem ipsum dolor sit amet.', image: 'https://placehold.co/800x600/webp?text=800x600', link: '/post' },
        { title: 'Consectetur Adipiscing', titleHtml: 'Ut Enim<br>Ad Minim', category: 'CATEGORY B', badgeColor: 'bg-emerald-400', description: 'Ut enim ad minim veniam.', image: 'https://placehold.co/800x600/webp?text=800x600', link: '/post' },
        { title: 'Sed Do Eiusmod', titleHtml: 'Duis Aute<br>Irure Dolor', category: 'CATEGORY C', badgeColor: 'bg-purple-400', description: 'Duis aute irure dolor.', image: 'https://placehold.co/800x600/webp?text=800x600', link: '/post' },
        { title: 'Tempor Incididunt', titleHtml: 'Excepteur<br>Sint Occaecat', category: 'CATEGORY D', badgeColor: 'bg-orange-400', description: 'Excepteur sint occaecat.', image: 'https://placehold.co/800x600/webp?text=800x600', link: '/post' },
        { title: 'Ut Labore Dolore', titleHtml: 'Nemo Enim<br>Ipsam', category: 'CATEGORY E', badgeColor: 'bg-pink-400', description: 'Nemo enim ipsam voluptatem.', image: 'https://placehold.co/800x600/webp?text=800x600', link: '/post' }
    ]
}

const displayData = computed(() => ({
    badge: props.data?.badge || defaultData.badge,
    sectionTitle: props.data?.sectionTitle || defaultData.sectionTitle,
    description: props.data?.description || defaultData.description
}))

const displayItems = computed(() => props.data?.items || defaultData.items)

const onMouseEnter = (index: number) => {
    if (!isMobile.value) {
        hoveredIndex.value = index
    }
}

const onMouseLeave = () => {
    if (!isMobile.value) {
        hoveredIndex.value = null
    }
}

onMounted(() => {
    isMobile.value = window.innerWidth < 1024

    const handleResize = () => {
        isMobile.value = window.innerWidth < 1024
        if (isMobile.value) {
            hoveredIndex.value = null
        }
    }

    window.addEventListener('resize', handleResize)

    displayItems.value.forEach((project, index) => {
        const img = new Image()
        img.onload = () => {
            aspectRatios.value[index] = img.width / img.height
        }
        img.src = project.image
    })

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
    })
})
</script>

<style scoped>
@import "@/styles/home/project-section/desktop.css";
@import "@/styles/home/project-section/mobile.css";
</style>
