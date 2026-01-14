<template>
    <NuxtLayout name="main">
        <main>
            <ContactHeader />
            <ContactForm />
        </main>
    </NuxtLayout>
</template>

<script setup>
import ContactHeader from './components/ContactHeader.vue'
import ContactForm from './components/ContactForm.vue'

useSeoMeta({
    title: 'Liên Hệ - SHT Security',
    description: 'Liên hệ SHT Security để được tư vấn miễn phí về giải pháp camera an ninh, hạ tầng mạng, WiFi doanh nghiệp. Hotline: 0901 234 567.',
    ogTitle: 'Liên Hệ SHT Security - Tư Vấn Miễn Phí 24/7',
    ogDescription: 'Gọi ngay Hotline 0901 234 567 hoặc để lại thông tin để được đội ngũ chuyên gia tư vấn trong 30 phút.',
    ogType: 'website',
})

useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
                name: 'Liên Hệ SHT Security',
                description: 'Trang liên hệ của SHT Security',
                url: 'https://sht.langochung.me/contact'
            })
        }
    ]
})
</script>
