<!-- Chức năng: Top bar cho Live Edit mode với Save/Discard/Status -->
<template>
    <div class="live-preview-bar">
        <div class="bar-left">
            <button class="btn-back" @click="$emit('back')">
                <Icon name="mdi:arrow-left" />
                <span>Quay lại</span>
            </button>
            <div class="page-info">
                <Icon :name="pageIcon" class="page-icon" />
                <span class="page-name">{{ pageName }}</span>
                <span v-if="isDirty" class="dirty-badge">Chưa lưu</span>
            </div>
        </div>

        <div class="bar-right">
            <button v-if="isDirty" class="btn-discard" :disabled="isSaving" @click="$emit('discard')">
                <Icon name="mdi:undo" />
                <span>Hủy thay đổi</span>
            </button>
            <button class="btn-save" :disabled="!isDirty || isSaving" @click="$emit('save')">
                <Icon v-if="isSaving" name="mdi:loading" class="spin" />
                <Icon v-else name="mdi:content-save" />
                <span>{{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    pageName: string
    pageIcon: string
    isDirty: boolean
    isSaving: boolean
}>()

defineEmits<{
    back: []
    save: []
    discard: []
}>()
</script>

<style scoped>
.live-preview-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.bar-left,
.bar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.btn-back {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #e2e8f0;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-back:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
}

.btn-back svg {
    width: 18px;
    height: 18px;
}

.page-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.page-icon {
    width: 24px;
    height: 24px;
    color: #60a5fa;
}

.page-name {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
}

.dirty-badge {
    padding: 4px 10px;
    background: #f59e0b;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #000000;
}

.btn-discard,
.btn-save {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-discard {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-discard:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
    color: #fca5a5;
}

.btn-save {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #ffffff;
}

.btn-save:hover:not(:disabled) {
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-save:disabled,
.btn-discard:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.btn-discard svg,
.btn-save svg {
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
    .live-preview-bar {
        padding: 10px 16px;
        flex-wrap: wrap;
        gap: 12px;
    }

    .btn-back span,
    .btn-discard span,
    .btn-save span {
        display: none;
    }

    .page-name {
        font-size: 14px;
    }
}
</style>
