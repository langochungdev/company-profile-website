<template>
    <NuxtLayout name="main">
        <main>
            <PostHeader />
            <PostList />
        </main>
    </NuxtLayout>
</template>

<script setup>
import PostHeader from './components/PostHeader.vue'
import PostList from './components/PostList.vue'

useSeoMeta({
    title: 'Tin Tức & Sự Kiện - SHT Security',
    description: 'Cập nhật tin tức mới nhất về công nghệ an ninh, camera AI, hạ tầng mạng doanh nghiệp, giải pháp WiFi và kiểm soát ra vào từ SHT.',
    ogTitle: 'SHT Security Blog - Kiến Thức An Ninh & Mạng',
    ogDescription: 'Chia sẻ kiến thức chuyên sâu về Camera giám sát, Mạng LAN/WiFi, Hệ thống báo cháy và Tổng đài IP.',
    ogType: 'website',
})

useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Blog',
                name: 'SHT Security Blog',
                description: 'Chia sẻ kiến thức về an ninh và mạng',
                publisher: {
                    '@type': 'Organization',
                    name: 'SHT Security',
                    logo: 'https://sht.langochung.me/images/logo.png'
                }
            })
        }
    ]
})
</script>
