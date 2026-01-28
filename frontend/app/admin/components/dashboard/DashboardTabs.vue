<template>
    <div class="dashboard-tabs-wrapper">
        <div class="tabs-header">
            <button v-for="tab in tabs" :key="tab.id" :class="['tab-button', { active: activeTab === tab.id }]" @click="activeTab = tab.id">
                <Icon :name="tab.icon" />
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <div class="tab-content">
            <AnalyticsView v-if="activeTab === 'analytics'" />
            <StorageView v-else-if="activeTab === 'storage'" />
            <SearchReportView v-else-if="activeTab === 'search'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AnalyticsView from './viewer/AnalyticsView.vue'
import StorageView from './storage/StorageView.vue'
import SearchReportView from './search-report/SearchReportView.vue'

interface Tab {
    id: string
    label: string
    icon: string
}

const tabs: Tab[] = [
    { id: 'analytics', label: 'Analytics', icon: 'mdi:chart-line' },
    { id: 'storage', label: 'Storage', icon: 'mdi:database' },
    { id: 'search', label: 'Search Report', icon: 'mdi:magnify' }
]

const route = useRoute()
const router = useRouter()

const getInitialTab = (): string => {
    const urlTab = route.query.dtab as string
    const validTabs = tabs.map(t => t.id)
    return validTabs.includes(urlTab) ? urlTab : 'analytics'
}

const activeTab = ref(getInitialTab())

watch(activeTab, (newTab) => {
    router.replace({
        query: {
            ...route.query,
            dtab: newTab
        }
    })
})
</script>

<style scoped>
@import "./styles/tabs.css";
</style>
