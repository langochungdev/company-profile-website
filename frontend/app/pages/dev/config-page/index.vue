<template>
    <div class="config-page-wrapper">
        <div class="header">
            <h1>🛠️ Config Manager</h1>
            <p class="subtitle">Dynamic CRUD cho Page & Collection Configs</p>
        </div>

        <div class="config-selector-card">
            <h3>📋 Select Config</h3>
            <div class="selector-row">
                <select v-model="selectedConfigKey" @change="handleConfigChange" class="config-select">
                    <option value="">-- Choose a config --</option>
                    <optgroup label="Single Pages">
                        <option v-for="configItem in pageConfigs" :key="configItem.key" :value="configItem.key">
                            📄 {{ configItem.config.pageName }} ({{ configItem.key }})
                        </option>
                    </optgroup>
                    <optgroup label="Collections">
                        <option v-for="configItem in collectionConfigs" :key="configItem.key" :value="configItem.key">
                            📦 {{ configItem.config.collectionName || configItem.config.pageName }} ({{ configItem.key }})
                        </option>
                    </optgroup>
                </select>

                <div v-if="currentConfig" class="config-badges">
                    <span class="badge type" :class="isCollectionMode ? 'collection' : 'page'">
                        {{ isCollectionMode ? 'Collection' : 'Single Page' }}
                    </span>
                    <span class="badge path">{{ currentFirestorePath }}</span>
                </div>
            </div>
        </div>

        <div v-if="!selectedConfigKey" class="empty-state">
            <h2>👆 Chọn config để bắt đầu</h2>
            <p>Chọn một page config hoặc collection từ dropdown để load và edit data</p>
        </div>

        <template v-else>
            <div v-if="error" class="error-card">
                <h3>❌ Error</h3>
                <p>{{ error.message }}</p>
                <button @click="reloadData" class="btn-primary">Retry Load</button>
            </div>

            <div v-if="loading && !data" class="loading-card">
                <div class="spinner"></div>
                <p>Loading data from Firestore...</p>
            </div>

            <div v-else-if="!isCollectionMode && data" class="content page-mode">
                <div class="actions-bar">
                    <div class="btn-group">
                        <button @click="handleSave" :disabled="loading" class="btn-success">
                            💾 Save Page
                        </button>
                        <button @click="handleDelete" :disabled="loading" class="btn-danger">
                            🗑️ Delete Doc
                        </button>
                        <button @click="resetToDefaults" :disabled="loading" class="btn-warning">
                            🔄 Reset
                        </button>
                        <button @click="reloadData" :disabled="loading" class="btn-secondary">
                            ↻ Reload
                        </button>
                    </div>
                    <button @click="toggleJsonEditor" class="btn-secondary">
                        {{ showJsonEditor ? '📝 Form View' : '🔧 JSON Editor' }}
                    </button>
                </div>

                <div v-if="showJsonEditor" class="json-editor-card">
                    <textarea v-model="jsonText" @input="handleJsonEdit" class="json-textarea" spellcheck="false"></textarea>
                    <p v-if="jsonError" class="json-error">{{ jsonError }}</p>
                </div>

                <div v-else class="form-view">
                    <div v-for="(section, sectionKey) in data" :key="String(sectionKey)" class="section-card">
                        <h3 class="section-title">{{ formatLabel(String(sectionKey)) }}</h3>
                        <div class="fields-grid">
                            <div v-for="(value, fieldKey) in section" :key="String(fieldKey)" class="field-wrapper">
                                <label class="field-label">{{ formatLabel(String(fieldKey)) }}</label>
                                <component :is="getInputComponent(value)" :value="value" @input="(val: any) => updatePageField(String(sectionKey), String(fieldKey), val)" class="field-input" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="isCollectionMode && data" class="content collection-mode">
                <div class="collection-tabs">
                    <button @click="collectionTab = 'items'" :class="['tab-btn', { active: collectionTab === 'items' }]">
                        📦 Items ({{ (data as any).items?.length || 0 }})
                    </button>
                    <button @click="collectionTab = 'settings'" :class="['tab-btn', { active: collectionTab === 'settings' }]">
                        ⚙️ Listing Settings
                    </button>
                </div>

                <div v-if="collectionTab === 'settings'" class="listing-settings-tab">
                    <div class="settings-section">
                        <h3>📐 Layout</h3>
                        <div class="settings-grid">
                            <div class="setting-item">
                                <label>Grid Columns</label>
                                <select v-model="listingSettingsLocal.layout.gridColumns" class="setting-input">
                                    <option :value="2">2 cột</option>
                                    <option :value="3">3 cột</option>
                                    <option :value="4">4 cột</option>
                                    <option :value="5">5 cột</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>Items Per Page</label>
                                <select v-model="listingSettingsLocal.layout.itemsPerPage" class="setting-input">
                                    <option :value="6">6</option>
                                    <option :value="9">9</option>
                                    <option :value="12">12</option>
                                    <option :value="16">16</option>
                                    <option :value="24">24</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>Card Style</label>
                                <select v-model="listingSettingsLocal.layout.cardStyle" class="setting-input">
                                    <option value="grid">Grid</option>
                                    <option value="list">List</option>
                                    <option value="compact">Compact</option>
                                </select>
                            </div>
                            <div class="setting-item checkbox">
                                <label>
                                    <input type="checkbox" v-model="listingSettingsLocal.layout.showSidebar" />
                                    Show Sidebar Filter
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>👁️ Display Options</h3>
                        <div class="settings-grid checkboxes">
                            <label><input type="checkbox" v-model="listingSettingsLocal.display.showPrice" /> Show Price</label>
                            <label><input type="checkbox" v-model="listingSettingsLocal.display.showBadge" /> Show Badge</label>
                            <label><input type="checkbox" v-model="listingSettingsLocal.display.showRating" /> Show Rating</label>
                            <label><input type="checkbox" v-model="listingSettingsLocal.display.showQuickView" /> Quick View Button</label>
                            <label><input type="checkbox" v-model="listingSettingsLocal.display.showAddToCart" /> Add to Cart Button</label>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>🎨 Hero Banner</h3>
                        <div class="settings-grid">
                            <div class="setting-item checkbox">
                                <label>
                                    <input type="checkbox" v-model="listingSettingsLocal.hero.enabled" />
                                    Enable Hero Banner
                                </label>
                            </div>
                            <div class="setting-item full-width">
                                <label>Hero Title</label>
                                <input type="text" v-model="listingSettingsLocal.hero.title" class="setting-input" placeholder="Page Title" />
                            </div>
                            <div class="setting-item full-width">
                                <label>Hero Subtitle</label>
                                <input type="text" v-model="listingSettingsLocal.hero.subtitle" class="setting-input" placeholder="Short description" />
                            </div>
                            <div class="setting-item full-width">
                                <label>Hero Image URL</label>
                                <input type="text" v-model="listingSettingsLocal.hero.image" class="setting-input" placeholder="https://..." />
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>🔍 SEO</h3>
                        <div class="settings-grid">
                            <div class="setting-item full-width">
                                <label>Page Title</label>
                                <input type="text" v-model="listingSettingsLocal.seo.pageTitle" class="setting-input" placeholder="Page Title | Site Name" />
                            </div>
                            <div class="setting-item full-width">
                                <label>Meta Description</label>
                                <textarea v-model="listingSettingsLocal.seo.metaDescription" class="setting-input" rows="2" placeholder="Description for search engines"></textarea>
                            </div>
                            <div class="setting-item full-width">
                                <label>OG Image URL</label>
                                <input type="text" v-model="listingSettingsLocal.seo.ogImage" class="setting-input" placeholder="Social share image URL" />
                            </div>
                        </div>
                    </div>

                    <div class="settings-actions">
                        <button @click="saveListingSettings" class="btn-success">💾 Save Listing Settings</button>
                    </div>
                </div>

                <div v-else class="items-tab">
                    <div class="actions-bar">
                        <div class="btn-group">
                            <button @click="openAddItemModal" class="btn-primary">
                                ➕ Add New Item
                            </button>
                            <button @click="reloadData" :disabled="loading" class="btn-secondary">
                                ↻ Reload
                            </button>
                        </div>
                    </div>

                    <div v-if="isCollectionMode" class="collection-toolbar">
                        <div class="search-box">
                            <span class="search-icon">🔍</span>
                            <input v-model="searchQuery" type="text" placeholder="Search items..." class="search-input" />
                        </div>

                        <div class="filters">
                            <select v-model="sortBy" class="filter-select">
                                <option value="">Sort By...</option>
                                <option v-for="opt in listConfig?.sortOptions" :key="opt" :value="opt">
                                    {{ formatLabel(opt) }}
                                </option>
                            </select>

                            <select v-for="filter in listConfig?.filterBy" :key="filter" v-model="activeFilters[filter]" class="filter-select">
                                <option value="">All {{ formatLabel(filter) }}</option>
                                <option v-for="opt in getFilterOptions(filter)" :key="String(opt)" :value="opt">
                                    {{ opt }}
                                </option>
                            </select>
                        </div>

                        <div class="pagination-controls" v-if="totalPages > 1">
                            <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">←</button>
                            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                            <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">→</button>
                        </div>
                    </div>

                    <div v-if="isCollectionMode" class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th class="actions-col">Actions</th>
                                    <th v-for="field in previewFields" :key="field">{{ formatLabel(field) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in paginatedItems" :key="item.id || index">
                                    <td class="actions-cell">
                                        <button @click="editItem(item)" class="btn-icon edit" title="Edit">✏️</button>
                                        <button @click="confirmDeleteItem(item.id)" class="btn-icon delete" title="Delete">🗑️</button>
                                    </td>
                                    <td v-for="field in previewFields" :key="field">
                                        <div v-if="isImageField(field)" class="cell-image">
                                            <img v-if="item[field]" :src="item[field]" alt="thumb" />
                                            <span v-else class="no-img">No Img</span>
                                        </div>
                                        <span v-else-if="isStatusField(field)" class="badge-status" :data-status="item[field]">
                                            {{ item[field] }}
                                        </span>
                                        <span v-else>
                                            {{ formatValue(item[field]) }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="!paginatedItems.length">
                                    <td :colspan="previewFields.length + 1" class="empty-cell">
                                        No items match your criteria.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-if="showItemEditor" class="modal-overlay">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3>{{ editingItem?.id ? 'Edit Item' : 'New Item' }}</h3>
                                <button @click="closeItemEditor" class="close-btn">×</button>
                            </div>
                            <div class="modal-body">
                                <div v-for="(fieldConfig, key) in currentCollectionFields" :key="key" class="field-wrapper">
                                    <label class="field-label">
                                        {{ fieldConfig.label || formatLabel(String(key)) }}
                                        <span v-if="fieldConfig.required" class="required">*</span>
                                    </label>
                                    <p v-if="fieldConfig.note" class="field-note">{{ fieldConfig.note }}</p>

                                    <div v-if="fieldConfig.type === 'image'" class="image-input-wrapper">
                                        <input type="text" v-model="tempItemData[key]" placeholder="Image URL..." class="input-text" />
                                        <div v-if="tempItemData[key]" class="image-preview">
                                            <img :src="tempItemData[key]" alt="Preview" />
                                        </div>
                                    </div>

                                    <textarea v-else-if="fieldConfig.type === 'textarea'" v-model="tempItemData[key]" class="input-textarea" rows="4"></textarea>

                                    <select v-else-if="fieldConfig.type === 'select'" v-model="tempItemData[key]" class="input-select">
                                        <option v-for="opt in fieldConfig.options" :key="opt" :value="opt">
                                            {{ opt }}
                                        </option>
                                    </select>

                                    <input v-else-if="fieldConfig.type === 'boolean'" type="checkbox" v-model="tempItemData[key]" class="input-checkbox" />

                                    <input v-else-if="fieldConfig.type === 'date'" type="date" v-model="tempItemData[key]" class="input-date" />

                                    <div v-else-if="fieldConfig.type === 'array'" class="array-input">
                                        <textarea :value="JSON.stringify(tempItemData[key], null, 2)" @input="e => tryParseJson(String(key), (e.target as HTMLTextAreaElement).value)" class="input-code" rows="4"></textarea>
                                        <small>Enter valid JSON array</small>
                                    </div>

                                    <input v-else type="text" v-model="tempItemData[key]" class="input-text" />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button @click="closeItemEditor" class="btn-secondary">Cancel</button>
                                <button @click="saveItem" class="btn-primary">Apply Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div v-if="successMessage" class="toast success">
            {{ successMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineComponent, h, unref } from 'vue'
import { doc, deleteDoc, type Firestore } from 'firebase/firestore'
import { SIDEBAR_PAGES } from '@/pages/admin/page.config'
import { demoConfig } from './demo-page/demo.cms'
import { demoListingConfig } from './demo-collection/demoListing.cms'
import { demoDetailConfig } from './demo-collection/demoDetail.cms'
import { usePageContext } from '@/composables/usePageContext'
import { useDetailContext } from '@/composables/useDetailContext'
import { getFirestoreInfo, getFirestorePath } from '@/utils/firestore'
import type { PageConfig } from '@/pages/admin/page.config'

const envInfo = getFirestoreInfo()

const availableConfigs = [
    { key: 'demo-page', config: demoConfig as PageConfig },
    { key: 'demo-collection', config: demoDetailConfig as any },
    ...SIDEBAR_PAGES
]

const pageConfigs = availableConfigs.filter(c => (c.config as any).type === 'page' || !(c.config as any).type)
const collectionConfigs = availableConfigs.filter(c => (c.config as any).type === 'listing' || (c.config as any).type === 'detail')

const selectedConfigKey = ref('')
const currentConfig = ref<any>(null)
const isCollectionMode = computed(() => currentConfig.value?.type === 'listing' || currentConfig.value?.type === 'detail')
const collectionTab = ref<'items' | 'settings'>('items')

const listingSettingsLocal = ref({
    layout: {
        gridColumns: 3 as 2 | 3 | 4 | 5,
        itemsPerPage: 9 as 6 | 9 | 12 | 16 | 24,
        cardStyle: 'grid' as 'grid' | 'list' | 'compact',
        showSidebar: true,
    },
    display: {
        showPrice: true,
        showBadge: true,
        showRating: false,
        showQuickView: true,
        showAddToCart: false,
    },
    hero: {
        enabled: true,
        title: '',
        subtitle: '',
        image: '',
    },
    seo: {
        pageTitle: '',
        metaDescription: '',
        ogImage: '',
    },
})

const saveListingSettings = async () => {
    try {
        const { $db } = useNuxtApp()
        if (!$db) throw new Error('Firebase not initialized')

        const basePath = currentConfig.value?.path?.replace(/\/items$/, '') || 'collections/demo-items'
        const settingsPath = getFirestorePath(basePath)
        const docRef = doc($db as Firestore, settingsPath)

        const { setDoc } = await import('firebase/firestore')
        await setDoc(docRef, { settings: listingSettingsLocal.value }, { merge: true })

        showSuccessMessage('✅ Listing settings saved!')
    } catch (e) {
        alert('Save failed: ' + (e as Error).message)
    }
}

const currentFirestorePath = computed(() =>
    currentConfig.value ? getFirestorePath(currentConfig.value.path) : ''
)

type PageManager = ReturnType<typeof usePageContext>
type CollectionManager = ReturnType<typeof useDetailContext>

const pageManager = ref<PageManager | null>(null)
const collectionManager = ref<CollectionManager | null>(null)

const data = computed(() => {
    if (isCollectionMode.value) {
        const manager = collectionManager.value
        if (!manager) return null
        return { items: unref(manager.items) }
    }
    const manager = pageManager.value
    if (!manager) return null
    return unref(manager.data)
})

const loading = computed(() => {
    if (isCollectionMode.value) {
        const manager = collectionManager.value
        if (!manager) return false
        return unref(manager.loading)
    }
    const manager = pageManager.value
    if (!manager) return false
    return unref(manager.loading)
})

const error = computed(() => {
    if (isCollectionMode.value) {
        const manager = collectionManager.value
        if (!manager) return null
        return unref(manager.error)
    }
    const manager = pageManager.value
    if (!manager) return null
    return unref(manager.error)
})

const handleConfigChange = () => {
    const selectedItem = availableConfigs.find(c => c.key === selectedConfigKey.value)
    if (!selectedItem) {
        currentConfig.value = null
        return
    }

    currentConfig.value = selectedItem.config

    pageManager.value = null
    collectionManager.value = null

    if (isCollectionMode.value) {
        collectionManager.value = useDetailContext(selectedItem.config)
        collectionManager.value?.loadItems()
    } else {
        pageManager.value = usePageContext(selectedItem.config)
        pageManager.value?.loadData()
    }
}

const reloadData = () => {
    if (isCollectionMode.value && collectionManager.value) {
        collectionManager.value.loadItems()
    } else if (pageManager.value) {
        pageManager.value.loadData()
    }
}

const handleSave = async () => {
    try {
        if (isCollectionMode.value) {
            showSuccessMessage('✅ Collection items are auto-saved on each change')
            return
        }

        if (pageManager.value) {
            await pageManager.value.saveData()
        }

        showSuccessMessage(`✅ Saved to ${currentFirestorePath.value}`)
    } catch (e) {
        alert('Save failed: ' + (e as Error).message)
    }
}

const handleDelete = async () => {
    if (!confirm('Are you sure? This will DELETE the ENTIRE document!')) return
    try {
        const { $db } = useNuxtApp()
        if (!$db) throw new Error('Firebase not initialized')
        const fullPath = getFirestorePath(currentConfig.value.path)
        await deleteDoc(doc($db as Firestore, fullPath))
        showSuccessMessage('🗑️ Document deleted')
        reloadData()
    } catch (e) {
        alert('Delete failed: ' + (e as Error).message)
    }
}

const resetToDefaults = () => {
    if (confirm('Reset to defaults? Unsaved changes will be lost.')) {
        if (isCollectionMode.value && collectionManager.value) {
            collectionManager.value.loadItems()
        } else if (pageManager.value) {
            pageManager.value.resetToDefaults()
        }
    }
}

const showJsonEditor = ref(false)
const jsonText = ref('')
const jsonError = ref('')

const toggleJsonEditor = () => {
    if (!showJsonEditor.value && data.value) {
        jsonText.value = JSON.stringify(data.value, null, 2)
    }
    showJsonEditor.value = !showJsonEditor.value
}

const handleJsonEdit = () => {
    try {
        const parsed = JSON.parse(jsonText.value)
        const manager = pageManager.value
        if (manager && manager.data && manager.data.value) {
            manager.data.value = parsed
        }
        jsonError.value = ''
    } catch (e) {
        jsonError.value = 'Invalid JSON'
    }
}

const updatePageField = (section: string, field: string, value: any) => {
    const manager = pageManager.value
    if (manager && manager.data && manager.data.value) {
        manager.data.value[section][field] = value
    }
}

// Custom Input Components for Page Mode
const TextInput = defineComponent({
    props: ['value'],
    emits: ['input'],
    render() {
        return h('input', {
            value: this.value,
            onInput: (e: any) => this.$emit('input', e.target.value),
            class: 'field-input'
        })
    }
})

const CheckboxInput = defineComponent({
    props: ['value'],
    emits: ['input'],
    render() {
        return h('input', {
            type: 'checkbox',
            checked: this.value,
            onChange: (e: any) => this.$emit('input', e.target.checked),
            class: 'field-checkbox'
        })
    }
})

const JsonInput = defineComponent({
    props: ['value'],
    emits: ['input'],
    render() {
        return h('textarea', {
            value: JSON.stringify(this.value, null, 2),
            onInput: (e: any) => {
                try {
                    this.$emit('input', JSON.parse(e.target.value))
                } catch { }
            },
            class: 'field-code',
            rows: 4
        })
    }
})

const getInputComponent = (value: any) => {
    if (typeof value === 'boolean') return CheckboxInput
    if (typeof value === 'object') return JsonInput
    return TextInput
}

// --- Collection Mode Logic ---
const showItemEditor = ref(false)
const editingItem = ref<any>(null)
const tempItemData = ref<any>({})

const currentCollectionFields = computed(() => {
    return isCollectionMode.value ? currentConfig.value?.itemFields || {} : {}
})

const previewFields = computed(() => {
    if (!isCollectionMode.value) return []
    const fields = Object.keys(currentCollectionFields.value)
    return ['title', 'name', 'slug', 'status', 'category'].filter(f => fields.includes(f)).slice(0, 5)
})

const openAddItemModal = () => {
    editingItem.value = null
    tempItemData.value = {
        ...generateDefaults(currentCollectionFields.value)
    }
    showItemEditor.value = true
}

const editItem = (item: any) => {
    editingItem.value = item
    tempItemData.value = JSON.parse(JSON.stringify(item)) // Deep copy
    showItemEditor.value = true
}

const confirmDeleteItem = async (id: string) => {
    if (confirm('Delete this item?')) {
        try {
            await collectionManager.value?.deleteItem(id)
            showSuccessMessage('🗑️ Item deleted')
        } catch (e) {
            alert('Delete failed: ' + (e as Error).message)
        }
    }
}

const saveItem = async () => {
    try {
        if (editingItem.value) {
            await collectionManager.value?.updateItem(editingItem.value.id, tempItemData.value)
            showSuccessMessage('✅ Item updated')
        } else {
            await collectionManager.value?.addItem(tempItemData.value)
            showSuccessMessage('✅ Item added')
        }
        closeItemEditor()
    } catch (e) {
        alert((e as Error).message)
    }
}

const closeItemEditor = () => {
    showItemEditor.value = false
    editingItem.value = null
    tempItemData.value = {}
}

const tryParseJson = (key: string, value: string) => {
    try {
        tempItemData.value[key] = JSON.parse(value)
    } catch { }
}

const generateDefaults = (fields: any) => {
    const defaults: any = {}
    for (const key in fields) {
        const field = fields[key]
        if (field.default !== undefined) defaults[key] = field.default
        else if (field.type === 'array') defaults[key] = []
        else if (field.type === 'boolean') defaults[key] = false
        else defaults[key] = ''
    }
    return defaults
}

// --- Utilities ---
const successMessage = ref('')
const showSuccessMessage = (msg: string) => {
    successMessage.value = msg
    setTimeout(() => successMessage.value = '', 3000)
}

const formatLabel = (key: string | number) => {
    const str = String(key)
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
}

const formatValue = (val: any) => {
    if (typeof val === 'object') return '[Object]'
    if (typeof val === 'boolean') return val ? '✅' : '❌'
    return val
}

const searchQuery = ref('')
const sortBy = ref('')
const activeFilters = ref<Record<string, string>>({})
const currentPage = ref(1)
const itemsPerPage = 10

const listConfig = computed(() => {
    if (!isCollectionMode.value || !currentConfig.value) return null
    return currentConfig.value.listConfig || { sortOptions: [], filterBy: [] }
})

const filteredItems = computed(() => {
    if (!isCollectionMode.value || !data.value) return []
    let items = (data.value as any).items || []

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        items = items.filter((item: any) =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(query)
            )
        )
    }

    for (const [key, val] of Object.entries(activeFilters.value)) {
        if (val) {
            items = items.filter((item: any) => item[key] === val)
        }
    }

    if (sortBy.value) {
        items = [...items].sort((a: any, b: any) => {
            const aVal = a[sortBy.value]
            const bVal = b[sortBy.value]
            if (typeof aVal === 'string') return aVal.localeCompare(bVal)
            return aVal - bVal
        })
    }

    return items
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1)

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredItems.value.slice(start, start + itemsPerPage)
})

const getFilterOptions = (field: string) => {
    if (!data.value) return []
    const items = (data.value as any).items || []
    const values = [...new Set(items.map((item: any) => item[field]).filter(Boolean))]
    return values
}

const isImageField = (field: string) => {
    const imageFields = ['image', 'thumbnail', 'avatar', 'cover', 'photo', 'img']
    return imageFields.some(f => field.toLowerCase().includes(f))
}

const isStatusField = (field: string) => {
    return field.toLowerCase() === 'status'
}

watch([searchQuery, sortBy, activeFilters], () => {
    currentPage.value = 1
})
</script>

<style scoped>
@import "./styles/desktop.css";
@import "./styles/mobile.css";
</style>
