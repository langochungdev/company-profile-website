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
                    <button class="view-all-btn">
                        <span class="btn-text">XEM TẤT CẢ DỰ ÁN</span>
                        <Icon name="mdi:arrow-right" class="btn-icon" />
                    </button>
                </div>
            </div>
        </div>

        <div class="project-wrapper">
            <div class="project-container">
                <div v-for="(project, index) in projects" :key="index" :style="{ '--aspect-ratio': aspectRatios[index] || 1.5 }" class="project-card" :class="{ 'project-card-hidden': index >= 3 }" @mouseenter="onMouseEnter(index)" @mouseleave="onMouseLeave">
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
                </div>
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
        image: '/images/pj.jpg',
        link: '/du-an/data-center-vng',
        stats: [
            { value: '10Gbps', label: 'Băng thông' },
            { value: '99.9%', label: 'Uptime' }
        ]
    },
    {
        title: 'Smart Factory LG',
        titleHtml: 'Giám Sát An Ninh <br>Tích Hợp AI',
        category: 'CCTV & AI',
        badgeColor: 'bg-emerald-400',
        location: 'HẢI PHÒNG',
        year: '2023',
        description: 'Lắp đặt 500+ camera độ phân giải cao tích hợp AI nhận diện khuôn mặt và cảnh báo xâm nhập vành đai cho nhà máy thông minh.',
        image: '/images/pj.jpg',
        link: '/du-an/smart-factory-lg',
        stats: [
            { value: '500+', label: 'Thiết bị' },
            { value: '24/7', label: 'Giám sát' }
        ]
    },
    {
        title: 'Techcombank Tower',
        titleHtml: 'Hệ Thống Điện Nhẹ <br>Tổng Thể',
        category: 'ELV SYSTEM',
        badgeColor: 'bg-purple-400',
        location: 'HÀ NỘI',
        year: '2024',
        description: 'Triển khai hạ tầng Access Control, Video Conference và Âm thanh công cộng (PA) cho tòa nhà văn phòng hạng A.',
        image: '/images/pj.jpg',
        link: '/du-an/techcombank-tower',
        stats: [
            { value: '30', label: 'Tầng' },
            { value: 'IoT', label: 'Kết nối' }
        ]
    },
    {
        title: 'Solar Farm Trung Nam',
        titleHtml: 'Hệ Thống Giám Sát <br>Năng Lượng',
        category: 'SCADA',
        badgeColor: 'bg-orange-400',
        location: 'NINH THUẬN',
        year: '2022',
        description: 'Kết nối đường truyền cáp quang và hệ thống SCADA giám sát hiệu suất cho cánh đồng điện mặt trời quy mô lớn.',
        image: '/images/pj.jpg',
        link: '/du-an/solar-farm-trung-nam',
        stats: [
            { value: '450MW', label: 'Công suất' },
            { value: 'Remote', label: 'Điều khiển' }
        ]
    },
    {
        title: 'Vincom Mega Mall',
        titleHtml: 'Hệ Thống Tòa Nhà <br>Thông Minh BMS',
        category: 'BUILDING MANAGEMENT',
        badgeColor: 'bg-pink-400',
        location: 'HÀ NỘI',
        year: '2023',
        description: 'Triển khai hệ thống quản lý tòa nhà tích hợp điều hòa, chiếu sáng, thang máy và giám sát năng lượng tự động.',
        image: '/images/pj.jpg',
        link: '/du-an/vincom-mega-mall',
        stats: [
            { value: '100K㎡', label: 'Diện tích' },
            { value: 'Smart', label: 'Tự động hóa' }
        ]
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
.project-section {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.5rem 0;
    overflow: hidden;
}

.project-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 10;
}

.project-wrapper:first-child {
    margin-bottom: 2rem;
}

.project-intro {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    border-radius: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
    .project-intro {
        flex-direction: row;
        align-items: flex-end;
    }
}

.intro-content {
    max-width: 48rem;
}

.project-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: rgba(219, 234, 254, 0.5);
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
}

.badge-pulse {
    position: relative;
    display: flex;
    height: 0.5rem;
    width: 0.5rem;
}

.pulse-ring {
    position: absolute;
    display: inline-flex;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    background: #60a5fa;
    opacity: 0.75;
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.pulse-dot {
    position: relative;
    display: inline-flex;
    border-radius: 9999px;
    height: 0.5rem;
    width: 0.5rem;
    background: #3b82f6;
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.project-main-title {
    font-weight: 700;
    color: #0f172a;
    line-height: 1.25;
    margin-bottom: 0.75rem;
    white-space: nowrap;
    font-size: clamp(1.5rem, 5vw, 3rem);
}

.text-primary {
    color: #DC2626;
}

.project-main-desc {
    color: #475569;
    font-size: 0.875rem;
    max-width: 42rem;
}

.intro-action {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
}

@media (min-width: 768px) {
    .intro-action {
        align-items: flex-end;
    }
}

.view-all-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 9999px;
    transition: all 0.3s;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}

.view-all-btn:hover {
    border-color: #DC2626;
    background: #eff6ff;
}

.btn-text {
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #0f172a;
    transition: color 0.3s;
}

.view-all-btn:hover .btn-text {
    color: #DC2626;
}

.btn-icon {
    width: 1rem;
    height: 1rem;
    color: #475569;
    transition: all 0.3s;
}

.view-all-btn:hover .btn-icon {
    color: #DC2626;
    transform: translateX(0.25rem);
}

.project-container {
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100%;
    gap: 0.5rem;
}

@media (min-width: 1024px) {
    .project-container {
        flex-direction: row;
        height: 500px;
        gap: 0.25rem;
    }
}

.project-card {
    position: relative;
    overflow: hidden;
    height: 350px;
    background: #0f172a;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    flex: none;
}

@media (min-width: 1024px) {
    .project-card {
        flex: 1;
        width: auto;
        height: 100%;
        cursor: pointer;
        transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }
}

.project-card-hidden {
    display: none;
}

@media (min-width: 1024px) {
    .project-card-hidden {
        display: block;
    }
}

@media (min-width: 1024px) {
    .project-container:hover .project-card {
        flex: 1;
        opacity: 0.7;
    }

    .project-container .project-card:hover {
        flex: calc(var(--aspect-ratio) * 3);
        opacity: 1 !important;
    }
}

.project-image-wrapper {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.project-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

@media (min-width: 1024px) {
    .project-image {
        transition: all 0.5s;
        filter: grayscale(100%);
    }

    .project-image-active {
        filter: grayscale(0%);
    }
}

.project-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem;
    z-index: 20;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
}

@media (min-width: 1024px) {
    .project-overlay {
        padding: 2rem;
    }
}

.project-category-wrapper {
    position: absolute;
    top: 1rem;
    left: 1rem;
    max-width: calc(100% - 3rem);
}

@media (min-width: 1024px) {
    .project-category-wrapper {
        bottom: 1rem;
        top: auto;
        left: 2rem;
        transition: all 0.5s ease-out;
    }

    .project-category-hovered {
        position: relative;
        bottom: auto;
        left: auto;
        margin-bottom: 0.5rem;
        max-width: 100%;
    }

    .project-category-other {
        transform: scale(0.9);
        opacity: 0.8;
    }
}

.project-category-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #0f172a;
    border-radius: 0.375rem;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.bg-cyan-400 {
    background: #22d3ee;
}

.bg-emerald-400 {
    background: #34d399;
}

.bg-purple-400 {
    background: #c084fc;
}

.bg-orange-400 {
    background: #fb923c;
}

.bg-pink-400 {
    background: #f472b6;
}

.project-info {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    border-radius: 0.75rem;
    padding: 1rem;
    opacity: 1;
    transform: translateY(0);
    transition: none;
    pointer-events: auto;
}

@media (min-width: 1024px) {
    .project-info {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease-out;
        pointer-events: none;
    }

    .project-info-visible {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.4s ease-out 0.2s;
        pointer-events: auto;
    }
}

.project-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.5rem;
    line-height: 1.25;
    filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.4));
}

@media (min-width: 1024px) {
    .project-title {
        font-size: 1.5rem;
    }
}

.project-desc {
    color: #e5e7eb;
    font-size: 0.875rem;
    max-width: 32rem;
    filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.4));
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
