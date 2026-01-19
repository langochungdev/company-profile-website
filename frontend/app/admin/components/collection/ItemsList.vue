<!-- Chức năng: Hiển thị danh sách items cho collection pages -->
<template>
    <div class="items-list">
        <div class="items-header">
            <div class="items-info">
                <span class="items-count">{{ items.length }} {{ itemConfig.name }}</span>
            </div>
            <button class="add-btn" @click="$emit('add')">
                <Icon name="mdi:plus" />
                <span>Thêm</span>
            </button>
        </div>

        <div v-if="items.length === 0" class="items-empty">
            <Icon :name="itemConfig.icon" class="empty-icon" />
            <p>Chưa có {{ itemConfig.name }} nào</p>
            <button class="add-first-btn" @click="$emit('add')">
                <Icon name="mdi:plus" />
                <span>Thêm {{ itemConfig.name }} đầu tiên</span>
            </button>
        </div>

        <div v-else class="items-table-wrapper">
            <table class="items-table">
                <thead>
                    <tr>
                        <th v-for="col in columns" :key="col.key" :style="col.width ? { width: col.width + 'px' } : {}">
                            {{ col.label }}
                        </th>
                        <th class="actions-col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in items" :key="getItemId(item, index)" class="item-row" @click="$emit('edit', item)">
                        <td v-for="col in columns" :key="col.key" :data-label="col.label">
                            <img v-if="col.type === 'image'" :src="String(getItemValue(item, col.key) || '')" class="item-image" />
                            <span v-else-if="col.type === 'badge'" class="item-badge">{{ getItemValue(item, col.key) }}</span>
                            <span v-else-if="col.type === 'currency'" class="item-price">{{ formatPrice(getItemValue(item, col.key)) }}</span>
                            <span v-else class="item-text">{{ getItemValue(item, col.key) }}</span>
                        </td>
                        <td class="actions-cell">
                            <button class="action-btn edit-btn" @click.stop="$emit('edit', item)" title="Sửa">
                                <Icon name="mdi:pencil" />
                            </button>
                            <button class="action-btn delete-btn" @click.stop="$emit('delete', item)" title="Xóa">
                                <Icon name="mdi:delete" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '../../config/page.config'

interface ItemConfig {
    name: string
    namePlural: string
    icon: string
}

defineProps<{
    items: Record<string, unknown>[]
    columns: TableColumn[]
    itemConfig: ItemConfig
}>()

defineEmits<{
    add: []
    edit: [item: Record<string, unknown>]
    delete: [item: Record<string, unknown>]
}>()

const getItemId = (item: Record<string, unknown>, index: number) => {
    return (item.id as string) || `item-${index}`
}

const getItemValue = (item: Record<string, unknown>, key: string) => {
    return item[key] ?? ''
}

const formatPrice = (value: unknown) => {
    if (!value) return 'Liên hệ'
    const num = Number(value)
    if (isNaN(num)) return String(value)
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
}
</script>

<style scoped>
@import "../../styles/components/collection/items-list/desktop.css";
@import "../../styles/components/collection/items-list/mobile.css";
</style>
