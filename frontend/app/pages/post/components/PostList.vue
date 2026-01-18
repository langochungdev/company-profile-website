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
                <PostItem v-for="post in previews" :key="post.id" :post="post" />
            </transition-group>

            <div v-if="!loading && previews.length === 0" class="empty-state">
                <div class="empty-icon">
                    <Icon name="mdi:file-search-outline" />
                </div>
                <h3>Không tìm thấy bài viết</h3>
                <p>Vui lòng thử chọn danh mục khác</p>
            </div>

            <div v-if="hasMore && !loading" class="load-more-wrapper">
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

const POST_CATEGORIES = ['Tất cả', 'Công nghệ', 'Hướng dẫn', 'Tin tức', 'Sự kiện']

const categories = POST_CATEGORIES
const currentCategory = ref('Tất cả')

const { previews, loading, hasMore, loadPreviews, loadMore: loadMorePreviews, filterByCategory } = usePreviewContext('collections/posts/items')

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
@import "@/styles/post/post-list/desktop.css";
@import "@/styles/post/post-list/mobile.css";
</style>
