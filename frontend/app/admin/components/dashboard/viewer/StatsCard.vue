<template>
    <div class="stats-card-wrapper">
        <div class="stats-card-icon">
            <Icon :name="icon" />
        </div>
        <div class="stats-card-content">
            <div class="stats-card-label">{{ label }}</div>
            <div class="stats-card-value">{{ formattedValue }}</div>
            <div v-if="subtitle" class="stats-card-subtitle">{{ subtitle }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string
    value: number | string
    icon: string
    subtitle?: string
}>()

const formattedValue = computed(() => {
    if (typeof props.value === 'number') {
        return props.value.toLocaleString('vi-VN')
    }
    return props.value
})
</script>

<style scoped>
@import "../styles/stats-card.css";
</style>
