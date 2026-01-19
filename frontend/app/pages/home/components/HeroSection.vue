<template>
    <section class="hero" aria-label="Banner giới thiệu công ty SHT">
        <div class="hero-slides">
            <div v-for="(slide, index) in displaySlides" :key="index" class="hero-slide" :class="{ active: currentSlide === index }">
                <div class="slide-bg" :style="{ backgroundImage: `url(${slide.image})` }">
                    <div class="slide-overlay"></div>
                </div>
                <div class="container slide-content">
                    <div class="content-wrapper">
                        <span class="slide-badge" :data-field="`slides.${index}.badge`">
                            <span class="badge-dot"></span>
                            {{ slide.badge }}
                        </span>
                        <component :is="index === 0 ? 'h1' : 'h2'" class="slide-title">
                            <span :data-field="`slides.${index}.title`">{{ slide.title }}</span>
                            <span class="title-highlight" :data-field="`slides.${index}.highlight`">{{ slide.highlight }}</span>
                        </component>
                        <p class="slide-desc" :data-field="`slides.${index}.description`">
                            {{ slide.description }}
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
                    <div class="slide-visual" :data-field="`slides.${index}.image`" data-field-type="image">
                        <img :src="slide.image || 'https://placehold.co/600x600/webp?text=600x600'" alt="Ảnh minh họa" class="visual-img" />
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
                <span class="dot-progress" :class="{ running: currentSlide === index }"></span>
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

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

const props = defineProps<{
    data?: HeroData
    editMode?: boolean
}>()

const currentSlide = ref(0)

const defaultSlides: SlideData[] = [
    {
        badge: 'Lorem ipsum dolor sit amet',
        title: 'Lorem Ipsum',
        highlight: 'Dolor Sit Amet',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: 'https://placehold.co/1920x1080/webp?text=1920x1080',
    },
    {
        badge: 'Consectetur adipiscing',
        title: 'Sed Do Eiusmod',
        highlight: 'Tempor Incididunt',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: 'https://placehold.co/1920x1080/webp?text=1920x1080',
    },
    {
        badge: 'Ut labore et dolore',
        title: 'Duis Aute Irure',
        highlight: 'Dolor Reprehenderit',
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        image: 'https://placehold.co/1920x1080/webp?text=1920x1080',
    }
]

const displaySlides = computed(() => {
    const baseSlides = defaultSlides
    const editedSlides = props.data?.slides
    if (!editedSlides || editedSlides.length === 0) return baseSlides
    return baseSlides.map((base, index) => ({
        ...base,
        ...(editedSlides[index] || {})
    }))
})

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % displaySlides.value.length
}

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + displaySlides.value.length) % displaySlides.value.length
}

let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const startAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval)
    if (!props.editMode) {
        autoPlayInterval = setInterval(nextSlide, 5000)
    }
}

const stopAutoPlay = () => {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
        autoPlayInterval = null
    }
}

watch(() => props.editMode, (isEdit) => {
    if (import.meta.client) {
        if (isEdit) {
            stopAutoPlay()
        } else {
            startAutoPlay()
        }
    }
})

onMounted(() => {
    if (!props.editMode) {
        startAutoPlay()
    }
})

onUnmounted(() => {
    stopAutoPlay()
})
</script>

<style scoped>
@import "@/styles/home/hero-section/desktop.css";
@import "@/styles/home/hero-section/mobile.css";
</style>
