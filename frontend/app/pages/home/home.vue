<template>
    <NuxtLayout name="main">
        <main>
            <!-- Hero Section - Slideshow Banner -->
            <HeroSection />

            <!-- Section 1: Lĩnh Vực Hoạt Động (8 mảng cốt lõi) -->
            <ServicesSection />

            <!-- Section 2: Dự Án Tiêu Biểu -->
            <PortfolioSection />

            <!-- Section 3: Tin Tức - Social Media -->
            <BlogSection />

            <!-- Section 4 & 5: Chứng Nhận & Đối Tác -->
            <BrandSection />
        </main>
    </NuxtLayout>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import BlogSection from './components/BlogSection.vue'
import BrandSection from './components/BrandSection.vue'

// SEO Meta Tags
useSeoMeta({
    title: 'SHT Security - Giải Pháp An Ninh & Hạ Tầng Mạng Chuyên Nghiệp',
    description: 'SHT chuyên cung cấp giải pháp camera an ninh AI, hạ tầng mạng, WiFi doanh nghiệp, Access Control, báo cháy, tổng đài IP cho gia đình và doanh nghiệp tại TP.HCM.',
    keywords: 'camera an ninh, lắp đặt camera, hạ tầng mạng, wifi doanh nghiệp, access control, báo cháy, tổng đài ip, SHT security',
    ogTitle: 'SHT Security - Giải Pháp An Ninh & Hạ Tầng Mạng',
    ogDescription: 'Chuyên gia về camera AI, mạng LAN, WiFi, Access Control, báo cháy cho gia đình và doanh nghiệp.',
    ogImage: '/images/og-image.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image'
})

// JSON-LD Structured Data
useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'SHT Security',
                url: 'https://sht.vn',
                logo: 'https://sht.vn/images/logo.png',
                description: 'Chuyên cung cấp giải pháp an ninh và hạ tầng mạng cho gia đình và doanh nghiệp',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: '123 Đường ABC, Phường XYZ',
                    addressLocality: 'Quận 1',
                    addressRegion: 'TP. Hồ Chí Minh',
                    addressCountry: 'VN'
                },
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+84-901-234-567',
                    contactType: 'sales',
                    availableLanguage: 'Vietnamese'
                },
                sameAs: [
                    'https://facebook.com/SHT.security',
                    'https://tiktok.com/@sht.security',
                    'https://youtube.com/@SHTsecurity'
                ]
            })
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Trang Chủ',
                        item: 'https://sht.vn'
                    }
                ]
            })
        }
    ]
})
</script>
