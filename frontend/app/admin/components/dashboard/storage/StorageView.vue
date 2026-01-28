<template>
    <div class="storage-view-wrapper">
        <div class="dashboard-header">
            <h1>Storage Management</h1>
            <p>Quản lý dung lượng Cloudinary</p>
        </div>

        <div v-if="loading" class="loading-state">
            <div class="spinner" />
            <p>Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <Icon name="mdi:alert-circle" />
            <p>{{ error }}</p>
            <button @click="fetchUsage" class="retry-btn">Thử lại</button>
        </div>

        <div v-else class="storage-content">
            <div class="stats-overview">
                <div class="stat-item">
                    <div class="stat-icon storage">
                        <Icon name="mdi:database" />
                    </div>
                    <div class="stat-info">
                        <span class="stat-label">Storage Used</span>
                        <span class="stat-value">{{ formatBytes(usage.storage.used) }}</span>
                        <span class="stat-sublabel">of {{ formatBytes(usage.storage.limit) }}</span>
                    </div>
                </div>

                <div class="stat-item">
                    <div class="stat-icon bandwidth">
                        <Icon name="mdi:swap-horizontal" />
                    </div>
                    <div class="stat-info">
                        <span class="stat-label">Bandwidth Used</span>
                        <span class="stat-value">{{ formatBytes(usage.bandwidth.used) }}</span>
                        <span class="stat-sublabel">of {{ formatBytes(usage.bandwidth.limit) }}</span>
                    </div>
                </div>

                <div class="stat-item">
                    <div class="stat-icon resources">
                        <Icon name="mdi:image-multiple" />
                    </div>
                    <div class="stat-info">
                        <span class="stat-label">Total Resources</span>
                        <span class="stat-value">{{ usage.resources.toLocaleString('vi-VN') }}</span>
                        <span class="stat-sublabel">images & videos</span>
                    </div>
                </div>
            </div>

            <div class="chart-container">
                <h2>Usage Overview</h2>
                <div class="usage-bars">
                    <div class="usage-bar-item">
                        <div class="bar-header">
                            <span class="bar-label">Storage</span>
                            <span class="bar-percent">{{ usage.storage.usedPercent }}%</span>
                        </div>
                        <div class="bar-track">
                            <div 
                                class="bar-fill storage-fill"
                                :style="{ width: `${usage.storage.usedPercent}%` }"
                            />
                        </div>
                        <div class="bar-footer">
                            <span>{{ formatBytes(usage.storage.used) }} / {{ formatBytes(usage.storage.limit) }}</span>
                        </div>
                    </div>

                    <div class="usage-bar-item">
                        <div class="bar-header">
                            <span class="bar-label">Bandwidth</span>
                            <span class="bar-percent">{{ usage.bandwidth.usedPercent }}%</span>
                        </div>
                        <div class="bar-track">
                            <div 
                                class="bar-fill bandwidth-fill"
                                :style="{ width: `${usage.bandwidth.usedPercent}%` }"
                            />
                        </div>
                        <div class="bar-footer">
                            <span>{{ formatBytes(usage.bandwidth.used) }} / {{ formatBytes(usage.bandwidth.limit) }}</span>
                        </div>
                    </div>
                </div>

                <div class="last-updated">
                    Last updated: {{ formatDate(usage.lastUpdated) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CloudinaryUsageResponse } from '@/admin/types/cloudinary.type'

const loading = ref(true)
const error = ref<string | null>(null)
const usage = ref<CloudinaryUsageResponse>({
    storage: { used: 0, limit: 0, usedPercent: 0 },
    bandwidth: { used: 0, limit: 0, usedPercent: 0 },
    resources: 0,
    lastUpdated: new Date().toISOString()
})

const fetchUsage = async () => {
    loading.value = true
    error.value = null
    
    try {
        const data = await $fetch<CloudinaryUsageResponse>('/api/cloudinary-usage')
        usage.value = data
    } catch (err: any) {
        error.value = err?.data?.message || 'Không thể tải dữ liệu usage'
        console.error('Cloudinary usage fetch error:', err)
    } finally {
        loading.value = false
    }
}

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN')
}

onMounted(() => {
    fetchUsage()
})
</script>

<style scoped>
@import "../styles/storage.css";
</style>
