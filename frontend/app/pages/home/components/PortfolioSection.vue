<template>
    <section class="relative w-full flex flex-col justify-center py-6 overflow-hidden">
        <div class="container relative z-10 mb-8">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-b border-slate-200">
                <div class="max-w-3xl">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                        <span class="relative flex h-2 w-2">
                            <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                        </span>
                        Hồ sơ năng lực
                    </div>
                    <h2 class="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-3">
                        Dự Án <span class="text-primary">Hạ Tầng</span> Công Nghệ
                    </h2>
                    <p class="text-slate-600 text-sm max-w-2xl">
                        Chúng tôi triển khai các giải pháp an ninh tích hợp, hạ tầng mạng lõi và hệ thống quản lý tòa nhà thông minh cho các doanh nghiệp hàng đầu.
                    </p>
                </div>

                <div class="flex flex-col items-start md:items-end gap-4">
                    <button class="group flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-primary rounded-full transition-all bg-white hover:bg-blue-50 shadow-sm cursor-pointer">
                        <span class="text-sm font-semibold tracking-wider text-slate-900 group-hover:text-primary transition-colors">XEM TẤT CẢ DỰ ÁN</span>
                        <Icon name="mdi:arrow-right" class="w-4 h-4 text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>
        </div>

        <div class="container relative z-10">
            <div class="project-container flex flex-col lg:flex-row h-auto lg:h-[500px] w-full gap-2 lg:gap-1">
                <div v-for="(project, index) in projects" :key="index" :style="{ '--aspect-ratio': aspectRatios[index] || 1.5 }" class="project-card group relative h-[350px] lg:h-full bg-slate-900 border border-slate-200 shadow-md cursor-pointer" :class="index >= 3 ? 'hidden lg:block' : ''" @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null">
                    <div class="absolute inset-0 w-full h-full overflow-hidden">
                        <img :src="project.image" :alt="project.title" loading="lazy" class="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500" :class="hoveredIndex === index ? 'grayscale-0' : 'grayscale'" />
                    </div>

                    <div class="absolute bottom-0 left-0 w-full p-6 lg:p-8 z-20 flex flex-col justify-end h-full">
                        <div class="absolute top-4 left-4 lg:bottom-4 lg:top-auto lg:left-8 transition-all duration-500 ease-out max-w-[calc(100%-3rem)]" :class="hoveredIndex === index ? 'lg:relative lg:bottom-auto lg:left-auto mb-2 max-w-full' : hoveredIndex !== null ? 'lg:scale-90 lg:opacity-80' : ''">
                            <span :class="project.badgeColor" class="inline-block px-3 py-1 text-xs font-bold text-slate-900 rounded-md shadow-lg whitespace-nowrap overflow-hidden text-ellipsis">
                                {{ project.category }}
                            </span>
                        </div>
                        <div class="project-info bg-black/30 backdrop-blur-sm rounded-xl p-4 transition-opacity duration-300" :class="hoveredIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'">
                            <h3 class="text-xl lg:text-2xl font-bold text-white mb-2 leading-tight drop-shadow-lg" v-html="project.titleHtml" />
                            <p class="text-gray-200 text-sm max-w-lg line-clamp-2 drop-shadow-md">
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
    projects.forEach((project, index) => {
        const img = new Image()
        img.onload = () => {
            aspectRatios.value[index] = img.width / img.height
        }
        img.src = project.image
    })
})
</script>

<style scoped>
.text-outline-stroke {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
    color: transparent;
}

.project-card {
    flex: 1;
    transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    position: relative;
    overflow: hidden;
}

.project-container:hover .project-card {
    flex: 1;
    opacity: 0.7;
}

.project-container .project-card:hover {
    flex: calc(var(--aspect-ratio) * 3);
    opacity: 1 !important;
}

.project-info {
    opacity: 1;
    transform: translateY(0);
    transition: none;
}

@media (min-width: 1024px) {
    .project-info {
        opacity: 0;
        transform: translateY(20px);
    }

    .project-card:hover .project-info {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.4s ease-out 0.2s;
    }
}

@media (max-width: 1023px) {
    .project-card {
        flex: none;
        width: 100%;
    }

    .project-container:hover .project-card {
        opacity: 1;
        filter: none;
    }

    .project-container {
        flex-direction: column;
    }
}
</style>
