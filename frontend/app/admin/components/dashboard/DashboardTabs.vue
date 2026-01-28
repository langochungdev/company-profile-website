<template>
    <div class="dashboard-tabs-wrapper">
        <div class="tabs-header">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                :class="['tab-button', { active: activeTab === tab.id }]"
                @click="activeTab = tab.id"
            >
                <Icon :name="tab.icon" />
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <div class="tab-content">
            <AnalyticsView v-if="activeTab === 'analytics'" />
            <StorageView v-else-if="activeTab === 'storage'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AnalyticsView from './viewer/AnalyticsView.vue'
import StorageView from './storage/StorageView.vue'

interface Tab {
    id: string
    label: string
    icon: string
}

const tabs: Tab[] = [
    { id: 'analytics', label: 'Analytics', icon: 'mdi:chart-line' },
    { id: 'storage', label: 'Storage', icon: 'mdi:database' }
]

const activeTab = ref('analytics')
</script>

<style scoped>
@import "./styles/tabs.css";
</style>
