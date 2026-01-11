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
.hero {
    position: relative;
    height: 100svh;
    min-height: 500px;
    overflow: hidden;
    background: rgb(15, 23, 42);
}

.hero-slides {
    position: relative;
    height: 100%;
}

.hero-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.8s ease, visibility 0.8s ease;
}

.hero-slide.active {
    opacity: 1;
    visibility: visible;
    z-index: 10;
}

.slide-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transform: scale(1.1);
    transition: transform 8s ease;
}

.hero-slide.active .slide-bg {
    transform: scale(1);
}

.slide-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.3) 50%, rgba(15, 23, 42, 0.5) 100%);
}

.slide-content {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 1rem 0;
}

.content-wrapper {
    margin: 0 18px;
    width: 100%;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
}

.hero-slide.active .content-wrapper {
    opacity: 1;
    transform: translateY(0);
}

.slide-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 9999px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    backdrop-filter: blur(8px);
}

.badge-dot {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    animation: pulse-dot 2s ease infinite;
}

.slide-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    line-height: 1.2;
    margin-bottom: 1.5rem;
}

.title-highlight {
    display: block;
    background: linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(180, 180, 180) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.slide-desc {
    font-size: 1.125rem;
    color: rgb(148, 163, 184);
    line-height: 1.7;
    margin-bottom: 2rem;
}

.slide-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: white;
    color: rgb(15, 23, 42);
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.btn-primary .btn-icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.3s ease;
}

.btn-primary:hover .btn-icon {
    transform: translateX(4px);
}

.btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: transparent;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-outline:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
}

.slide-visual {
    display: none;
    position: relative;
    width: 400px;
    height: 400px;
    flex-shrink: 0;
}

.visual-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.hero-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    width: 50px;
    height: 50px;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
}

.hero-nav:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
}

.hero-nav.prev {
    left: 2rem;
}

.hero-nav.next {
    right: 2rem;
}

.nav-icon {
    width: 24px;
    height: 24px;
    color: white;
}

.hero-dots {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    gap: 0.75rem;
}

.dot {
    position: relative;
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
}

.dot:hover {
    background: rgba(255, 255, 255, 0.5);
}

.dot.active {
    background: rgba(255, 255, 255, 0.3);
}

.dot-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background: white;
    border-radius: 2px;
}

.dot-progress.running {
    animation: progress-bar 5s linear forwards;
}

@keyframes pulse-dot {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }
}

@keyframes progress-bar {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

@media (max-width: 767px) {
    .hero {
        height: calc(100svh - 60px);
        min-height: 450px;
    }

    .slide-content {
        padding: 0.5rem 0;
    }

    .content-wrapper {
        max-width: 100%;
    }

    .slide-badge {
        font-size: 0.75rem;
        padding: 0.375rem 0.75rem;
        margin-bottom: 1rem;
    }

    .slide-title {
        font-size: 1.75rem;
        margin-bottom: 1rem;
        line-height: 1.3;
    }

    .slide-desc {
        font-size: 0.875rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .slide-actions {
        gap: 0.75rem;
        flex-direction: column;
        width: 100%;
    }

    .btn-primary,
    .btn-outline {
        width: 100%;
        padding: 0.875rem 1.5rem;
        font-size: 0.9375rem;
    }

    .hero-dots {
        bottom: 1.25rem;
        gap: 0.5rem;
    }

    .dot {
        width: 28px;
        height: 3px;
    }
}

@media (min-width: 768px) {
    .slide-title {
        font-size: 3.5rem;
    }

    .slide-visual {
        display: block;
    }

    .hero-nav {
        display: flex;
    }
}

@media (min-width: 1024px) {
    .slide-title {
        font-size: 4rem;
    }

    .slide-visual {
        width: 450px;
        height: 450px;
    }
}
</style>
