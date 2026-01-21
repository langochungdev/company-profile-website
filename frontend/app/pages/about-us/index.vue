<template>
    <NuxtLayout name="main">
        <main>
            <AboutContent />
        </main>
    </NuxtLayout>
</template>

<script setup>
import AboutContent from './components/AboutContent.vue'

// useSeoMeta({
//     title: 'Giới Thiệu - SHT Security',
//     description: 'Tìm hiểu về SHT Security - Công ty chuyên cung cấp giải pháp an ninh camera AI, hạ tầng mạng, WiFi doanh nghiệp với hơn 10 năm kinh nghiệm.',
//     ogTitle: 'Về SHT Security - Đối Tác Tin Cậy Của Doanh Nghiệp',
//     ogDescription: 'Với đội ngũ kỹ sư chuyên nghiệp và hơn 500 dự án hoàn thành, SHT Security là lựa chọn hàng đầu cho giải pháp an ninh.',
//     ogType: 'website',
// })

// useHead({
//     script: [
//         {
//             type: 'application/ld+json',
//             innerHTML: JSON.stringify({
//                 '@context': 'https://schema.org',
//                 '@type': 'AboutPage',
//                 name: 'Giới Thiệu SHT Security',
//                 description: 'Thông tin về công ty SHT Security',
//                 url: 'https://sht.langochung.me/about-us'
//             })
//         }
//     ]
// })
</script>
