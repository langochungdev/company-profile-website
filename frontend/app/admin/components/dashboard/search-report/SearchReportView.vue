<template>
    <div class="search-report-wrapper">
        <div class="dashboard-header">
            <h1>Search Report</h1>
            <p>Phân tích tìm kiếm từ Algolia</p>
        </div>

        <div v-if="loading" class="loading-state">
            <div class="spinner" />
            <p>Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <Icon name="mdi:alert-circle" />
            <p>{{ error }}</p>
            <button @click="fetchAnalytics" class="retry-btn">Thử lại</button>
        </div>

        <div v-else class="search-content">
            <div class="stats-grid">
                <StatsCard label="Tổng tìm kiếm" :value="analytics.totalSearches" icon="mdi:magnify" subtitle="Trong khoảng thời gian đã chọn" />
                <StatsCard label="Tổng clicks" :value="analytics.totalClicks" icon="mdi:cursor-default-click" subtitle="Nhấp vào kết quả tìm kiếm" />
                <StatsCard label="Tỷ lệ nhấp (CTR)" :value="`${analytics.clickThroughRate}%`" icon="mdi:chart-line-variant" subtitle="Click-through rate" />
                <StatsCard label="Tỷ lệ không có kết quả" :value="`${analytics.noResultsRate}%`" icon="mdi:close-circle-outline" subtitle="Tìm kiếm không có kết quả" />
            </div>

            <div class="filters-row">
                <div class="env-filter">
                    <label>Môi trường:</label>
                    <select v-model="selectedEnv" @change="fetchAnalytics">
                        <option value="all">Tất cả</option>
                        <option value="prod">Production</option>
                        <option value="dev">Development</option>
                    </select>
                </div>
                <DateRangePicker :start-date="startDate" :end-date="endDate" @change="updateDateRange" />
            </div>

            <div class="chart-section">
                <h2>Hoạt động tìm kiếm</h2>
                <LineChart :labels="chartLabels" :data="chartData" label="Số lượt tìm kiếm" />
            </div>

            <div class="search-terms-grid">
                <div class="search-terms-section">
                    <h2>Top Search Terms</h2>
                    <p class="section-subtitle">Từ khóa được tìm kiếm nhiều nhất</p>
                    <div v-if="analytics.topSearches.length === 0" class="empty-state">
                        Chưa có dữ liệu
                    </div>
                    <table v-else class="search-terms-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Từ khóa</th>
                                <th>Số lần tìm kiếm</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(term, index) in analytics.topSearches" :key="term.search">
                                <td>{{ index + 1 }}</td>
                                <td class="search-term">{{ term.search }}</td>
                                <td class="count">{{ term.count }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="search-terms-section">
                    <h2>No Results Searches</h2>
                    <p class="section-subtitle">Từ khóa tìm kiếm nhưng không có kết quả</p>
                    <div v-if="analytics.noResultSearches.length === 0" class="empty-state">
                        Không có từ khóa nào
                    </div>
                    <table v-else class="search-terms-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Từ khóa</th>
                                <th>Số lần tìm kiếm</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(term, index) in analytics.noResultSearches" :key="term.search">
                                <td>{{ index + 1 }}</td>
                                <td class="search-term">{{ term.search }}</td>
                                <td class="count">{{ term.count }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="last-updated">
                Cập nhật lần cuối: {{ formatDate(analytics.lastUpdated) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StatsCard from '../viewer/StatsCard.vue'
import DateRangePicker from '../viewer/DateRangePicker.vue'
import LineChart from '../viewer/LineChart.vue'
import type { AlgoliaAnalyticsResponse } from '@/admin/types/algolia.type'

const loading = ref(true)
const error = ref<string | null>(null)
const analytics = ref<AlgoliaAnalyticsResponse>({
    totalSearches: 0,
    totalClicks: 0,
    clickThroughRate: 0,
    noResultsRate: 0,
    dailyStats: [],
    topSearches: [],
    noResultSearches: [],
    lastUpdated: new Date().toISOString()
})

const formatDateISO = (date: Date): string => {
    return date.toISOString().split('T')[0] || ''
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN')
}

const getDefaultDateRange = () => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 7)
    return {
        start: formatDateISO(startDate),
        end: formatDateISO(endDate)
    }
}

const defaults = getDefaultDateRange()
const startDate = ref(defaults.start)
const endDate = ref(defaults.end)
const selectedEnv = ref('all')

const chartLabels = computed(() => {
    return analytics.value.dailyStats.map(stat => {
        const date = new Date(stat.date)
        return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
    })
})

const chartData = computed(() => {
    return analytics.value.dailyStats.map(stat => stat.searches)
})

const fetchAnalytics = async () => {
    loading.value = true
    error.value = null

    console.log('[SearchReport] Fetching analytics with dates:', {
        startDate: startDate.value,
        endDate: endDate.value
    })

    try {
        const data = await $fetch<AlgoliaAnalyticsResponse>('/api/algolia-analytics', {
            query: {
                startDate: startDate.value,
                endDate: endDate.value,
                env: selectedEnv.value
            }
        })

        console.log('[SearchReport] ✅ Received data:', data)
        console.log('[SearchReport] Stats:', {
            totalSearches: data.totalSearches,
            totalClicks: data.totalClicks,
            ctr: data.clickThroughRate,
            noResults: data.noResultsRate,
            dailyStatsCount: data.dailyStats?.length || 0
        })

        analytics.value = data
        console.log('[SearchReport] ✅ Analytics state updated:', analytics.value)
    } catch (err: any) {
        console.error('[SearchReport] ❌ Fetch error:', err)
        error.value = err?.data?.message || 'Không thể tải dữ liệu analytics'
    } finally {
        loading.value = false
    }
}

const updateDateRange = ({ startDate: newStart, endDate: newEnd }: { startDate: string; endDate: string }) => {
    startDate.value = newStart
    endDate.value = newEnd
    fetchAnalytics()
}

onMounted(() => {
    fetchAnalytics()
})
</script>

<style scoped>
@import "../styles/dashboard.css";
@import "./styles/search-report.css";
</style>
