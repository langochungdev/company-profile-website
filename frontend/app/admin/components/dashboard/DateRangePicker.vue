<template>
    <div class="date-range-picker-wrapper">
        <div class="date-input-group">
            <label>Từ ngày</label>
            <input type="date" :value="startDate" @change="handleStartChange" class="date-input" />
        </div>
        <div class="date-input-group">
            <label>Đến ngày</label>
            <input type="date" :value="endDate" @change="handleEndChange" class="date-input" />
        </div>
        <button @click="apply" class="apply-button">
            <Icon name="mdi:check" />
            Áp dụng
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    startDate: string
    endDate: string
}>()

const emit = defineEmits<{
    change: [{ startDate: string; endDate: string }]
}>()

const localStart = ref(props.startDate)
const localEnd = ref(props.endDate)

const handleStartChange = (e: Event) => {
    localStart.value = (e.target as HTMLInputElement).value
}

const handleEndChange = (e: Event) => {
    localEnd.value = (e.target as HTMLInputElement).value
}

const apply = () => {
    emit('change', { startDate: localStart.value, endDate: localEnd.value })
}

watch(() => props.startDate, (val) => { localStart.value = val })
watch(() => props.endDate, (val) => { localEnd.value = val })
</script>

<style scoped>
@import "./styles/date-range-picker.css";
</style>
