<!-- Chức năng: Hiển thị logo đối tác với hiệu ứng cuộn ngang -->
<template>
    <section class="partners-section" aria-label="Đối tác">
        <div class="partners-container">
            <div class="partners-box">
                <div class="partners-content">
                    <div class="partners-header">
                        <h2 class="partners-title">
                            <span data-field="sectionTitle">{{ displayData.sectionTitle }}</span>
                            <span class="text-primary" data-field="highlightText"> {{ displayData.highlightText }}</span>
                        </h2>
                        <p class="partners-subtitle" data-field="subtitle">{{ displayData.subtitle }}</p>
                    </div>
                    <div class="partners-scroll-wrapper">
                        <div class="partners-scroll" @mouseenter="pausePartners = true" @mouseleave="pausePartners = false">
                            <div class="partners-track" :class="{ paused: pausePartners }">
                                <template v-for="set in duplicateCount" :key="'partner-set-' + set">
                                    <a v-for="(partner, index) in displayItems" :key="'partner-' + set + '-' + index" :href="partner.link || '#'" target="_blank" rel="noopener" class="partner-item" :data-field-link="`items.${index}.link`">
                                        <img :src="getImageSrc(partner.logo)" :alt="getImageAlt(partner.logo, partner.name || 'Đối tác')" :title="getImageTitle(partner.logo)" :width="getImageWidth(partner.logo)" :height="getImageHeight(partner.logo)" loading="lazy" class="partner-logo" :data-field="`items.${index}.logo`" data-field-type="image" />
                                    </a>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getImageSrc, getImageAlt, getImageTitle, getImageWidth, getImageHeight, type ImageValue } from '@/admin/utils/imageHelper'

interface PartnerItem {
    logo: ImageValue
    name?: string
    link?: string
}

interface PartnerData {
    sectionTitle?: string
    highlightText?: string
    subtitle?: string
    items?: PartnerItem[]
}

const props = defineProps<{
    data?: PartnerData
    editMode?: boolean
}>()

const pausePartners = ref(false)

const defaultData = {
    sectionTitle: 'Đối Tác',
    highlightText: 'Tin Cậy',
    subtitle: 'Hợp tác cùng các thương hiệu hàng đầu'
}

const defaultItems: PartnerItem[] = Array.from({ length: 5 }, (_, i) => ({
    logo: 'https://placehold.co/200x100/webp?text=200x100',
    name: `Partner ${i + 1}`
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
</script>

<style scoped>
@import "@/styles/home/partner-section/desktop.css";
@import "@/styles/home/partner-section/mobile.css";
</style>
