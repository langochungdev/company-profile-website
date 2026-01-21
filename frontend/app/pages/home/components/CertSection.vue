<template>
    <section class="certificates-section" aria-label="Chứng nhận">
        <div class="certificates-container">
            <div class="certificates-box">
                <div class="certificates-content">
                    <div class="certificates-header">
                        <h2 class="certificates-title">
                            <span data-field="sectionTitle">{{ displayData.sectionTitle }}</span>
                            <span class="text-primary" data-field="highlightText"> {{ displayData.highlightText }}</span>
                        </h2>
                        <p class="certificates-subtitle" data-field="subtitle">{{ displayData.subtitle }}</p>
                    </div>
                    <div class="certificates-scroll-wrapper">
                        <div class="certificates-scroll" @mouseenter="pauseAnimation = true" @mouseleave="pauseAnimation = false">
                            <div class="certificates-track" :class="{ paused: pauseAnimation }">
                                <template v-for="set in duplicateCount" :key="'cert-set-' + set">
                                    <div v-for="(cert, index) in displayItems" :key="'cert-' + set + '-' + index" class="certificate-item">
                                        <div class="certificate-card" @click="openPopup(cert.image)">
                                            <img :src="getImageSrc(cert.image)" :alt="getImageAlt(cert.image, cert.title || 'Giấy chứng nhận')" :title="getImageTitle(cert.image)" :width="getImageWidth(cert.image)" :height="getImageHeight(cert.image)" loading="lazy" class="certificate-img" :data-field="`items.${index}.image`" data-field-type="image" />
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ClientOnly>
            <Teleport to="body">
                <Transition name="fade">
                    <div v-if="showPopup" class="popup-overlay" @click="closePopup">
                        <div class="popup-content">
                            <img :src="selectedImage" :alt="getImageAlt(selectedImage, 'Giấy chứng nhận')" class="popup-img" />
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </ClientOnly>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { getImageSrc, getImageAlt, getImageTitle, getImageWidth, getImageHeight, type ImageValue } from '@/admin/utils/imageHelper'

interface CertItem {
    image: ImageValue
    title?: string
}

interface CertData {
    sectionTitle?: string
    highlightText?: string
    subtitle?: string
    items?: CertItem[]
}

const props = defineProps<{
    data?: CertData
    editMode?: boolean
}>()

const pauseAnimation = ref(false)
const showPopup = ref(false)
const selectedImage = ref('')

const defaultData = {
    sectionTitle: 'Giấy Chứng Nhận &',
    highlightText: 'Chứng Chỉ',
    subtitle: 'Uy tín & Chất lượng được công nhận'
}

const defaultItems: CertItem[] = Array.from({ length: 5 }, (_, i) => ({
    image: 'https://placehold.co/300x400/webp?text=300x400',
    title: `Chứng nhận ${i + 1}`
}))

const displayData = computed(() => ({
    sectionTitle: props.data?.sectionTitle || defaultData.sectionTitle,
    highlightText: props.data?.highlightText || defaultData.highlightText,
    subtitle: props.data?.subtitle || defaultData.subtitle
}))

const displayItems = computed(() => {
    const items = props.data?.items
    if (!items || items.length === 0) return defaultItems
    return items
})

const duplicateCount = computed(() => {
    const itemCount = displayItems.value.length
    if (itemCount >= 6) return 2
    if (itemCount >= 3) return 3
    return Math.ceil(12 / Math.max(itemCount, 1))
})

const openPopup = (imageSrc: ImageValue) => {
    selectedImage.value = getImageSrc(imageSrc)
    showPopup.value = true
    document.body.style.overflow = 'hidden'
}

const closePopup = () => {
    showPopup.value = false
    document.body.style.overflow = ''
}

onUnmounted(() => {
    document.body.style.overflow = ''
})
</script>

<style scoped>
@import "@/styles/home/cert-section/desktop.css";
@import "@/styles/home/cert-section/mobile.css";
</style>
