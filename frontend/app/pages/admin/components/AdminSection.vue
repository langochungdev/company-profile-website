<!-- Chức năng: Section collapsible cho editor -->
<template>
    <div class="admin-section">
        <button class="section-header" @click="$emit('toggle')">
            <div class="section-title">
                <Icon name="mdi:folder" class="section-icon" />
                <span>{{ label }}</span>
            </div>
            <Icon :name="isCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="chevron-icon" />
        </button>
        <div v-show="!isCollapsed" class="section-content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    isCollapsed: boolean
}>()

defineEmits<{
    toggle: []
}>()
</script>

<style scoped>
.admin-section {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
}

.section-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f9fafb;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

.section-header:hover {
    background: #f3f4f6;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.section-icon {
    width: 18px;
    height: 18px;
    color: #3b82f6;
}

.chevron-icon {
    width: 20px;
    height: 20px;
    color: #6b7280;
    transition: transform 0.2s;
}

.section-content {
    padding: 16px;
    background: #ffffff;
}
</style>
