<!-- Chức năng: Admin panel chính với sidebar, header và editor area -->
<template>
    <div class="admin-layout">
        <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="isMobileMenuOpen = false" />

        <AdminSidebar :pages="sidebarPages" :active-page="activePage" :is-collapsed="isSidebarCollapsed" @toggle="toggleSidebar" @switch="switchPage" />

        <main :class="['admin-main', { 'sidebar-collapsed': isSidebarCollapsed }]">
            <AdminHeader :page-name="currentPageName" :has-changes="hasChanges" @save="saveForm" />

            <div class="admin-content">
                <div v-if="currentConfig" class="editor-container">
                    <div v-if="isCollectionPage" class="collection-page">
                        <div class="page-tabs">
                            <button :class="['tab-btn', { active: activeTab === 'settings' }]" @click="activeTab = 'settings'">
                                <Icon name="mdi:cog" />
                                <span>Cài đặt</span>
                            </button>
                            <button :class="['tab-btn', { active: activeTab === 'items' }]" @click="activeTab = 'items'">
                                <Icon :name="currentConfig.itemConfig?.icon || 'mdi:view-list'" />
                                <span>{{ currentConfig.itemConfig?.namePlural || 'Items' }}</span>
                                <span class="tab-count">{{ itemsList.length }}</span>
                            </button>
                        </div>

                        <div v-if="activeTab === 'settings'" class="settings-content">
                            <AdminSection v-for="(section, sectionKey) in currentConfig.sections" :key="sectionKey" :label="section.label" :is-collapsed="collapsedSections[sectionKey as string] ?? section.collapsed ?? false" @toggle="toggleSection(sectionKey as string)">
                                <template v-for="(field, fieldKey) in section.fields" :key="fieldKey">
                                    <AdminGroupField v-if="field.type === 'group'" :field="field">
                                        <AdminField v-for="(subField, subKey) in field.fields" :key="subKey" :field="(subField as any)" :model-value="getFieldValue(sectionKey as string, fieldKey as string, subKey as string)" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, subKey as string, $event)" />
                                    </AdminGroupField>
                                    <AdminArrayField v-else-if="field.type === 'array'" :field="field as any" :model-value="(getFieldValue(sectionKey, fieldKey) as any[]) || []" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, null, $event)" />
                                    <AdminField v-else :field="(field as any)" :model-value="getFieldValue(sectionKey as string, fieldKey as string)" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, null, $event)" />
                                </template>
                            </AdminSection>
                        </div>

                        <div v-else class="items-content">
                            <AdminItemsList :items="itemsList" :columns="itemColumns" :item-config="{ name: currentConfig.itemConfig?.name || 'item', namePlural: currentConfig.itemConfig?.namePlural || 'Items', icon: currentConfig.itemConfig?.icon || 'mdi:file' }" @add="openAddModal" @edit="openEditModal" @delete="handleDelete" />
                        </div>
                    </div>

                    <template v-else>
                        <AdminSection v-for="(section, sectionKey) in currentConfig.sections" :key="sectionKey" :label="section.label" :is-collapsed="collapsedSections[sectionKey as string] ?? section.collapsed ?? false" @toggle="toggleSection(sectionKey as string)">
                            <template v-for="(field, fieldKey) in section.fields" :key="fieldKey">
                                <AdminGroupField v-if="field.type === 'group'" :field="field">
                                    <AdminField v-for="(subField, subKey) in field.fields" :key="subKey" :field="(subField as any)" :model-value="getFieldValue(sectionKey as string, fieldKey as string, subKey as string)" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, subKey as string, $event)" />
                                </AdminGroupField>
                                <AdminArrayField v-else-if="field.type === 'array'" :field="field as any" :model-value="(getFieldValue(sectionKey, fieldKey) as any[]) || []" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, null, $event)" />
                                <AdminField v-else :field="(field as any)" :model-value="getFieldValue(sectionKey as string, fieldKey as string)" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, null, $event)" />
                            </template>
                        </AdminSection>
                    </template>
                </div>
            </div>
        </main>

        <button class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <Icon name="mdi:menu" />
        </button>

        <AdminItemEditor v-if="currentConfig?.itemConfig" :is-open="isEditorOpen" :is-new="isNewItem" :item-name="currentConfig.itemConfig.name" :config="currentConfig.itemConfig.config" :initial-data="editingItem" @close="closeEditor" @save="handleSaveItem" />
    </div>
</template>

<script setup lang="ts">
import AdminSidebar from './layouts/AdminSidebar.vue'
import AdminHeader from './layouts/AdminHeader.vue'
import AdminSection from './components/AdminSection.vue'
import AdminField from './components/AdminField.vue'
import AdminArrayField from './components/AdminArrayField.vue'
import AdminGroupField from './components/AdminGroupField.vue'
import AdminItemsList from './components/AdminItemsList.vue'
import AdminItemEditor from './components/AdminItemEditor.vue'
import { PAGE_CONFIGS, getAllPages, getPageConfig, isCollectionPage as checkIsCollection } from './page.config'

definePageMeta({ layout: false })

const sidebarPages = computed(() => {
    return getAllPages().map(page => ({
        key: page.key,
        name: page.pageName,
        icon: page.icon
    }))
})

const activePage = ref('home')
const activeTab = ref<'settings' | 'items'>('items')
const formData = ref<Record<string, Record<string, Record<string, unknown>>>>({})
const collapsedSections = ref<Record<string, boolean>>({})
const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const hasChanges = ref(false)

const isEditorOpen = ref(false)
const isNewItem = ref(true)
const editingItem = ref<Record<string, unknown>>({})

const firstKey = Object.keys(PAGE_CONFIGS)[0] as string
const currentConfig = computed(() => getPageConfig(activePage.value) || PAGE_CONFIGS[firstKey])
const currentPageName = computed(() => currentConfig.value?.pageName || '')

const isCollectionPage = computed(() => checkIsCollection(activePage.value))

const itemsList = computed(() => {
    if (!currentConfig.value?.itemConfig?.data) return []
    return currentConfig.value.itemConfig.data as Record<string, unknown>[]
})

const itemColumns = computed(() => {
    if (!currentConfig.value?.itemConfig?.config?.tableColumns) return []
    return currentConfig.value.itemConfig.config.tableColumns
})

const switchPage = (pageKey: string) => {
    activePage.value = pageKey
    activeTab.value = checkIsCollection(pageKey) ? 'items' : 'settings'
    isMobileMenuOpen.value = false
}

const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
        isMobileMenuOpen.value = !isMobileMenuOpen.value
    } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value
    }
}

const toggleSection = (sectionKey: string) => {
    collapsedSections.value[sectionKey] = !collapsedSections.value[sectionKey]
}

const getFieldValue = (sectionKey: string, fieldKey: string, subKey?: string | null) => {
    const pageData = formData.value[activePage.value]
    if (!pageData || !pageData[sectionKey]) return undefined
    const fieldValue = pageData[sectionKey][fieldKey]
    if (subKey && typeof fieldValue === 'object' && fieldValue !== null) {
        return (fieldValue as Record<string, unknown>)[subKey]
    }
    return fieldValue
}

const setFieldValue = (sectionKey: string, fieldKey: string, subKey: string | null, value: unknown) => {
    const page = activePage.value
    if (!formData.value[page]) formData.value[page] = {}
    if (!formData.value[page]![sectionKey]) formData.value[page]![sectionKey] = {}

    if (subKey) {
        const currentValue = formData.value[page]![sectionKey]![fieldKey]
        formData.value[page]![sectionKey]![fieldKey] = {
            ...(typeof currentValue === 'object' && currentValue !== null ? currentValue : {}),
            [subKey]: value
        }
    } else {
        formData.value[page]![sectionKey]![fieldKey] = value
    }
    hasChanges.value = true
}

const saveForm = () => {
    console.log('Saving form data:', formData.value)
    hasChanges.value = false
    alert('Đã lưu thành công!')
}

const openAddModal = () => {
    isNewItem.value = true
    editingItem.value = {}
    isEditorOpen.value = true
}

const openEditModal = (item: Record<string, unknown>) => {
    isNewItem.value = false
    editingItem.value = { ...item }
    isEditorOpen.value = true
}

const closeEditor = () => {
    isEditorOpen.value = false
    editingItem.value = {}
}

const handleSaveItem = (data: Record<string, unknown>) => {
    console.log('Save item:', data)
    closeEditor()
    alert(isNewItem.value ? 'Đã thêm mới!' : 'Đã cập nhật!')
}

const handleDelete = (item: Record<string, unknown>) => {
    if (confirm(`Xóa "${item.name || item.title}"?`)) {
        console.log('Delete:', item)
        alert('Đã xóa!')
    }
}
</script>

<style scoped>
@import "./styles/desktop.css";
@import "./styles/mobile.css";

.collection-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.page-tabs {
    display: flex;
    gap: 8px;
    background: #ffffff;
    padding: 8px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: transparent;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;
}

.tab-btn:hover {
    background: #f3f4f6;
    color: #111827;
}

.tab-btn.active {
    background: #3b82f6;
    color: #ffffff;
}

.tab-btn svg {
    width: 18px;
    height: 18px;
}

.tab-count {
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    font-size: 12px;
}

.tab-btn:not(.active) .tab-count {
    background: #e5e7eb;
}
</style>
