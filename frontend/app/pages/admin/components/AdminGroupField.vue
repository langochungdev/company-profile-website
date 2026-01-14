<!-- Chức năng: Render group field container -->
<template>
    <div class="group-field">
        <div class="group-header">
            <Icon name="mdi:folder-outline" class="group-icon" />
            <span class="group-label">{{ field.label }}</span>
        </div>
        <div class="group-content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    field: { label: string }
}>()
</script>

<style scoped>
.group-field {
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    border-radius: 8px;
    margin: 12px 0;
    overflow: hidden;
}

.group-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
}

.group-icon {
    width: 18px;
    height: 18px;
    color: #3b82f6;
}

.group-label {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.group-content {
    padding: 16px;
}
</style>
