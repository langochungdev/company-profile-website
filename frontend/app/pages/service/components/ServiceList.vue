<template>
    <section class="service-list-wrapper">
        <div class="container">
            <div class="filter-bar">
                <button v-for="cat in categories" :key="cat" class="filter-btn" :class="{ active: currentCategory === cat }" @click="setCategory(cat)">
                    {{ cat }}
                </button>
            </div>

            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải dịch vụ...</span>
            </div>

            <transition-group v-else name="fade" tag="div" class="service-grid">
                <ServiceItem v-for="service in displayServices" :key="service.id" :service="service" :class="{ 'is-placeholder': service.isPlaceholder }" />
            </transition-group>

            <div v-if="hasMore && !loading && previews.length > 0" class="load-more-wrapper">
                <button class="load-more-btn" @click="loadMore">
                    <Icon name="mdi:plus" />
                    Xem thêm dịch vụ
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import ServiceItem from './ServiceItem.vue'
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { PLACEHOLDER_SERVICES } from '@/constants/placeholders'

const SERVICE_CATEGORIES = ['Tất cả', 'Camera', 'Mạng WiFi', 'Tổng đài', 'Báo cháy', 'Access Control']

const categories = SERVICE_CATEGORIES
const currentCategory = ref('Tất cả')

const { previews, loading, hasMore, loadPreviews, loadMore: loadMorePreviews, filterByCategory } = usePreviewContext('collections/services/items')

const displayServices = computed(() => {
    if (previews.value.length === 0 && !loading.value) {
        return PLACEHOLDER_SERVICES
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
@import "../styles/service-list.css";
</style>
