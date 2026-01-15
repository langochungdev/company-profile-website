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
@import "../styles/admin-array-field/desktop.css";
</style>
