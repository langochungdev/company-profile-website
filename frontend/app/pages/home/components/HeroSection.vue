<template>
    <section class="relative min-h-screen overflow-hidden" aria-label="Banner giới thiệu công ty SHT">
        <!-- Slides -->
        <div class="relative h-screen">
            <div v-for="(slide, index) in slides" :key="index" class="absolute inset-0 transition-opacity duration-700" :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'">
                <!-- Background Image -->
                <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${slide.image})` }">
                    <div class="absolute inset-0 bg-secondary/70"></div>
                </div>
                <!-- Content -->
                <div class="relative z-10 h-full flex items-center">
                    <div class="container">
                        <div class="max-w-3xl space-y-6">
                            <span class="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                                {{ slide.badge }}
                            </span>
                            <component :is="index === 0 ? 'h1' : 'h2'" class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                {{ slide.title }}
                                <span class="text-primary">{{ slide.highlight }}</span>
                            </component>
                            <p class="text-gray-300 text-lg max-w-xl">{{ slide.description }}</p>
                            <div class="flex flex-wrap gap-4 pt-4">
                                <button class="btn-primary" aria-label="Liên hệ tư vấn">
                                    Liên Hệ Ngay
                                    <Icon name="mdi:arrow-right" class="w-5 h-5" />
                                </button>
                                <button class="btn-outline" aria-label="Xem thêm về công ty">
                                    Tìm Hiểu Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div @click="prevSlide" class="absolute left-0 top-0 w-1/4 h-full z-20 cursor-pointer" aria-label="Slide trước"></div>
        <div @click="nextSlide" class="absolute right-0 top-0 w-1/4 h-full z-20 cursor-pointer" aria-label="Slide tiếp theo"></div>

        <!-- Dots Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            <button v-for="(_, index) in slides" :key="index" @click="currentSlide = index" class="w-3 h-3 rounded-full transition-all" :class="currentSlide === index ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'" :aria-label="`Đi đến slide ${index + 1}`"></button>
        </div>
    </section>
</template>

<script setup>
const currentSlide = ref(0)

const slides = [
    {
        badge: 'Giải Pháp An Ninh Toàn Diện',
        title: 'SHT - Chuyên Gia',
        highlight: 'Camera & Hạ Tầng Mạng',
        description: 'Cung cấp giải pháp an ninh thông minh, hạ tầng mạng chuyên nghiệp cho gia đình và doanh nghiệp. Đồng hành cùng bạn bảo vệ tài sản.',
        image: '/images/banner.jpg',
    },
    {
        badge: '8 Lĩnh Vực Cốt Lõi',
        title: 'Hệ Thống Camera AI',
        highlight: 'Giám Sát Thông Minh',
        description: 'Camera nhận diện khuôn mặt, phát hiện xâm nhập, giám sát từ xa 24/7 qua điện thoại. Công nghệ AI tiên tiến nhất.',
        image: '/images/banner.jpg',
    },
    {
        badge: 'Uy Tín - Chất Lượng',
        title: 'Hạ Tầng Mạng',
        highlight: 'Ổn Định 24/7',
        description: 'Thi công mạng LAN, WiFi doanh nghiệp, Firewall bảo mật, VPN kết nối đa chi nhánh. Đảm bảo vận hành liên tục.',
        image: '/images/banner.jpg',
    }
]

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

// Auto-play
let autoPlayInterval
onMounted(() => {
    autoPlayInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
    clearInterval(autoPlayInterval)
})
</script>
