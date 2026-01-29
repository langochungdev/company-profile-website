<template>
    <section class="post-list-wrapper">
        <div class="container">
            <div class="filter-bar">
                <button v-for="cat in displayCategories" :key="cat" class="filter-btn" :class="{ active: currentCategory === cat }" @click="setCategory(cat)">
                    {{ cat }}
                </button>
            </div>

            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải bài viết...</span>
            </div>

            <transition-group v-else name="fade" tag="div" class="post-grid">
                <PostItem v-for="post in paginatedPosts" :key="post.id" :post="post" :class="{ 'is-placeholder': post.isPlaceholder }" />
            </transition-group>

            <div v-if="totalPages > 1 && !loading" class="pagination">
                <button :disabled="currentPage === 1" class="pagination-btn" @click="goToPage(currentPage - 1)">
                    <Icon name="mdi:chevron-left" />
                </button>
                <button v-for="page in displayedPages" :key="page" :class="['page-btn', { active: currentPage === page }]" @click="goToPage(page)">
                    {{ page }}
                </button>
                <button :disabled="currentPage === totalPages" class="pagination-btn" @click="goToPage(currentPage + 1)">
                    <Icon name="mdi:chevron-right" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import PostItem from './PostItem.vue'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { PLACEHOLDER_POSTS } from '@/constants/placeholders'
import { PageService } from '@/admin/services/page.service'
import type { Firestore } from 'firebase/firestore'

const categories = ref<string[]>([])
const currentCategory = ref('Tất cả')
const currentPage = ref(1)
const itemsPerPage = 9

const { previews, loading, loadPreviews } = usePreviewContext('collections/posts/items')

const displayCategories = computed(() => {
    return ['Tất cả', ...categories.value]
})

const publishedPosts = computed(() => {
    return previews.value.filter(post => post.status === 'published')
})

const displayPosts = computed(() => {
    if (publishedPosts.value.length === 0 && !loading.value) {
        return PLACEHOLDER_POSTS
    }

    if (currentCategory.value === 'Tất cả') {
        return publishedPosts.value
    }

    return publishedPosts.value.filter(post => post.category === currentCategory.value)
})

const totalPages = computed(() => Math.ceil(displayPosts.value.length / itemsPerPage) || 1)

const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return displayPosts.value.slice(start, end)
})

const displayedPages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadCategories = async () => {
    try {
        const { $db } = useNuxtApp()
        const db = $db as Firestore

        const { getFirestorePath } = await import('@/admin/utils/firestore')
        const configPath = getFirestorePath('collections/posts/config/settings')


        const configData = await PageService.get(db, configPath)


        if (configData?.categories && Array.isArray(configData.categories)) {
            categories.value = configData.categories.map((cat: any) => cat.name || cat)

        } else {

        }
    } catch (error) {

    }
}

onMounted(async () => {
    await loadCategories()
    await loadPreviews({ limitCount: 100 })
})

const setCategory = (cat: string) => {
    currentCategory.value = cat
    currentPage.value = 1
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => currentCategory.value, () => {
    currentPage.value = 1
})
</script>

<style scoped>
@import "../styles/post-list.css";
</style>
