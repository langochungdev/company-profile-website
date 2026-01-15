<template>
    <NuxtLayout name="main">
        <main>
            <ServiceList />
        </main>
    </NuxtLayout>
</template>

<script setup>
import ServiceList from './components/ServiceList.vue'

useSeoMeta({
    title: 'Dịch Vụ - SHT Security',
    description: 'Cung cấp giải pháp tổng thể về Camera AI, Hạ tầng mạng LAN/WiFi, Kiểm soát ra vào, Báo cháy và Tổng đài IP cho doanh nghiệp.',
    ogTitle: 'SHT Security - Giải Pháp An Ninh & Mạng Toàn Diện',
    ogDescription: 'Camera giám sát AI, Mạng LAN Enterprise, WiFi 7, Access Control, Báo cháy thông minh, Tổng đài IP Cloud.',
    ogType: 'website',
})

useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Service',
                name: 'SHT Security Services',
                description: 'Giải pháp an ninh và mạng doanh nghiệp',
                provider: {
                    '@type': 'Organization',
                    name: 'SHT Security',
                    logo: 'https://sht.langochung.me/images/logo.png'
                }
            })
        }
    ]
})
</script>
