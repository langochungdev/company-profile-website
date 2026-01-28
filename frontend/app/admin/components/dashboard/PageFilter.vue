<template>
    <div class="page-filter-wrapper">
        <label>Lọc theo trang</label>
        <select :value="selectedPage" @change="handleChange" class="page-select">
            <option value="all">Tất cả trang</option>
            <option value="home">Trang chủ</option>
            <option value="about-us">Giới thiệu</option>
            <option value="contact">Liên hệ</option>
            <option value="products">Sản phẩm</option>
            <option value="services">Dịch vụ</option>
            <option value="posts">Bài viết</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import type { PageKey } from '@/admin/types/analytics.type'

const props = defineProps<{
    selectedPage: PageKey | 'all'
}>()

const emit = defineEmits<{
    change: [PageKey | 'all']
}>()

const handleChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value as PageKey | 'all'
    emit('change', value)
}
</script>

<style scoped>
@import "./styles/page-filter.css";
</style>
