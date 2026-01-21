<template>
    <NuxtLayout name="main">
        <ClientOnly>
            <PageLoader />
        </ClientOnly>
        <main>
            <HeroSection :data="(pageData?.hero as any)" />

            <ServicesSection :data="(pageData?.services as any)" />

            <ProjectSection :data="(pageData?.projects as any)" />

            <NewsSection :data="(pageData?.news as any)" />

            <CertSection :data="(pageData?.certificates as any)" />

            <PartnerSection :data="(pageData?.partners as any)" />
        </main>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageLoader from './components/PageLoader.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import ProjectSection from './components/ProjectSection.vue'
import NewsSection from './components/NewsSection.vue'
import CertSection from './components/CertSection.vue'
import PartnerSection from './components/PartnerSection.vue'
import { usePageData } from '@/composables/usePageData'

type HomePageData = Record<string, Record<string, unknown>>

const { data: pageData, loadData } = usePageData<HomePageData>('pages/home')

onMounted(() => {
    loadData()
})
</script>
