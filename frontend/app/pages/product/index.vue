<template>
    <NuxtLayout name="main">
        <main>
            <ProductHeader />
            <ProductList />
        </main>
    </NuxtLayout>
</template>

<script setup>
import ProductHeader from './components/ProductHeader.vue'
import ProductList from './components/ProductList.vue'

useSeoMeta({
    title: 'Sản Phẩm & Giải Pháp - SHT Security',
    description: 'Danh mục sản phẩm an ninh, camera AI, thiết bị mạng WiFi doanh nghiệp, switch PoE, báo cháy và access control chính hãng.',
    ogTitle: 'SHT Security - Thiết Bị An Ninh & Mạng Chính Hãng',
    ogDescription: 'Cung cấp và lắp đặt trọn gói Camera, Router, Switch, WiFi, Tổng đài cho dự án và gia đình.',
    ogType: 'website',
})

useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Sản Phẩm & Giải Pháp SHT',
                description: 'Danh sách sản phẩm và giải pháp an ninh, mạng',
                url: 'https://sht.langochung.me/product'
            })
        }
    ]
})
</script>
