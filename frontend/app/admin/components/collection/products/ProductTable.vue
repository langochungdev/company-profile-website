<!-- Chức năng: Hiển thị danh sách sản phẩm dạng grid card
     DB Structure:
     - Items (collections/products/items): { images: [{ url, alt, width, height }], ... }
     - Previews (collections/products/previews): { image: { url, alt, width, height }, ... }
-->
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
            <div v-if="items.length === 0" class="empty-state">
                <Icon name="mdi:package-variant-closed" />
                <p>Chưa có sản phẩm nào</p>
                <button @click="$emit('add')" class="btn-empty">
                    Thêm sản phẩm đầu tiên
                </button>
            </div>

            <div v-else class="product-grid">
                <div v-for="product in items" :key="product.id" class="product-card">
                    <div class="card-image-wrapper">
                        <img v-if="getProductImage(product)" :src="getProductImage(product)" :alt="getProductImageAlt(product)" class="product-img" />
                        <div v-else class="thumbnail-placeholder">
                            <Icon name="mdi:image-off" />
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="card-header">
                            <span v-if="product.category" class="badge badge-primary">
                                {{ product.category }}
                            </span>
                            <strong class="product-name">{{ product.name }}</strong>
                        </div>

                        <span v-if="product.slug" class="product-slug">/{{ product.slug }}</span>

                        <div v-if="product.tags?.length > 0" class="tags-container">
                            <span v-for="(tag, idx) in getDisplayTags(product.tags).slice(0, 3)" :key="idx" class="tag">
                                {{ tag }}
                            </span>
                            <span v-if="product.tags.length > 3" class="tag-more">
                                +{{ product.tags.length - 3 }}
                            </span>
                        </div>

                        <div v-if="product.description" class="description-preview">
                            <div class="richtext-content" v-html="stripHtmlTags(product.description, 100)"></div>
                        </div>

                        <div class="card-footer">
                            <span v-if="product.price > 0" class="product-price">
                                {{ formatCurrency(product.price) }}
                            </span>
                            <span v-else class="text-muted">Liên hệ</span>

                            <div class="action-buttons">
                                <button @click="$emit('edit', product)" class="btn-action btn-edit" title="Chỉnh sửa">
                                    <Icon name="mdi:pencil" />
                                </button>
                                <button @click="$emit('delete', product)" class="btn-action btn-delete" title="Xóa">
                                    <Icon name="mdi:delete" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

function stripHtmlTags(html: string, maxLength: number = 100): string {
    if (!html) return ''
    const text = html.replace(/<[^>]*>/g, '')
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function getProductImage(product: any): string {
    if (product.image?.url) return product.image.url
    if (product.images?.[0]?.url) return product.images[0].url
    return ''
}

function getProductImageAlt(product: any): string {
    if (product.image?.alt) return product.image.alt
    if (product.images?.[0]?.alt) return product.images[0].alt
    return product.name || ''
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
    padding: 24px;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.product-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
}

.card-image-wrapper {
    position: relative;
    padding-top: 75%;
    background: #f8fafc;
    overflow: hidden;
}

.product-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 90%;
    object-fit: contain;
}

.thumbnail-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    color: #9ca3af;
    font-size: 32px;
}

.card-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.product-name {
    font-weight: 600;
    color: #111827;
    font-size: 15px;
    line-height: 1.4;
}

.product-slug {
    font-size: 12px;
    color: #6b7280;
}

.badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    align-self: flex-start;
}

.badge-primary {
    background: #dbeafe;
    color: #1e40af;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.tag {
    padding: 3px 8px;
    background: #f3f4f6;
    border-radius: 4px;
    font-size: 11px;
    color: #4b5563;
}

.tag-more {
    padding: 3px 8px;
    background: #e5e7eb;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
}

.description-preview {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
    flex: 1;
}

.description-preview .richtext-content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
    margin-top: auto;
}

.product-price {
    font-weight: 600;
    color: #059669;
    font-size: 14px;
}

.text-muted {
    color: #9ca3af;
    font-style: italic;
    font-size: 13px;
}

.action-buttons {
    display: flex;
    gap: 6px;
}

.btn-action {
    padding: 6px;
    background: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-action:hover {
    transform: scale(1.1);
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
    padding: 60px 20px;
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
