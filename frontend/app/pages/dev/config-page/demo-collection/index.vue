<template>
    <div class="collection-demo-wrapper">
        <div class="header">
            <div class="container">
                <h1>📦 Collection Demo - Items List</h1>
                <p class="subtitle">Test collection-based config and CRUD operations</p>
            </div>
        </div>

        <div v-if="loading" class="loading-section">
            <div class="container">
                <p>Loading items...</p>
            </div>
        </div>

        <div v-else-if="error" class="error-section">
            <div class="container">
                <p>Error: {{ error.message }}</p>
            </div>
        </div>

        <div v-else-if="items.length > 0" class="content-section">
            <div class="container">
                <div class="toolbar">
                    <div class="stats">
                        <span><strong>Total:</strong> {{ items.length }}</span>
                        <span><strong>Published:</strong> {{ publishedCount }}</span>
                        <span><strong>Featured:</strong> {{ featuredCount }}</span>
                    </div>
                    <NuxtLink to="/dev/config-page" class="edit-btn">
                        ✏️ Edit Collection
                    </NuxtLink>
                </div>

                <div v-if="items.length === 0" class="empty-state">
                    <h2>No items yet</h2>
                    <p>Use the config manager to add demo items</p>
                    <NuxtLink to="/dev/config-page" class="btn-primary">
                        Add Items
                    </NuxtLink>
                </div>

                <div v-else class="items-grid">
                    <NuxtLink v-for="item in sortedItems" :key="item.id" :to="`/dev/config-page/demo-collection/${item.slug || item.id}`" class="item-card">
                        <div v-if="item.featured" class="featured-badge">⭐ Featured</div>

                        <div class="item-thumbnail">
                            <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" />
                            <div v-else class="placeholder-image">
                                <Icon name="mdi:image-outline" />
                            </div>
                        </div>

                        <div class="item-content">
                            <div class="item-meta">
                                <span class="category" :data-category="item.category">
                                    {{ item.category }}
                                </span>
                                <span class="status" :data-status="item.status">
                                    {{ item.status }}
                                </span>
                            </div>

                            <h3 class="item-title">{{ item.title }}</h3>
                            <p class="item-description">{{ truncate(item.description, 120) }}</p>

                            <div v-if="item.tags && item.tags.length" class="tags">
                                <span v-for="(tag, index) in item.tags.slice(0, 3)" :key="index" class="tag">
                                    {{ tag.tag }}
                                </span>
                            </div>

                            <div class="item-footer">
                                <div v-if="item.author" class="author">
                                    <img v-if="item.author.avatar" :src="item.author.avatar" :alt="item.author.name" class="author-avatar" />
                                    <span>{{ item.author.name }}</span>
                                </div>
                                <span v-if="item.publishedAt" class="date">
                                    {{ formatDate(item.publishedAt) }}
                                </span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="debug-section">
            <div class="container">
                <h3>🔧 Debug Info</h3>
                <div class="debug-card">
                    <p><strong>Firestore Path:</strong> <code>{{ firestorePath }}</code></p>
                    <p><strong>Environment:</strong> {{ envInfo.siteName }}/{{ envInfo.environment }}</p>
                    <p><strong>Collection Type:</strong> Subcollection-based</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { demoListingConfig } from './demoListing.cms'
import { useDetailContext } from '@/composables/useDetailContext'
import { getFirestoreInfo, getFirestorePath } from '@/utils/firestore'

const envInfo = getFirestoreInfo()
const firestorePath = computed(() => getFirestorePath(demoListingConfig.path))

const { items, loading, error, loadItems, totalItems } = useDetailContext(demoListingConfig)

const publishedCount = computed(() =>
    items.value?.filter((item: any) => item.status === 'published').length || 0
)

const featuredCount = computed(() =>
    items.value?.filter((item: any) => item.featured).length || 0
)

const sortedItems = computed(() => {
    if (!items.value?.length) return []
    return [...items.value].sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0))
})

const truncate = (text: string, length: number) => {
    if (!text) return ''
    return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (date: string) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('vi-VN')
}

onMounted(() => {
    console.log('📦 Collection Demo Loading...')
    console.log('🔥 Firestore Path:', firestorePath.value)
    loadItems()
})
</script>

<style scoped>
.collection-demo-wrapper {
    min-height: 100vh;
    background: #f9fafb;
}

.header {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    padding: 3rem 2rem;
    text-align: center;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 1.125rem;
    opacity: 0.9;
}

.loading-section,
.error-section {
    padding: 4rem 2rem;
    text-align: center;
}

.error-section {
    color: #dc2626;
}

.content-section {
    padding: 3rem 2rem;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.stats {
    display: flex;
    gap: 2rem;
    font-size: 0.875rem;
}

.stats span {
    color: #6b7280;
}

.edit-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #f59e0b;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.2s;
}

.edit-btn:hover {
    background: #d97706;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
}

.empty-state h2 {
    color: #6b7280;
    margin-bottom: 1rem;
}

.btn-primary {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

.item-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
    color: inherit;
    position: relative;
}

.item-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.featured-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #f59e0b;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 10;
}

.item-thumbnail {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #e5e7eb;
}

.item-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.placeholder-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #9ca3af;
    font-size: 3rem;
}

.item-content {
    padding: 1.5rem;
}

.item-meta {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.category,
.status {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-weight: 600;
}

.category[data-category="tech"] {
    background: #dbeafe;
    color: #1e40af;
}

.category[data-category="design"] {
    background: #fce7f3;
    color: #9f1239;
}

.category[data-category="marketing"] {
    background: #fef3c7;
    color: #92400e;
}

.category[data-category="development"] {
    background: #d1fae5;
    color: #065f46;
}

.status[data-status="published"] {
    background: #d1fae5;
    color: #065f46;
}

.status[data-status="draft"] {
    background: #e5e7eb;
    color: #4b5563;
}

.status[data-status="archived"] {
    background: #fee2e2;
    color: #991b1b;
}

.item-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1f2937;
}

.item-description {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.tag {
    font-size: 0.75rem;
    background: #f3f4f6;
    color: #4b5563;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
}

.item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

.author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

.date {
    font-size: 0.75rem;
    color: #9ca3af;
}

.debug-section {
    padding: 2rem;
    background: #f3f4f6;
}

.debug-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #f59e0b;
}

.debug-card p {
    margin: 0.5rem 0;
    color: #374151;
}

.debug-card code {
    background: #e5e7eb;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .header h1 {
        font-size: 1.75rem;
    }

    .items-grid {
        grid-template-columns: 1fr;
    }

    .toolbar {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
