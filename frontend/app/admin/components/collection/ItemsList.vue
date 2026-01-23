<!-- Chức năng: Hiển thị danh sách preview items với full fields support -->
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
                            <img v-if="col.type === 'image'" :src="getImageSrc(getItemValue(item, col.key))" class="item-image" />
                            <span v-else-if="col.type === 'badge'" class="item-badge">{{ getItemValue(item, col.key) }}</span>
                            <div v-else-if="col.type === 'tags'" class="item-tags">
                                <span v-for="(tag, idx) in getTagsArray(item, col.key)" :key="idx" class="tag-badge">{{ tag }}</span>
                                <span v-if="hasMoreTags(item, col.key)" class="tag-more">+{{ getMoreTagsCount(item, col.key) }}</span>
                            </div>
                            <span v-else-if="col.type === 'currency'" class="item-price">{{ formatPrice(getItemValue(item, col.key)) }}</span>
                            <span v-else-if="col.type === 'text-truncate'" class="item-text-truncate" :title="String(getItemValue(item, col.key))">{{ truncateText(getItemValue(item, col.key), 80) }}</span>
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
import { getImageSrc } from '@/admin/utils/imageHelper'

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
    const value = item[key]
    if (Array.isArray(value) && value.length > 0) {
        const firstItem = value[0]
        if (firstItem && typeof firstItem === 'object' && 'url' in firstItem) {
            return (firstItem as { url: string }).url
        }
    }
    return value ?? ''
}

const getTagsArray = (item: Record<string, unknown>, key: string): string[] => {
    const value = item[key]
    if (Array.isArray(value)) {
        return value.slice(0, 3).map((tag) => {
            if (typeof tag === 'string') return tag
            if (typeof tag === 'object' && tag !== null) {
                if ('value' in tag) return String((tag as { value: string }).value)
                if ('name' in tag) return String((tag as { name: string }).name)
            }
            return String(tag)
        })
    }
    return []
}

const hasMoreTags = (item: Record<string, unknown>, key: string): boolean => {
    const value = item[key]
    return Array.isArray(value) && value.length > 3
}

const getMoreTagsCount = (item: Record<string, unknown>, key: string): number => {
    const value = item[key]
    return Array.isArray(value) ? value.length - 3 : 0
}

const truncateText = (value: unknown, maxLength: number): string => {
    const text = String(value || '')
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

const formatPrice = (value: unknown) => {
    if (!value) return 'Liên hệ'
    const num = Number(value)
    if (isNaN(num)) return String(value)
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
}
</script>

<style scoped>
@import "../../styles/components/collection/items-list.css";
</style>
