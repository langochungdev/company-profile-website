<!-- Chức năng: Render array field với add/remove/sort -->
<template>
    <div class="array-field">
        <div class="array-header">
            <span class="array-label">{{ field.label }}</span>
            <span v-if="field.min || field.max" class="array-count">
                {{ items.length }}/{{ field.max || '∞' }} items
            </span>
        </div>

        <div v-if="items.length === 0" class="array-empty">
            <Icon name="mdi:playlist-plus" class="empty-icon" />
            <p>Chưa có items. Nhấn Add để thêm mới.</p>
        </div>

        <div v-else class="array-items">
            <div v-for="(item, index) in items" :key="index" class="array-item">
                <div class="item-header">
                    <div class="item-drag">
                        <Icon name="mdi:drag-vertical" class="drag-icon" />
                        <span class="item-index">Item {{ index + 1 }}</span>
                    </div>
                    <button class="item-remove" @click="removeItem(index)">
                        <Icon name="mdi:close" />
                        <span>Xóa</span>
                    </button>
                </div>
                <div class="item-fields">
                    <AdminField v-for="(subField, subKey) in field.schema" :key="subKey" :field="(subField as any)" :model-value="item[subKey]" @update:model-value="updateItemField(index, subKey as string, $event)" />
                </div>
            </div>
        </div>

        <button v-if="!field.max || items.length < field.max" class="add-item-btn" @click="addItem">
            <Icon name="mdi:plus" />
            <span>Thêm item</span>
        </button>

        <p v-if="field.note" class="field-note">{{ field.note }}</p>
    </div>
</template>

<script setup lang="ts">
import AdminField from './AdminField.vue'

interface ArrayFieldConfig {
    type: string
    label: string
    min?: number
    max?: number
    sortable?: boolean
    note?: string
    schema: Record<string, unknown>
}

const props = defineProps<{
    field: ArrayFieldConfig
    modelValue: Array<Record<string, unknown>>
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: Array<Record<string, unknown>>): void
}>()

const items = computed(() => props.modelValue || [])

const addItem = () => {
    const newItem: Record<string, unknown> = {}
    for (const [key, fieldConfig] of Object.entries(props.field.schema)) {
        const config = fieldConfig as { default?: unknown }
        newItem[key] = config.default ?? ''
    }
    emit('update:modelValue', [...items.value, newItem])
}

const removeItem = (index: number) => {
    const newItems = [...items.value]
    newItems.splice(index, 1)
    emit('update:modelValue', newItems)
}

const updateItemField = (index: number, key: string, value: unknown) => {
    const newItems = [...items.value]
    newItems[index] = { ...newItems[index], [key]: value }
    emit('update:modelValue', newItems)
}
</script>

<style scoped>
.array-field {
    margin-bottom: 20px;
}

.array-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.array-label {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.array-count {
    font-size: 12px;
    color: #6b7280;
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 4px;
}

.array-empty {
    padding: 32px;
    text-align: center;
    background: #f9fafb;
    border: 2px dashed #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
}

.empty-icon {
    width: 40px;
    height: 40px;
    color: #9ca3af;
    margin-bottom: 8px;
}

.array-empty p {
    color: #6b7280;
    font-size: 14px;
}

.array-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
}

.array-item {
    border: 1px dashed #d1d5db;
    border-radius: 8px;
    padding: 12px;
    background: #fafafa;
    transition: background 0.2s;
}

.array-item:hover {
    background: #f5f5f5;
}

.item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
}

.item-drag {
    display: flex;
    align-items: center;
    gap: 8px;
}

.drag-icon {
    width: 20px;
    height: 20px;
    color: #9ca3af;
    cursor: move;
}

.item-index {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
}

.item-remove {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: #fee2e2;
    color: #dc2626;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.item-remove:hover {
    background: #fecaca;
}

.item-remove svg {
    width: 14px;
    height: 14px;
}

.item-fields {
    display: flex;
    flex-direction: column;
}

.add-item-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    background: #eff6ff;
    color: #3b82f6;
    border: 2px dashed #3b82f6;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.add-item-btn:hover {
    background: #dbeafe;
}

.add-item-btn svg {
    width: 18px;
    height: 18px;
}

.field-note {
    font-size: 12px;
    color: #6b7280;
    margin-top: 8px;
}
</style>
