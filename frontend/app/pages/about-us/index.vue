<template>
    <NuxtLayout name="main">
        <main>
            <AboutContent :data="contentData" />
        </main>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AboutContent from './(components)/AboutContent.vue'
import { usePageData } from '@/admin/composables/usePageData'

interface AboutPageData {
    content?: {
        hero?: { title?: string; highlight?: string; description?: string }
        intro?: { image?: string; experienceYears?: string; experienceText?: string; sectionTitle?: string; descriptions?: Array<{ text: string }> }
        stats?: { items?: Array<{ value: string; label: string; icon: string }> }
        values?: { sectionTitle?: string; highlightText?: string; items?: Array<{ title: string; description: string; icon: string }> }
        cta?: { title?: string; description?: string; buttonText?: string; buttonLink?: string }
    }
    [key: string]: unknown
}

const { data: pageData, loadData } = usePageData<AboutPageData>('pages/about-us')

const contentData = computed(() => pageData.value?.content || null)

onMounted(() => {
    loadData()
})
</script>
