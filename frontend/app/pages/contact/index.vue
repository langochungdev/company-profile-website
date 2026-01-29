<template>
    <NuxtLayout name="main">
        <main>
            <ContactForm :data="contentData" />
        </main>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import ContactForm from './(components)/ContactForm.vue'
import { usePageData } from '@/admin/composables/usePageData'

interface ContactPageData {
    content?: {
        info?: { title?: string; items?: Array<{ label: string; value: string; icon: string }> }
        socials?: { items?: Array<{ name: string; icon: string; url: string }> }
        map?: { title?: string; embedUrl?: string }
    }
    [key: string]: unknown
}

const { data: pageData, loadData } = usePageData<ContactPageData>('pages/contact')


const contentData = computed(() => pageData.value?.content || null)

onMounted(() => {
    loadData()
})

useSeoMeta({
    title: 'Liên Hệ',
    description: 'Liên hệ với SHT Security để được tư vấn giải pháp an ninh thông minh phù hợp nhất cho doanh nghiệp của bạn.'
})
</script>
