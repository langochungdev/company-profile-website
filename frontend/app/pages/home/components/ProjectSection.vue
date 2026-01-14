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
        title: 'Data Center VNG',
        titleHtml: 'Hệ Thống Mạng Lõi & <br>Lưu Trữ Dữ Liệu',
        category: 'DATA CENTER',
        badgeColor: 'bg-cyan-400',
        location: 'TP.HCM',
        year: '2024',
        description: 'Thiết kế và thi công hệ thống cáp cấu trúc chuẩn Tier III, tích hợp hệ thống làm mát chính xác và giám sát môi trường thời gian thực.',
        image: 'https://placehold.co/800x600/0891b2/ffffff/jpg?text=Data+Center',
        link: '/post/lap-dat-mang-lan-enterprise'
    },
    {
        title: 'Smart Factory LG',
        titleHtml: 'Giám Sát An Ninh <br>Tích Hợp AI',
        category: 'CCTV & AI',
        badgeColor: 'bg-emerald-400',
        location: 'HẢI PHÒNG',
        year: '2023',
        description: 'Lắp đặt 500+ camera độ phân giải cao tích hợp AI nhận diện khuôn mặt và cảnh báo xâm nhập vành đai cho nhà máy thông minh.',
        image: 'https://placehold.co/800x600/059669/ffffff/jpg?text=Smart+Factory',
        link: '/post/xu-huong-camera-ai-2026'
    },
    {
        title: 'Techcombank Tower',
        titleHtml: 'Hệ Thống Điện Nhẹ <br>Tổng Thể',
        category: 'ELV SYSTEM',
        badgeColor: 'bg-purple-400',
        location: 'HÀ NỘI',
        year: '2024',
        description: 'Triển khai hạ tầng Access Control, Video Conference và Âm thanh công cộng (PA) cho tòa nhà văn phòng hạng A.',
        image: 'https://placehold.co/800x600/7c3aed/ffffff/jpg?text=Office+Tower',
        link: '/post/access-control-hieu-qua'
    },
    {
        title: 'Solar Farm Trung Nam',
        titleHtml: 'Hệ Thống Giám Sát <br>Năng Lượng',
        category: 'SCADA',
        badgeColor: 'bg-orange-400',
        location: 'NINH THUẬN',
        year: '2022',
        description: 'Kết nối đường truyền cáp quang và hệ thống SCADA giám sát hiệu suất cho cánh đồng điện mặt trời quy mô lớn.',
        image: 'https://placehold.co/800x600/ea580c/ffffff/jpg?text=Solar+Farm',
        link: '/post/giai-phap-wifi-7-doanh-nghiep'
    },
    {
        title: 'Vincom Mega Mall',
        titleHtml: 'Hệ Thống Tòa Nhà <br>Thông Minh BMS',
        category: 'BUILDING MANAGEMENT',
        badgeColor: 'bg-pink-400',
        location: 'HÀ NỘI',
        year: '2023',
        description: 'Triển khai hệ thống quản lý tòa nhà tích hợp điều hòa, chiếu sáng, thang máy và giám sát năng lượng tự động.',
        image: 'https://placehold.co/800x600/db2777/ffffff/jpg?text=Mega+Mall',
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
@import "../styles/project-section/desktop.css";
@import "../styles/project-section/mobile.css";
</style>
