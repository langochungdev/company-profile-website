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
.edit-overlay-wrapper {
    position: relative;
}

.edit-overlay-wrapper.is-editable {
    outline: 2px dashed transparent;
    outline-offset: 4px;
    transition: outline-color 0.2s;
}

.edit-overlay-wrapper.is-editable.is-hovered {
    outline-color: rgba(59, 130, 246, 0.5);
}

.section-toolbar {
    position: absolute;
    top: -40px;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border-radius: 8px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.2s;
    pointer-events: none;
}

.edit-overlay-wrapper.is-hovered .section-toolbar {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.toolbar-left,
.toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-label {
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
}

.btn-visibility {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 6px;
    color: #e2e8f0;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-visibility:hover {
    background: rgba(255, 255, 255, 0.2);
}

.btn-visibility svg {
    width: 16px;
    height: 16px;
}

.section-content {
    transition: opacity 0.3s;
}

.section-content.content-hidden {
    opacity: 0.3;
    pointer-events: none;
}

.edit-hint {
    position: absolute;
    bottom: -32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #1e293b;
    border-radius: 6px;
    font-size: 12px;
    color: #94a3b8;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
}

.edit-overlay-wrapper.is-hovered .edit-hint {
    opacity: 1;
}

.edit-hint svg {
    width: 14px;
    height: 14px;
    color: #60a5fa;
}

.is-hidden .section-content {
    position: relative;
}

.is-hidden .section-content::after {
    content: 'Section đang ẩn';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    font-size: 14px;
    color: #ffffff;
}
</style>
