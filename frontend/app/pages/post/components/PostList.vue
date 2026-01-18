<template>
    <section class="post-list-section">
        <div class="container">

            <div class="filter-bar">
                <button v-for="cat in categories" :key="cat" class="filter-btn" :class="{ active: currentCategory === cat }" @click="setCategory(cat)">
                    {{ cat }}
                </button>
            </div>


            <transition-group name="fade" tag="div" class="post-grid">
                <PostItem v-for="post in filteredPosts" :key="post.id" :post="post" />
            </transition-group>


            <div v-if="filteredPosts.length === 0" class="empty-state">
                <div class="empty-icon">
                    <Icon name="mdi:file-search-outline" />
                </div>
                <h3>Không tìm thấy bài viết</h3>
                <p>Vui lòng thử chọn danh mục khác</p>
            </div>


            <div class="pagination" v-if="filteredPosts.length > 0">
                <button class="page-btn active">1</button>
                <button class="page-btn">2</button>
                <button class="page-btn">3</button>
                <button class="page-btn next">
                    <Icon name="mdi:chevron-right" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import PostItem from './PostItem.vue'
import { POSTS, POST_CATEGORIES } from '../postListing.cms'

const categories = POST_CATEGORIES
const currentCategory = ref('Tất cả')

const setCategory = (cat) => {
    currentCategory.value = cat
}

const filteredPosts = computed(() => {
    if (currentCategory.value === 'Tất cả') return POSTS
    return POSTS.filter(post => post.category === currentCategory.value)
})
</script>

<style scoped>
@import "@/styles/post/post-list/desktop.css";
@import "@/styles/post/post-list/mobile.css";
</style>
