<template>
    <section class="post-list-wrapper">
        <div class="container">
            <div class="filter-bar">
                <button v-for="cat in categories" :key="cat" class="filter-btn" :class="{ active: currentCategory === cat }" @click="setCategory(cat)">
                    {{ cat }}
                </button>
            </div>

            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải bài viết...</span>
            </div>

            <transition-group v-else name="fade" tag="div" class="post-grid">
                <PostItem v-for="post in displayPosts" :key="post.id" :post="post" :class="{ 'is-placeholder': post.isPlaceholder }" />
            </transition-group>

            <div v-if="hasMore && !loading && previews.length > 0" class="load-more-wrapper">
                <button class="load-more-btn" @click="loadMore">
                    <Icon name="mdi:plus" />
                    Xem thêm bài viết
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import PostItem from './PostItem.vue'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { PLACEHOLDER_POSTS } from '@/constants/placeholders'

const POST_CATEGORIES = ['Tất cả', 'Công nghệ', 'Hướng dẫn', 'Tin tức', 'Sự kiện']

const categories = POST_CATEGORIES
const currentCategory = ref('Tất cả')

const { previews, loading, hasMore, loadPreviews, loadMore: loadMorePreviews, filterByCategory } = usePreviewContext('collections/posts/items')

const displayPosts = computed(() => {
    if (previews.value.length === 0 && !loading.value) {
        return PLACEHOLDER_POSTS
    }
    return previews.value
})

onMounted(() => {
    loadPreviews({ limitCount: 12 })
})

const setCategory = async (cat) => {
    currentCategory.value = cat
    if (cat === 'Tất cả') {
        await filterByCategory(null)
    } else {
        await filterByCategory(cat)
    }
}

const loadMore = () => {
    loadMorePreviews()
}
</script>

<style scoped>
@import "../styles/post-list.css";
</style>
