<template>
    <NuxtLayout name="main">
        <PageLoader />
        <main>
            <HeroSection />

            <ServicesSection />

            <ProjectSection />

            <NewsSection />

            <!-- <BlogSection /> -->

            <CertSection />

            <PartnerSection />
        </main>
    </NuxtLayout>
</template>

<script setup>
import PageLoader from '@/components/PageLoader.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import ProjectSection from './components/ProjectSection.vue'
import NewsSection from './components/NewsSection.vue'
import CertSection from './components/CertSection.vue'
import PartnerSection from './components/PartnerSection.vue'
// import BlogSection from './components/BlogSection.vue'
</script>
