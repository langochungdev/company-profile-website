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
@import "../../styles/components/fields/group-field/desktop.css";
</style>
