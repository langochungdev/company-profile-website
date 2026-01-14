<template>
    <section class="hero" aria-label="Banner giới thiệu công ty SHT">
        <div class="hero-slides">
            <div v-for="(slide, index) in slides" :key="index" class="hero-slide" :class="{ active: currentSlide === index }">
                <div class="slide-bg" :style="{ backgroundImage: `url(${slide.image})` }">
                    <div class="slide-overlay"></div>
                </div>
                <div class="container slide-content">
                    <div class="content-wrapper">
                        <span class="slide-badge">
                            <span class="badge-dot"></span>
                            {{ slide.badge }}
                        </span>
                        <component :is="index === 0 ? 'h1' : 'h2'" class="slide-title">
                            {{ slide.title }}
                            <span class="title-highlight">{{ slide.highlight }}</span>
                        </component>
                        <p class="slide-desc">{{ slide.description }}</p>
                        <div class="slide-actions">
                            <button class="btn-primary" aria-label="Liên hệ tư vấn">
                                <span>Liên Hệ Ngay</span>
                                <Icon name="mdi:arrow-right" class="btn-icon" />
                            </button>
                            <button class="btn-outline" aria-label="Xem thêm về công ty">
                                <span>Tìm Hiểu Thêm</span>
                            </button>
                        </div>
                    </div>
                    <div class="slide-visual">
                        <img src="/images/cam.webp" alt="Ảnh minh họa" class="visual-img" />
                    </div>
                </div>
            </div>
        </div>

        <div class="hero-nav prev" @click="prevSlide" aria-label="Slide trước">
            <Icon name="mdi:chevron-left" class="nav-icon" />
        </div>
        <div class="hero-nav next" @click="nextSlide" aria-label="Slide tiếp theo">
            <Icon name="mdi:chevron-right" class="nav-icon" />
        </div>

        <div class="hero-dots">
            <button v-for="(_, index) in slides" :key="index" @click="currentSlide = index" class="dot" :class="{ active: currentSlide === index }" :aria-label="`Đi đến slide ${index + 1}`">
                <span class="dot-progress" :class="{ running: currentSlide === index }"></span>
            </button>
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
        image: '/images/banner1.jpg',
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

let autoPlayInterval
onMounted(() => {
    autoPlayInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
    clearInterval(autoPlayInterval)
})
</script>

<style scoped>
@import "../styles/hero-section/desktop.css";
@import "../styles/hero-section/mobile.css";
</style>
