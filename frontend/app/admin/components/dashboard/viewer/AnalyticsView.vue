<template>
    <div class="analytics-view-wrapper">
        <div class="dashboard-header">
            <h1>Dashboard Analytics</h1>
            <p>Thống kê lượt truy cập website</p>
        </div>

        <div v-if="loading" class="loading-state">
            <div class="spinner" />
            <p>Đang tải dữ liệu...</p>
        </div>

        <div v-else class="dashboard-content">
            <div class="stats-grid">
                <StatsCard label="Tổng lượt xem (7 ngày)" :value="weeklyStats.totalViews" icon="mdi:eye" subtitle="Theo khoảng thời gian đã chọn" />
                <StatsCard label="Trang phổ biến nhất" :value="getPageLabel(weeklyStats.topPage.key)" icon="mdi:chart-line" :subtitle="`${weeklyStats.topPage.views.toLocaleString('vi-VN')} lượt xem`" />
                <StatsCard label="Lượt xem hôm nay" :value="todayCounter" icon="mdi:clock-outline" subtitle="Cập nhật thời gian thực" />
            </div>

            <div class="filters-row">
                <PageFilter :selected-page="selectedPage" @change="updatePageFilter" />
                <DateRangePicker :start-date="startDate" :end-date="endDate" @change="updateDateRange" />
            </div>

            <div class="chart-section">
                <h2>Biểu đồ lượt truy cập</h2>
                <LineChart :labels="chartLabels" :data="chartData" :label="selectedPage === 'all' ? 'Tất cả trang' : getPageLabel(selectedPage)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import StatsCard from './StatsCard.vue'
import LineChart from './LineChart.vue'
import PageFilter from './PageFilter.vue'
import DateRangePicker from './DateRangePicker.vue'
import { useDashboardAnalytics } from '@/admin/composables/useDashboardAnalytics'
import type { PageKey } from '@/admin/types/analytics.type'

const {
    loading,
    startDate,
    endDate,
    selectedPage,
    chartLabels,
    chartData,
    weeklyStats,
    todayCounter,
    updateDateRange,
    updatePageFilter
} = useDashboardAnalytics()

const PAGE_LABELS: Record<PageKey, string> = {
    'home': 'Trang chủ',
    'about-us': 'Giới thiệu',
    'contact': 'Liên hệ',
    'products': 'Sản phẩm',
    'services': 'Dịch vụ',
    'posts': 'Bài viết'
}

const getPageLabel = (key: PageKey) => {
    return PAGE_LABELS[key] || key
}
</script>

<style scoped>
@import "../styles/dashboard.css";
</style>
