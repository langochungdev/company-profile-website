<!-- Chức năng: Dynamic route cho Live Edit mode - /admin/live/[page] -->
<template>
    <div class="live-edit-page">
        <LivePreviewBar :page-name="config?.pageName || ''" :page-icon="config?.icon || 'mdi:file'" :is-dirty="isDirty" :is-saving="isSaving" @back="handleBack" @save="handleSave" @discard="handleDiscard" />

        <div class="preview-container">
            <div v-if="isLoading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải...</span>
            </div>

            <template v-else-if="pageKey === 'home'">
                <EditOverlay v-for="(section, sectionId) in config?.sections" :key="sectionId" :label="section.label" :editable="true" :visible="sectionVisibility[sectionId] ?? true" @toggle-visible="toggleSectionVisibility(sectionId)">
                    <component :is="getSectionComponent(sectionId)" :data="getSectionData(sectionId)" :editable="true" @edit="(fieldPath: string) => openEditor(sectionId, fieldPath)" />
                </EditOverlay>
            </template>

            <div v-else class="unsupported-page">
                <Icon name="mdi:alert-circle-outline" />
                <h3>Page này chưa hỗ trợ Live Edit</h3>
                <p>Vui lòng sử dụng form editor truyền thống.</p>
                <button @click="handleBack">Quay lại Admin</button>
            </div>
        </div>

        <FieldPopupEditor :is-open="isPopupOpen" :field-config="editTarget?.fieldConfig || null" :initial-value="editTarget?.currentValue" @close="closeEditor" @apply="applyEdit" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LivePreviewBar from '../components/LivePreviewBar.vue'
import EditOverlay from '../components/EditOverlay.vue'
import FieldPopupEditor from '../components/FieldPopupEditor.vue'
import { useLiveEdit } from '../composables/useLiveEdit'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()

const pageKey = computed(() => route.params.page as string || 'home')

const {
    config,
    data,
    isDirty,
    isSaving,
    isLoading,
    editTarget,
    isPopupOpen,
    loadData,
    getSectionData,
    openEditor,
    closeEditor,
    applyEdit,
    save,
    discard
} = useLiveEdit(pageKey.value)

const sectionVisibility = ref<Record<string, boolean>>({})

const sectionComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
    hero: defineAsyncComponent(() => import('@/pages/home/components/HeroSection.vue')),
    services: defineAsyncComponent(() => import('@/pages/home/components/ServicesSection.vue')),
    projects: defineAsyncComponent(() => import('@/pages/home/components/ProjectSection.vue')),
    news: defineAsyncComponent(() => import('@/pages/home/components/NewsSection.vue')),
    certificates: defineAsyncComponent(() => import('@/pages/home/components/CertSection.vue')),
    partners: defineAsyncComponent(() => import('@/pages/home/components/PartnerSection.vue')),
    blog: defineAsyncComponent(() => import('@/pages/home/components/BlogSection.vue')),
}

const getSectionComponent = (sectionId: string) => {
    return sectionComponents[sectionId] || null
}

const toggleSectionVisibility = (sectionId: string) => {
    sectionVisibility.value[sectionId] = !sectionVisibility.value[sectionId]
}

const handleBack = () => {
    if (isDirty.value) {
        if (!confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?')) {
            return
        }
    }
    router.push('/admin')
}

const handleSave = async () => {
    await save()
    alert('Đã lưu thành công!')
}

const handleDiscard = () => {
    if (confirm('Hủy tất cả thay đổi?')) {
        discard()
    }
}

onMounted(() => {
    loadData()

    if (config.value?.sections) {
        Object.keys(config.value.sections).forEach(sectionId => {
            sectionVisibility.value[sectionId] = true
        })
    }
})
</script>

<style scoped>
.live-edit-page {
    min-height: 100vh;
    background: #f1f5f9;
}

.preview-container {
    padding: 60px 0;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 100px 20px;
    color: #64748b;
}

.loading-state svg {
    width: 40px;
    height: 40px;
    color: #3b82f6;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.unsupported-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 100px 20px;
    text-align: center;
}

.unsupported-page svg {
    width: 48px;
    height: 48px;
    color: #f59e0b;
}

.unsupported-page h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
}

.unsupported-page p {
    margin: 0;
    color: #64748b;
}

.unsupported-page button {
    margin-top: 16px;
    padding: 10px 24px;
    background: #3b82f6;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    cursor: pointer;
    transition: background 0.2s;
}

.unsupported-page button:hover {
    background: #2563eb;
}
</style>
