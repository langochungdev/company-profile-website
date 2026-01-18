<template>
    <section class="hero" :class="{ 'is-editable': editable }" aria-label="Banner giới thiệu công ty SHT">
        <div class="hero-slides">
            <div v-for="(slide, index) in displaySlides" :key="index" class="hero-slide" :class="{ active: currentSlide === index }">
                <div class="slide-bg" :style="{ backgroundImage: `url(${slide.image})` }">
                    <div class="slide-overlay"></div>
                </div>
                <div class="container slide-content">
                    <div class="content-wrapper">
                        <span class="slide-badge" :class="{ 'editable-field': editable }" @click="handleEdit(`slides.${index}.badge`)">
                            <span class="badge-dot"></span>
                            {{ slide.badge }}
                            <Icon v-if="editable" name="mdi:pencil" class="edit-icon" />
                        </span>
                        <component :is="index === 0 ? 'h1' : 'h2'" class="slide-title" :class="{ 'editable-field': editable }" @click="handleEdit(`slides.${index}.title`)">
                            {{ slide.title }}
                            <span class="title-highlight">{{ slide.highlight }}</span>
                            <Icon v-if="editable" name="mdi:pencil" class="edit-icon" />
                        </component>
                        <p class="slide-desc" :class="{ 'editable-field': editable }" @click="handleEdit(`slides.${index}.description`)">
                            {{ slide.description }}
                            <Icon v-if="editable" name="mdi:pencil" class="edit-icon" />
                        </p>
                        <div class="slide-actions">
                            <NuxtLink to="/contact" class="btn-primary" aria-label="Liên hệ tư vấn">
                                <span>Liên Hệ Ngay</span>
                                <Icon name="mdi:arrow-right" class="btn-icon" />
                            </NuxtLink>
                            <NuxtLink to="/product" class="btn-outline" aria-label="Xem thêm sản phẩm">
                                <span>Xem Sản Phẩm</span>
                            </NuxtLink>
                        </div>
                    </div>
                    <div class="slide-visual" :class="{ 'editable-field': editable }" @click="handleEdit(`slides.${index}.image`)">
                        <img :src="slide.image || 'https://placehold.co/600x600/png?text=600x600'" alt="Ảnh minh họa" class="visual-img" />
                        <div v-if="editable" class="image-edit-overlay">
                            <Icon name="mdi:image-edit" />
                            <span>Thay đổi ảnh</span>
                        </div>
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
            <button v-for="(_, index) in displaySlides" :key="index" @click="currentSlide = index" class="dot" :class="{ active: currentSlide === index }" :aria-label="`Đi đến slide ${index + 1}`">
                <span class="dot-progress" :class="{ running: currentSlide === index && !editable }"></span>
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface SlideData {
    badge: string
    title: string
    highlight: string
    description: string
    image: string
}

interface HeroData {
    slides: SlideData[]
}

interface Props {
    data?: HeroData
    editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    editable: false
})

const emit = defineEmits<{
    edit: [fieldPath: string]
}>()

const currentSlide = ref(0)

const defaultSlides: SlideData[] = [
    {
        badge: 'Giải Pháp An Ninh Toàn Diện',
        title: 'SHT - Chuyên Gia',
        highlight: 'Camera & Hạ Tầng Mạng',
        description: 'Cung cấp giải pháp an ninh thông minh, hạ tầng mạng chuyên nghiệp cho gia đình và doanh nghiệp. Đồng hành cùng bạn bảo vệ tài sản.',
        image: 'https://placehold.co/1920x1080/jpg?text=1920x1080',
    },
    {
        badge: '8 Lĩnh Vực Cốt Lõi',
        title: 'Hệ Thống Camera AI',
        highlight: 'Giám Sát Thông Minh',
        description: 'Camera nhận diện khuôn mặt, phát hiện xâm nhập, giám sát từ xa 24/7 qua điện thoại. Công nghệ AI tiên tiến nhất.',
        image: 'https://placehold.co/1920x1080/jpg?text=1920x1080',
    },
    {
        badge: 'Uy Tín - Chất Lượng',
        title: 'Hạ Tầng Mạng',
        highlight: 'Ổn Định 24/7',
        description: 'Thi công mạng LAN, WiFi doanh nghiệp, Firewall bảo mật, VPN kết nối đa chi nhánh. Đảm bảo vận hành liên tục.',
        image: 'https://placehold.co/1920x1080/jpg?text=1920x1080',
    }
]

const displaySlides = computed(() => {
    const slides = props.data?.slides
    if (slides && Array.isArray(slides) && slides.length > 0) {
        return slides
    }
    return defaultSlides
})

const handleEdit = (fieldPath: string) => {
    if (props.editable) {
        emit('edit', fieldPath)
    }
}

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % displaySlides.value.length
}

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + displaySlides.value.length) % displaySlides.value.length
}

let autoPlayInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    if (!props.editable) {
        autoPlayInterval = setInterval(nextSlide, 5000)
    }
})

onUnmounted(() => {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
    }
})
</script>

<style scoped>
@import "@/styles/home/hero-section/desktop.css";
@import "@/styles/home/hero-section/mobile.css";

.is-editable .editable-field {
    position: relative;
    cursor: pointer;
    transition: outline 0.2s, background 0.2s;
}

.is-editable .editable-field:hover {
    outline: 2px dashed rgba(59, 130, 246, 0.8);
    outline-offset: 4px;
}

.is-editable .editable-field .edit-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    padding: 4px;
    background: #3b82f6;
    border-radius: 50%;
    color: #ffffff;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.2s;
}

.is-editable .editable-field:hover .edit-icon {
    opacity: 1;
    transform: scale(1);
}

.is-editable .slide-visual {
    position: relative;
    cursor: pointer;
}

.image-edit-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 16px;
    color: #ffffff;
    opacity: 0;
    transition: opacity 0.2s;
}

.is-editable .slide-visual:hover .image-edit-overlay {
    opacity: 1;
}

.image-edit-overlay svg {
    width: 32px;
    height: 32px;
}

.image-edit-overlay span {
    font-size: 14px;
    font-weight: 500;
}
</style>
