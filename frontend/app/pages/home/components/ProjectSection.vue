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
                        Hồ sơ năng lực
                    </div>
                    <h2 class="project-main-title">
                        Dự Án <span class="text-primary">Hạ Tầng</span> Đã làm
                    </h2>
                    <p class="project-main-desc">
                        Chúng tôi triển khai các giải pháp an ninh tích hợp, hạ tầng mạng lõi và hệ thống quản lý tòa nhà thông minh cho các doanh nghiệp hàng đầu.
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
                <NuxtLink v-for="(project, index) in projects" :key="index" :to="project.link" :style="{ '--aspect-ratio': aspectRatios[index] || 1.5 }" class="project-card" :class="{ 'project-card-hidden': index >= 3 }" @mouseenter="onMouseEnter(index)" @mouseleave="onMouseLeave">
                    <div class="project-image-wrapper">
                        <img :src="project.image" :alt="project.title" loading="lazy" class="project-image" :class="{ 'project-image-active': hoveredIndex === index }" />
                    </div>

                    <div class="project-overlay">
                        <div class="project-category-wrapper" :class="{ 'project-category-hovered': hoveredIndex === index, 'project-category-other': hoveredIndex !== null && hoveredIndex !== index }">
                            <span class="project-category-badge" :class="project.badgeColor">
                                {{ project.category }}
                            </span>
                        </div>
                        <div class="project-info" :class="{ 'project-info-visible': hoveredIndex === index }">
                            <h3 class="project-title" v-html="project.titleHtml" />
                            <p class="project-desc">
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
const hoveredIndex = ref<number | null>(null)
const aspectRatios = ref<Record<number, number>>({})
const isMobile = ref(false)

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

const projects = [
    {
        title: 'Lorem Ipsum Project',
        titleHtml: 'Lorem Ipsum <br>Dolor Sit Amet',
        category: 'CATEGORY A',
        badgeColor: 'bg-cyan-400',
        location: 'LOCATION',
        year: '2024',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: 'https://placehold.co/800x600/webp?text=800x600',
        link: '/post/lap-dat-mang-lan-enterprise'
    },
    {
        title: 'Consectetur Adipiscing',
        titleHtml: 'Ut Enim Ad <br>Minim Veniam',
        category: 'CATEGORY B',
        badgeColor: 'bg-emerald-400',
        location: 'LOCATION',
        year: '2023',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: 'https://placehold.co/800x600/webp?text=800x600',
        link: '/post/xu-huong-camera-ai-2026'
    },
    {
        title: 'Sed Do Eiusmod',
        titleHtml: 'Duis Aute Irure <br>Dolor In',
        category: 'CATEGORY C',
        badgeColor: 'bg-purple-400',
        location: 'LOCATION',
        year: '2024',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        image: 'https://placehold.co/800x600/webp?text=800x600',
        link: '/post/access-control-hieu-qua'
    },
    {
        title: 'Tempor Incididunt',
        titleHtml: 'Excepteur Sint <br>Occaecat Cupidatat',
        category: 'CATEGORY D',
        badgeColor: 'bg-orange-400',
        location: 'LOCATION',
        year: '2022',
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        image: 'https://placehold.co/800x600/webp?text=800x600',
        link: '/post/giai-phap-wifi-7-doanh-nghiep'
    },
    {
        title: 'Ut Labore Dolore',
        titleHtml: 'Nemo Enim Ipsam <br>Voluptatem Quia',
        category: 'CATEGORY E',
        badgeColor: 'bg-pink-400',
        location: 'LOCATION',
        year: '2023',
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.',
        image: 'https://placehold.co/800x600/webp?text=800x600',
        link: '/post/he-thong-bao-chay-thong-minh'
    }
]

onMounted(() => {
    isMobile.value = window.innerWidth < 1024

    const handleResize = () => {
        isMobile.value = window.innerWidth < 1024
        if (isMobile.value) {
            hoveredIndex.value = null
        }
    }

    window.addEventListener('resize', handleResize)

    projects.forEach((project, index) => {
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
