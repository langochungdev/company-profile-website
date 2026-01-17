<template>
    <div class="demo-page-wrapper">
        <div v-if="loading" class="loading">
            <p>Loading demo page...</p>
        </div>

        <div v-else-if="error" class="error">
            <p>Error: {{ error.message }}</p>
        </div>

        <div v-else-if="data" class="demo-content">
            <section v-if="data.settings?.showHero && data.hero" class="hero-section" :data-theme="data.settings?.theme || 'blue'">
                <div class="container">
                    <h1 class="hero-title">{{ data.hero.title }}</h1>
                    <p v-if="data.hero.subtitle" class="hero-subtitle">{{ data.hero.subtitle }}</p>
                    <img v-if="data.hero.heroImage" :src="data.hero.heroImage" alt="Hero image" class="hero-image" />
                </div>
            </section>

            <section v-if="data.settings?.showFeatures && data.features" class="features-section">
                <div class="container">
                    <h2 class="section-title">{{ data.features.sectionTitle }}</h2>
                    <div class="features-grid">
                        <div v-for="(feature, index) in data.features.items?.slice(0, data.settings?.maxItems || 3)" :key="index" class="feature-card">
                            <Icon v-if="feature.icon" :name="feature.icon" class="feature-icon" />
                            <h3 class="feature-title">{{ feature.title }}</h3>
                            <p class="feature-description">{{ feature.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="debug-section">
                <div class="container">
                    <h3>🔧 Debug Info</h3>
                    <div class="debug-card">
                        <p><strong>Firestore Path:</strong> <code>{{ firestorePath }}</code></p>
                        <p><strong>Environment:</strong> {{ envInfo.siteName }}/{{ envInfo.environment }}</p>
                        <p><strong>Sections Loaded:</strong> {{ Object.keys(data).length }}</p>
                        <NuxtLink to="/dev/config-page" class="edit-btn">
                            ✏️ Edit in Config Manager
                        </NuxtLink>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { demoConfig } from './demo.config'
import { usePageContent } from '@/composables/usePageContent'
import { getFirestoreInfo, getFirestorePath } from '@/utils/firestore'
import type { PageConfig } from '@/pages/admin/page.config'

const envInfo = getFirestoreInfo()
const firestorePath = computed(() => getFirestorePath(demoConfig.path))

const { data, loading, error, loadData } = usePageContent(demoConfig as PageConfig)

onMounted(() => {
    console.log('📄 Demo Page Loading...')
    console.log('🔥 Firestore Path:', firestorePath.value)
    loadData()
})
</script>

<style scoped>
.demo-page-wrapper {
    min-height: 100vh;
    background: #f9fafb;
}

.loading,
.error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1.25rem;
}

.error {
    color: #dc2626;
}

.hero-section {
    padding: 4rem 2rem;
    text-align: center;
    color: white;
    transition: background 0.3s;
}

.hero-section[data-theme="blue"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section[data-theme="green"] {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.hero-section[data-theme="purple"] {
    background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
}

.hero-section[data-theme="orange"] {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

.hero-image {
    max-width: 600px;
    width: 100%;
    border-radius: 12px;
    margin-top: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.features-section {
    padding: 4rem 2rem;
}

.section-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 3rem;
    color: #1f2937;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.feature-icon {
    width: 48px;
    height: 48px;
    color: #667eea;
    margin-bottom: 1rem;
}

.feature-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1f2937;
}

.feature-description {
    color: #6b7280;
    line-height: 1.6;
}

.debug-section {
    padding: 2rem;
    background: #f3f4f6;
}

.debug-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
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

.edit-btn {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.2s;
}

.edit-btn:hover {
    background: #2563eb;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }
}
</style>
