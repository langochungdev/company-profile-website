<!-- Chức năng: Header với breadcrumb và nút Save cho admin panel -->
<template>
    <header class="admin-header">
        <div class="breadcrumb">
            <span class="breadcrumb-item">Admin</span>
            <Icon name="mdi:chevron-right" class="breadcrumb-sep" />
            <span class="breadcrumb-item active">{{ pageName }}</span>
        </div>

        <div class="header-actions">
            <button class="preview-btn">
                <Icon name="mdi:eye" />
                <span>Preview</span>
            </button>
            <button :class="['save-btn', { 'has-changes': hasChanges }]" @click="$emit('save')">
                <Icon name="mdi:content-save" />
                <span>Lưu thay đổi</span>
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
defineProps<{
    pageName: string
    hasChanges: boolean
}>()

defineEmits<{
    save: []
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

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.preview-btn,
.save-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.preview-btn {
    background: #e5e7eb;
    color: #374151;
}

.preview-btn:hover {
    background: #d1d5db;
}

.save-btn {
    background: #3b82f6;
    color: #ffffff;
}

.save-btn:hover {
    background: #2563eb;
}

.save-btn.has-changes {
    background: #10b981;
    animation: pulse-save 2s infinite;
}

.preview-btn svg,
.save-btn svg {
    width: 18px;
    height: 18px;
}

@keyframes pulse-save {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    }

    50% {
        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
    }
}

@media (max-width: 768px) {
    .admin-header {
        padding: 0 16px;
    }

    .preview-btn span,
    .save-btn span {
        display: none;
    }

    .preview-btn,
    .save-btn {
        padding: 10px;
    }
}
</style>
