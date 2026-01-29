<template>
    <div class="dashboard-tabs-wrapper">
        <div class="tabs-header">
            <button v-for="tab in visibleTabs" :key="tab.id" :class="['tab-button', { active: activeTab === tab.id }]" @click="activeTab = tab.id">
                <Icon :name="tab.icon" />
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <div class="tab-content">
            <AnalyticsView v-if="activeTab === 'analytics'" />
            <StorageView v-else-if="activeTab === 'storage'" />
            <SearchReportView v-else-if="activeTab === 'search'" />
            <UsersView v-else-if="activeTab === 'users'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AnalyticsView from './viewer/AnalyticsView.vue'
import StorageView from './storage/StorageView.vue'
import SearchReportView from './search-report/SearchReportView.vue'
import UsersView from './users/UsersView.vue'
import { useAuth } from '@/admin/composables/useAuth'

interface Tab {
    id: string
    label: string
    icon: string
    superadminOnly?: boolean
}

const { isSuperAdmin } = useAuth()

const tabs: Tab[] = [
    { id: 'analytics', label: 'Analytics', icon: 'mdi:chart-line' },
    { id: 'storage', label: 'Storage', icon: 'mdi:database' },
    { id: 'search', label: 'Search Report', icon: 'mdi:magnify' },
    { id: 'users', label: 'Quản lý Users', icon: 'mdi:account-group', superadminOnly: true }
]

const visibleTabs = computed(() => {
    return tabs.filter((tab) => !tab.superadminOnly || isSuperAdmin.value)
})

const route = useRoute()
const router = useRouter()

const getInitialTab = (): string => {
    const urlTab = route.query.dtab as string
    const validTabs = visibleTabs.value.map((t) => t.id)
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
