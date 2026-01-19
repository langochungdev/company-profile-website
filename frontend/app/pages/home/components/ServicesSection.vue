<template>
    <section class="services-section">
        <div class="container services-container">
            <div class="services-header">
                <div>
                    <div class="services-badge">
                        <span class="badge-dot">
                            <span class="dot-ping" />
                            <span class="dot-core" />
                        </span>
                        Lĩnh Vực Hoạt Động
                    </div>
                    <h2 class="services-title whitespace-nowrap">
                        <span data-field="sectionTitle">{{ displayData.sectionTitle }}</span>
                        <span class="text-primary" data-field="highlightText"> {{ displayData.highlightText }}</span>
                    </h2>
                </div>
                <div class="services-cta">
                    <NuxtLink to="/product" class="cta-button">
                        <span class="cta-text">XEM TẤT CẢ GIẢI PHÁP</span>
                        <Icon name="mdi:arrow-right" class="cta-icon" />
                    </NuxtLink>
                </div>
            </div>

            <div class="mobile-scroll">
                <NuxtLink v-for="(service, index) in displayItems" :key="'m-' + index" :to="service.link" class="mobile-card" :class="{ 'active': activeIndex === index }" @click="activeIndex = index">
                    <img :src="service.image" :alt="service.title" class="mobile-card-bg" />
                    <div class="mobile-card-overlay"></div>
                    <div class="mobile-card-content">
                        <Icon :name="service.icon" class="mobile-card-icon" />
                        <span class="mobile-card-title" :data-field="`items.${index}.title`">{{ service.title }}</span>
                    </div>
                    <div class="mobile-card-expanded">
                        <p class="mobile-card-desc" :data-field="`items.${index}.description`">{{ service.description }}</p>
                        <div class="mobile-card-btn">
                            <span>Xem chi tiết</span>
                            <Icon name="mdi:arrow-right" class="mobile-btn-icon" />
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div class="services-grid">
                <NuxtLink v-for="(service, index) in displayItems" :key="index" :to="service.link" :class="['service-card', getGridClass(index)]">
                    <img :src="service.image" :alt="service.title" loading="lazy" class="service-image" :data-field="`items.${index}.image`" data-field-type="image" />
                    <div class="service-gradient"></div>
                    <div class="service-content">
                        <div class="service-info">
                            <h3 class="service-name" :class="{ 'name-large': index === 0 }" :data-field="`items.${index}.title`">
                                {{ service.title }}
                            </h3>
                            <p class="service-desc" :data-field="`items.${index}.description`">
                                {{ service.description }}
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ServiceItem {
    title: string
    description: string
    icon: string
    image: string
    link: string
}

interface ServicesData {
    sectionTitle?: string
    highlightText?: string
    items?: ServiceItem[]
}

const props = defineProps<{
    data?: ServicesData
}>()

const activeIndex = ref(0)

const defaultData: Required<ServicesData> = {
    sectionTitle: 'Các Hạng Mục',
    highlightText: 'Thi Công',
    items: [
        { title: 'Lorem Ipsum Dolor', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', icon: 'mdi:face-recognition', image: 'https://placehold.co/600x400/webp?text=600x400', link: '/product' },
        { title: 'Consectetur Adipiscing', description: 'Ut enim ad minim veniam, quis nostrud exercitation.', icon: 'mdi:lan', image: 'https://placehold.co/600x400/webp?text=600x400', link: '/product' },
        { title: 'Sed Eiusmod Tempor', description: 'Duis aute irure dolor in reprehenderit in voluptate.', icon: 'mdi:wifi', image: 'https://placehold.co/600x400/webp?text=600x400', link: '/product' },
        { title: 'Ut Labore Dolore', description: 'Excepteur sint occaecat cupidatat non proident.', icon: 'mdi:server', image: 'https://placehold.co/600x400/webp?text=600x400', link: '/product' },
        { title: 'Magna Aliqua Enim', description: 'Nemo enim ipsam voluptatem quia voluptas sit.', icon: 'mdi:fingerprint', image: 'https://placehold.co/600x400/webp?text=600x400', link: '/product' },
        { title: 'Quis Autem Vel', description: 'Neque porro quisquam est, qui dolorem ipsum.', icon: 'mdi:alarm-light', image: 'https://placehold.co/600x400/webp?text=600x400', link: '/product' },
        { title: 'Eius Modi Tempora', description: 'Ut enim ad minima veniam, quis nostrum.', icon: 'mdi:phone-voip', image: 'https://placehold.co/600x400/webp?text=600x400', link: '/product' },
        { title: 'Incidunt Labore', description: 'Quis autem vel eum iure reprehenderit.', icon: 'mdi:speaker', image: 'https://placehold.co/600x400/webp?text=600x400', link: '/product' }
    ]
}

const displayData = computed(() => ({
    sectionTitle: props.data?.sectionTitle || defaultData.sectionTitle,
    highlightText: props.data?.highlightText || defaultData.highlightText
}))

const displayItems = computed(() => props.data?.items || defaultData.items)

function getGridClass(index: number) {
    const classes = ['card-0', 'card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6', 'card-7']
    return classes[index] || ''
}
</script>

<style scoped>
@import "@/styles/home/services-section/desktop.css";
@import "@/styles/home/services-section/mobile.css";
</style>
