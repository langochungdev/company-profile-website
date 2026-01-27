<template>
    <section class="contact-section">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-info">
                    <h2 class="info-title" data-field="info.title">{{ displayInfo.title }}</h2>
                    <div class="info-list">
                        <div v-for="(item, index) in displayInfo.items" :key="item.label" class="info-item">
                            <div class="info-icon-wrap">
                                <Icon :name="item.icon" class="info-icon" />
                            </div>
                            <div class="info-content">
                                <span class="info-label" :data-field="`info.items.${index}.label`">{{ item.label }}</span>
                                <span class="info-value" :data-field="`info.items.${index}.value`">{{ item.value }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="social-links">
                        <a v-for="(social, index) in displaySocials" :key="social.name" :href="social.url" target="_blank" rel="noopener noreferrer" class="social-link" :aria-label="social.name" :data-field="`socials.items.${index}.url`">
                            <Icon :name="social.icon" />
                        </a>
                    </div>
                </div>

                <div class="office-location">
                    <h2 class="location-title" data-field="map.title">{{ displayMap.title }}</h2>
                    <div class="map-wrapper" data-field-link="map.embedUrl">
                        <iframe :src="displayMap.embedUrl" width="100%" height="350" style="border:0; border-radius: 1rem;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ SHT Security"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ContactItem {
    label: string
    value: string
    icon: string
}

interface SocialItem {
    name: string
    icon: string
    url: string
}

interface ContactData {
    info?: { title?: string; items?: ContactItem[] }
    socials?: { items?: SocialItem[] }
    map?: { title?: string; embedUrl?: string }
}

const props = defineProps<{
    data?: ContactData | null
    editMode?: boolean
}>()

const defaultInfo = {
    title: 'Thông Tin Liên Hệ',
    items: [
        { label: 'Hotline', value: '0901 234 567', icon: 'mdi:phone' },
        { label: 'Email', value: 'info@sht.vn', icon: 'mdi:email' },
        { label: 'Địa chỉ', value: '123 Đường ABC, Quận 1, TP.HCM', icon: 'mdi:map-marker' },
        { label: 'Giờ làm việc', value: 'T2 - T7: 8:00 - 18:00', icon: 'mdi:clock-outline' }
    ]
}

const defaultSocials: SocialItem[] = [
    { name: 'Facebook', icon: 'mdi:facebook', url: 'https://facebook.com/SHT.security' },
    { name: 'TikTok', icon: 'mdi:music-note', url: 'https://tiktok.com/@sht.security' },
    { name: 'YouTube', icon: 'mdi:youtube', url: 'https://youtube.com/@SHTsecurity' },
    { name: 'Zalo', icon: 'mdi:chat', url: 'https://zalo.me/0901234567' }
]

const defaultMap = {
    title: 'Vị Trí Văn Phòng',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69765841533417!3d10.778789792319392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1704796800000'
}

const displayInfo = computed(() => {
    const base = { ...defaultInfo }
    const edited = props.data?.info || {}
    return {
        ...base,
        ...edited,
        items: edited.items?.length
            ? defaultInfo.items.map((b, i) => ({ ...b, ...(edited.items?.[i] || {}) }))
            : base.items
    }
})

const displaySocials = computed(() => {
    const edited = props.data?.socials?.items
    if (!edited || edited.length === 0) return defaultSocials
    return defaultSocials.map((base, index) => ({ ...base, ...(edited[index] || {}) }))
})

const displayMap = computed(() => ({ ...defaultMap, ...(props.data?.map || {}) }))

useSeoMeta({
    title: 'Liên Hệ - SHT Security',
    description: 'Liên hệ với SHT Security để được tư vấn giải pháp an ninh tốt nhất. Hotline: 0901 234 567',
})
</script>

<style scoped>
@import "../styles/contact-form.css";
</style>
