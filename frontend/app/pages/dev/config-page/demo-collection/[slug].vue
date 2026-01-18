<template>
    <div class="item-detail-wrapper">
        <div v-if="loading" class="loading">
            <p>Loading item...</p>
        </div>

        <div v-else-if="error" class="error">
            <p>Error: {{ error.message }}</p>
            <NuxtLink to="/dev/config-page/demo-collection" class="back-btn">
                ← Back to List
            </NuxtLink>
        </div>

        <div v-else-if="!item" class="not-found">
            <h2>Item Not Found</h2>
            <p>The item you're looking for doesn't exist.</p>
            <NuxtLink to="/dev/config-page/demo-collection" class="back-btn">
                ← Back to List
            </NuxtLink>
        </div>

        <div v-else class="item-detail">
            <div class="header">
                <div class="container">
                    <NuxtLink to="/dev/config-page/demo-collection" class="back-link">
                        ← Back to Collection
                    </NuxtLink>
                </div>
            </div>

            <div class="content">
                <div class="container">
                    <div class="item-header">
                        <div class="meta-badges">
                            <span v-if="item.featured" class="badge featured">⭐ Featured</span>
                            <span class="badge category" :data-category="item.category">{{ item.category }}</span>
                            <span class="badge status" :data-status="item.status">{{ item.status }}</span>
                        </div>

                        <h1 class="title">{{ item.title }}</h1>
                        <p v-if="item.description" class="description">{{ item.description }}</p>

                        <div class="item-meta">
                            <div v-if="item.author" class="author-info">
                                <img v-if="item.author.avatar" :src="item.author.avatar" :alt="item.author.name" class="author-avatar" />
                                <div>
                                    <div class="author-name">{{ item.author.name }}</div>
                                    <div v-if="item.author.bio" class="author-bio">{{ item.author.bio }}</div>
                                </div>
                            </div>
                            <div v-if="item.publishedAt" class="publish-date">
                                📅 {{ formatDate(item.publishedAt) }}
                            </div>
                        </div>
                    </div>

                    <div v-if="item.thumbnail" class="item-image">
                        <img :src="item.thumbnail" :alt="item.title" />
                    </div>

                    <div class="item-body">
                        <div v-if="item.tags && item.tags.length" class="tags-section">
                            <h3>Tags</h3>
                            <div class="tags">
                                <span v-for="(tag, index) in item.tags" :key="index" class="tag">
                                    {{ tag.tag }}
                                </span>
                            </div>
                        </div>

                        <div class="details-grid">
                            <div class="detail-item">
                                <strong>ID:</strong> {{ item.id }}
                            </div>
                            <div class="detail-item">
                                <strong>Slug:</strong> {{ item.slug || 'N/A' }}
                            </div>
                            <div class="detail-item">
                                <strong>Priority:</strong> {{ item.priority || 0 }}
                            </div>
                            <div class="detail-item">
                                <strong>Status:</strong> {{ item.status }}
                            </div>
                        </div>
                    </div>

                    <div class="actions">
                        <NuxtLink to="/dev/config-page" class="btn-edit">
                            ✏️ Edit in Config Manager
                        </NuxtLink>
                        <NuxtLink to="/dev/config-page/demo-collection" class="btn-secondary">
                            View All Items
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div class="debug-section">
                <div class="container">
                    <h3>🔧 Debug Info</h3>
                    <div class="debug-card">
                        <p><strong>Collection Path:</strong> <code>{{ firestorePath }}</code></p>
                        <p><strong>Item ID:</strong> {{ item?.id || 'N/A' }}</p>
                        <p><strong>Total Items:</strong> {{ totalItems }}</p>
                    </div>
                    <details class="debug-details">
                        <summary>View Raw Data</summary>
                        <pre>{{ JSON.stringify(item, null, 2) }}</pre>
                    </details>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { demoDetailConfig } from './demoDetail.cms'
import { useDetailContext } from '@/admin/composables/useDetailContext'
import { getFirestoreInfo, getFirestorePath } from '@/admin/utils/firestore'

const route = useRoute()
const envInfo = getFirestoreInfo()
const firestorePath = computed(() => getFirestorePath(demoDetailConfig.path))

const { items, loading, error, loadItems, totalItems } = useDetailContext(demoDetailConfig)

const item = computed(() => {
    if (!items.value?.length) return null
    const slug = route.params.slug
    return items.value.find((item: any) =>
        item.slug === slug || item.id === slug
    )
})

const formatDate = (date: string) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

onMounted(() => {
    console.log('📄 Item Detail Loading...')
    console.log('🔍 Slug:', route.params.slug)
    loadItems()
})
</script>

<style scoped>
.item-detail-wrapper {
    min-height: 100vh;
    background: #f9fafb;
}

.loading,
.error,
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
}

.error {
    color: #dc2626;
}

.back-btn {
    margin-top: 1rem;
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
}

.header {
    background: white;
    padding: 1.5rem 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.container {
    max-width: 900px;
    margin: 0 auto;
}

.back-link {
    color: #6b7280;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
}

.back-link:hover {
    color: #1f2937;
}

.content {
    padding: 3rem 2rem;
}

.item-header {
    margin-bottom: 2rem;
}

.meta-badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-weight: 600;
}

.badge.featured {
    background: #fef3c7;
    color: #92400e;
}

.badge.category[data-category="tech"] {
    background: #dbeafe;
    color: #1e40af;
}

.badge.category[data-category="design"] {
    background: #fce7f3;
    color: #9f1239;
}

.badge.category[data-category="marketing"] {
    background: #fef3c7;
    color: #92400e;
}

.badge.category[data-category="development"] {
    background: #d1fae5;
    color: #065f46;
}

.badge.status[data-status="published"] {
    background: #d1fae5;
    color: #065f46;
}

.badge.status[data-status="draft"] {
    background: #e5e7eb;
    color: #4b5563;
}

.badge.status[data-status="archived"] {
    background: #fee2e2;
    color: #991b1b;
}

.title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
}

.description {
    font-size: 1.125rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
}

.author-info {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.author-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}

.author-name {
    font-weight: 600;
    color: #1f2937;
}

.author-bio {
    font-size: 0.875rem;
    color: #6b7280;
}

.publish-date {
    font-size: 0.875rem;
    color: #6b7280;
}

.item-image {
    margin: 2rem 0;
    border-radius: 12px;
    overflow: hidden;
}

.item-image img {
    width: 100%;
    height: auto;
}

.item-body {
    margin: 2rem 0;
}

.tags-section {
    margin-bottom: 2rem;
}

.tags-section h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #1f2937;
}

.tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.tag {
    font-size: 0.875rem;
    background: #e5e7eb;
    color: #4b5563;
    padding: 0.5rem 1rem;
    border-radius: 999px;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.detail-item {
    font-size: 0.875rem;
    color: #6b7280;
}

.detail-item strong {
    color: #1f2937;
}

.actions {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.btn-edit,
.btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
}

.btn-edit {
    background: #f59e0b;
    color: white;
}

.btn-edit:hover {
    background: #d97706;
}

.btn-secondary {
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
    border-color: #d1d5db;
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
    margin-bottom: 1rem;
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

.debug-details {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
}

.debug-details summary {
    font-weight: 600;
    color: #1f2937;
}

.debug-details pre {
    margin-top: 1rem;
    background: #1f2937;
    color: #10b981;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.75rem;
}

@media (max-width: 768px) {
    .title {
        font-size: 1.75rem;
    }

    .item-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .actions {
        flex-direction: column;
    }

    .btn-edit,
    .btn-secondary {
        width: 100%;
        text-align: center;
    }
}
</style>
