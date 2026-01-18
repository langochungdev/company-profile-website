<!-- Chức năng: Wrapper overlay cho mỗi section trong Live Edit mode -->
<template>
    <div class="edit-overlay-wrapper" :class="{
        'is-editable': editable,
        'is-hidden': !visible,
        'is-hovered': isHovered
    }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <div v-if="editable" class="section-toolbar">
            <div class="toolbar-left">
                <span class="section-label">{{ label }}</span>
            </div>
            <div class="toolbar-right">
                <button class="btn-visibility" :title="visible ? 'Ẩn section' : 'Hiện section'" @click="$emit('toggleVisible')">
                    <Icon :name="visible ? 'mdi:eye' : 'mdi:eye-off'" />
                </button>
            </div>
        </div>

        <div class="section-content" :class="{ 'content-hidden': !visible }">
            <slot />
        </div>

        <div v-if="editable && isHovered" class="edit-hint">
            <Icon name="mdi:cursor-pointer" />
            <span>Click vào element để chỉnh sửa</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
    label: string
    editable?: boolean
    visible?: boolean
}>()

defineEmits<{
    toggleVisible: []
}>()

const isHovered = ref(false)
</script>

<style scoped>
@import "../../styles/components/views/edit-overlay/desktop.css";
</style>
