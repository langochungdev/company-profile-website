<template>
    <div class="product-table-wrapper">
        <div class="table-header">
            <h3>{{ items.length }} sản phẩm</h3>
            <div class="header-actions">
                <button @click="$emit('manage-categories')" class="btn-secondary">
                    <Icon name="mdi:cog" />
                    Danh mục
                </button>
                <button @click="$emit('manage-tags')" class="btn-secondary">
                    <Icon name="mdi:tag-multiple" />
                    Tags
                </button>
                <button @click="$emit('add')" class="btn-add">
                    <Icon name="mdi:plus" />
                    Thêm sản phẩm
                </button>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 60px"></th>
                        <th>Tên sản phẩm</th>
                        <th style="width: 150px">Danh mục</th>
                        <th style="width: 120px">Giá</th>
                        <th style="width: 200px">Tags</th>
                        <th>Mô tả</th>
                        <th style="width: 120px">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="items.length === 0">
                        <td colspan="7" class="empty-state">
                            <Icon name="mdi:package-variant-closed" />
                            <p>Chưa có sản phẩm nào</p>
                            <button @click="$emit('add')" class="btn-empty">
                                Thêm sản phẩm đầu tiên
                            </button>
                        </td>
                    </tr>
                    <tr v-for="product in items" :key="product.id" class="table-row">
                        <td>
                            <img v-if="product.images?.[0]?.url" :src="product.images[0].url" :alt="product.images[0].alt || product.name" class="product-thumbnail" />
                            <div v-else class="thumbnail-placeholder">
                                <Icon name="mdi:image-off" />
                            </div>
                        </td>

                        <td>
                            <strong class="product-name">{{ product.name }}</strong>
                            <span v-if="product.slug" class="product-slug">/{{ product.slug }}</span>
                        </td>

                        <td>
                            <span v-if="product.category" class="badge badge-primary">
                                {{ product.category }}
                            </span>
                        </td>

                        <td class="text-right">
                            <span v-if="product.price > 0" class="product-price">
                                {{ formatCurrency(product.price) }}
                            </span>
                            <span v-else class="text-muted">Liên hệ</span>
                        </td>

                        <td>
                            <div v-if="product.tags?.length > 0" class="tags-container">
                                <span v-for="(tag, idx) in getDisplayTags(product.tags).slice(0, 3)" :key="idx" class="tag">
                                    {{ tag }}
                                </span>
                                <span v-if="product.tags.length > 3" class="tag-more">
                                    +{{ product.tags.length - 3 }}
                                </span>
                            </div>
                        </td>

                        <td>
                            <p v-if="product.description" class="text-truncate">
                                {{ truncate(product.description, 100) }}
                            </p>
                        </td>

                        <td>
                            <div class="action-buttons">
                                <button @click="$emit('edit', product)" class="btn-action btn-edit" title="Chỉnh sửa">
                                    <Icon name="mdi:pencil" />
                                </button>
                                <button @click="$emit('delete', product)" class="btn-action btn-delete" title="Xóa">
                                    <Icon name="mdi:delete" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    items: any[]
}>()

defineEmits<{
    add: []
    edit: [product: any]
    delete: [product: any]
    'manage-categories': []
    'manage-tags': []
}>()

function formatCurrency(value: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value)
}

function truncate(text: string, maxLength: number) {
    if (!text) return ''
    return text.length > maxLength
        ? text.slice(0, maxLength) + '...'
        : text
}

function getDisplayTags(tags: any[]): string[] {
    if (!tags) return []
    return tags.map(tag => {
        if (typeof tag === 'string') return tag
        if (typeof tag === 'object' && tag !== null && 'value' in tag) return tag.value
        if (typeof tag === 'object' && tag !== null && 'name' in tag) return tag.name
        return String(tag)
    })
}
</script>

<style scoped>
.product-table-wrapper {
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
}

.table-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-secondary {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: #f9fafb;
    border-color: #9ca3af;
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: #2563eb;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-add:hover {
    background: #1d4ed8;
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background: #f9fafb;
}

th {
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

tbody tr {
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.2s;
}

tbody tr:hover {
    background: #f9fafb;
}

td {
    padding: 16px;
    font-size: 14px;
    color: #374151;
}

.product-thumbnail {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 6px;
}

.thumbnail-placeholder {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 6px;
    color: #9ca3af;
}

.product-name {
    display: block;
    font-weight: 500;
    color: #111827;
}

.product-slug {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
}

.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.badge-primary {
    background: #dbeafe;
    color: #1e40af;
}

.product-price {
    font-weight: 500;
    color: #059669;
}

.text-right {
    text-align: right;
}

.text-muted {
    color: #9ca3af;
    font-style: italic;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.tag {
    padding: 4px 8px;
    background: #f3f4f6;
    border-radius: 4px;
    font-size: 11px;
    color: #4b5563;
}

.tag-more {
    padding: 4px 8px;
    background: #e5e7eb;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
}

.text-truncate {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.btn-action {
    padding: 6px;
    background: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
}

.btn-edit:hover {
    background: #dbeafe;
    border-color: #3b82f6;
    color: #2563eb;
}

.btn-delete:hover {
    background: #fee2e2;
    border-color: #f87171;
    color: #dc2626;
}

.empty-state {
    text-align: center;
    padding: 60px 20px !important;
}

.empty-state svg {
    font-size: 48px;
    color: #d1d5db;
    margin-bottom: 16px;
}

.empty-state p {
    margin: 0 0 16px;
    color: #6b7280;
    font-size: 16px;
}

.btn-empty {
    padding: 10px 20px;
    background: #2563eb;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-empty:hover {
    background: #1d4ed8;
}
</style>
