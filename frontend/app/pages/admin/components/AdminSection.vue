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
@import "../styles/admin-section/desktop.css";
</style>
