<!-- Chức năng: Header với breadcrumb, tabs và nút Save global cho admin panel -->
<template>
    <header class="admin-header">
        <div class="header-left">
            <div class="breadcrumb">
                <span class="breadcrumb-item">
                    <Icon name="mdi:home" class="breadcrumb-icon" />
                </span>
                <Icon name="mdi:chevron-right" class="breadcrumb-sep" />
                <span class="breadcrumb-item active">{{ pageName }}</span>
            </div>
        </div>

        <div v-if="tabs?.length" class="header-tabs">
            <button v-for="tab in tabs" :key="tab.key" :class="['header-tab', { active: activeTab === tab.key }]" @click="$emit('tab-change', tab.key)">
                <Icon :name="tab.icon" />
                <span class="tab-label">{{ tab.label }}</span>
                <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
            </button>
        </div>

        <div class="header-right">
            <Transition name="fade">
                <button v-if="showSaveButton" :class="['save-btn', { 'has-changes': hasChanges, disabled: isSaving }]" :disabled="!hasChanges || isSaving" @click="$emit('save')">
                    <Icon :name="isSaving ? 'mdi:loading' : 'mdi:content-save'" :class="{ spin: isSaving }" />
                    <span class="save-text">{{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
                </button>
            </Transition>
        </div>
    </header>
</template>

<script setup lang="ts">
interface TabItem {
    key: string
    label: string
    icon: string
    count?: number
}

defineProps<{
    pageName: string
    hasChanges?: boolean
    isSaving?: boolean
    showSaveButton?: boolean
    tabs?: TabItem[]
    activeTab?: string
}>()

defineEmits<{
    save: []
    'tab-change': [key: string]
}>()
</script>

<style scoped>
@import "../../styles/components/layouts/admin-header/desktop.css";
@import "../../styles/components/layouts/admin-header/mobile.css";
</style>
