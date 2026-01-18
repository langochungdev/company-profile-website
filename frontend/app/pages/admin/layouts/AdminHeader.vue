<!-- Chức năng: Header với breadcrumb, tabs và nút Save global cho admin panel -->
<template>
    <header class="admin-header">
        <div class="breadcrumb">
            <span class="breadcrumb-item">Admin</span>
            <Icon name="mdi:chevron-right" class="breadcrumb-sep" />
            <span class="breadcrumb-item active">{{ pageName }}</span>
        </div>

        <div v-if="tabs?.length" class="header-tabs">
            <button v-for="tab in tabs" :key="tab.key" :class="['header-tab', { active: activeTab === tab.key }]" @click="$emit('tab-change', tab.key)">
                <Icon :name="tab.icon" />
                <span>{{ tab.label }}</span>
                <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
            </button>
        </div>

        <div class="header-actions">
            <button v-if="showSaveButton" :class="['save-btn', { 'has-changes': hasChanges, disabled: isSaving }]" :disabled="!hasChanges || isSaving" @click="$emit('save')">
                <Icon :name="isSaving ? 'mdi:loading' : 'mdi:content-save'" :class="{ spin: isSaving }" />
                <span>{{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
            </button>
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
.admin-header {
    height: 64px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    position: sticky;
    top: 0;
    z-index: 50;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
}

.breadcrumb-item {
    font-size: 14px;
    color: #6b7280;
}

.breadcrumb-item.active {
    color: #111827;
    font-weight: 600;
}

.breadcrumb-sep {
    width: 16px;
    height: 16px;
    color: #9ca3af;
}

.header-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f3f4f6;
    padding: 4px;
    border-radius: 10px;
}

.header-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: transparent;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;
}

.header-tab:hover {
    background: #e5e7eb;
    color: #374151;
}

.header-tab.active {
    background: #ffffff;
    color: #111827;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-tab svg {
    width: 16px;
    height: 16px;
}

.header-tab .tab-count {
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
}

.header-tab.active .tab-count {
    background: #3b82f6;
    color: #ffffff;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.save-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: #e2e8f0;
    color: #64748b;
}

.save-btn:not(.disabled):hover {
    background: #cbd5e1;
}

.save-btn.has-changes {
    background: #3b82f6;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.save-btn.has-changes:hover {
    background: #2563eb;
}

.save-btn.disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

.save-btn svg {
    width: 18px;
    height: 18px;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .admin-header {
        padding: 0 12px;
        gap: 8px;
    }

    .breadcrumb {
        display: none;
    }

    .header-tabs {
        flex: 1;
        justify-content: center;
    }

    .header-tab span:not(.tab-count) {
        display: none;
    }

    .header-tab {
        padding: 8px 12px;
    }

    .save-btn span {
        display: none;
    }

    .save-btn {
        padding: 10px;
    }
}
</style>
