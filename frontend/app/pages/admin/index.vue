<!-- Chức năng: Admin panel chính với sidebar, header và editor area -->
<template>
    <div class="admin-layout">
        <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="isMobileMenuOpen = false" />

        <AdminSidebar :pages="sidebarPages" :active-page="activePage" :is-collapsed="isSidebarCollapsed" @toggle="toggleSidebar" @switch="switchPage" />

        <main :class="['admin-main', { 'sidebar-collapsed': isSidebarCollapsed }]">
            <AdminHeader :page-name="currentPageName" :has-changes="hasChanges" :is-saving="isSaving" :show-save-button="showHeaderSaveButton" :tabs="headerTabs" :active-tab="currentActiveTab" @save="handleGlobalSave" @tab-change="handleTabChange" />

            <div class="admin-content">
                <div v-if="loading" class="loading-state">
                    <div class="spinner" />
                    <p>Đang tải dữ liệu...</p>
                </div>

                <template v-else-if="!isCollectionPage">
                    <LiveEditView ref="liveEditRef" v-if="activeContentTab === 'live'" :page-key="activePage" @dirty-change="hasChanges = $event" @saving-change="isSaving = $event" />

                    <SettingsView ref="settingsRef" v-else :page-key="activePage" :page-name="currentPageName" @dirty-change="hasChanges = $event" @saving-change="isSaving = $event" />
                </template>

                <div v-else-if="currentConfig" class="editor-container">
                    <div v-if="isCollectionPage" class="collection-page">
                        <div v-if="activeTab === 'items'" class="items-content">
                            <div class="items-toolbar">
                                <div class="search-box">
                                    <Icon name="mdi:magnify" />
                                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm..." class="search-input" />
                                </div>

                                <div class="toolbar-actions">
                                    <select v-if="listConfig?.sortOptions" v-model="sortBy" class="filter-select">
                                        <option value="">Sắp xếp...</option>
                                        <option v-for="opt in listConfig.sortOptions" :key="opt.field + opt.direction" :value="opt.field + ':' + opt.direction">
                                            {{ opt.label }}
                                        </option>
                                    </select>

                                    <select v-for="filter in listConfig?.filterBy" :key="filter.field" v-model="activeFilters[filter.field]" class="filter-select">
                                        <option value="">{{ filter.label }}</option>
                                        <option v-for="opt in filter.options" :key="String(opt)" :value="opt">{{ opt }}</option>
                                    </select>

                                    <button class="btn-primary" @click="openAddModal">
                                        <Icon name="mdi:plus" />
                                        <span>Thêm mới</span>
                                    </button>
                                </div>
                            </div>

                            <ItemsList :items="filteredItems" :columns="itemColumns" :item-config="itemConfigForList" @add="openAddModal" @edit="openEditModal" @delete="handleDelete" />

                            <div v-if="totalPages > 1" class="pagination">
                                <button :disabled="currentPage === 1" @click="currentPage--">
                                    <Icon name="mdi:chevron-left" />
                                </button>
                                <span>{{ currentPage }} / {{ totalPages }}</span>
                                <button :disabled="currentPage === totalPages" @click="currentPage++">
                                    <Icon name="mdi:chevron-right" />
                                </button>
                            </div>
                        </div>

                        <div v-else class="settings-content">
                            <Section v-for="(section, sectionKey) in currentConfig.sections" :key="sectionKey" :label="section.label" :is-collapsed="collapsedSections[sectionKey as string] ?? section.collapsed ?? false" @toggle="toggleSection(sectionKey as string)">
                                <template v-for="(field, fieldKey) in section.fields" :key="fieldKey">
                                    <GroupField v-if="field.type === 'group'" :field="field">
                                        <Field v-for="(subField, subKey) in field.fields" :key="subKey" :field="(subField as any)" :model-value="getFieldValue(sectionKey as string, fieldKey as string, subKey as string)" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, subKey as string, $event)" />
                                    </GroupField>
                                    <ArrayField v-else-if="field.type === 'array'" :field="field as any" :model-value="(getFieldValue(sectionKey, fieldKey) as any[]) || []" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, null, $event)" />
                                    <Field v-else :field="(field as any)" :model-value="getFieldValue(sectionKey as string, fieldKey as string)" @update:model-value="setFieldValue(sectionKey as string, fieldKey as string, null, $event)" />
                                </template>
                            </Section>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <button class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <Icon name="mdi:menu" />
        </button>

        <ItemEditor v-if="detailConfig" :is-open="isEditorOpen" :is-new="isNewItem" :item-name="getCollectionName" :config="detailConfig" :initial-data="editingItem" @close="closeEditor" @save="handleSaveItem" />
    </div>
</template>

<script setup lang="ts">
import AdminSidebar from "./components/layouts/AdminSidebar.vue";
import AdminHeader from "./components/layouts/AdminHeader.vue";
import Section from "./components/shared/Section.vue";
import Field from "./components/fields/Field.vue";
import ArrayField from "./components/fields/ArrayField.vue";
import GroupField from "./components/fields/GroupField.vue";
import ItemsList from "./components/collection/ItemsList.vue";
import ItemEditor from "./components/collection/ItemEditor.vue";
import LiveEditView from "./components/views/LiveEditView.vue";
import SettingsView from "./components/views/SettingsView.vue";
import { PAGE_CONFIGS, getAllPages, getPageConfig, isCollectionPage as checkIsCollection, getListingConfig, getDetailConfig } from "./page.config";

definePageMeta({ layout: false });

const sidebarPages = computed(() => {
    return getAllPages().map((page) => ({
        key: page.key,
        name: page.pageName,
        icon: page.icon || "mdi:circle-small",
        type: page.configType === "listing" ? "collection" : "page",
    }));
});

const activePage = ref("home");
const activeTab = ref<"items" | "settings">("items");
const activeContentTab = ref<"live" | "settings">("live");
const formData = ref<Record<string, Record<string, Record<string, unknown>>>>({});
const collapsedSections = ref<Record<string, boolean>>({});
const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = ref(false);
const hasChanges = ref(false);
const isSaving = ref(false);
const loading = ref(false);

const liveEditRef = ref<{ handleSave: () => Promise<void> } | null>(null);
const settingsRef = ref<{ handleSave: () => Promise<void> } | null>(null);

const isEditorOpen = ref(false);
const isNewItem = ref(true);
const editingItem = ref<Record<string, unknown>>({});

const searchQuery = ref("");
const sortBy = ref("");
const activeFilters = ref<Record<string, string>>({});
const currentPage = ref(1);
const itemsPerPage = 10;

const itemsList = ref<Record<string, unknown>[]>([]);

const firstKey = Object.keys(PAGE_CONFIGS)[0] as string;
const currentConfig = computed(() => getPageConfig(activePage.value) || PAGE_CONFIGS[firstKey]);
const currentPageName = computed(() => currentConfig.value?.pageName || "");
const isCollectionPage = computed(() => checkIsCollection(activePage.value));

const listConfig = computed(() => getListingConfig(activePage.value));
const detailConfig = computed(() => getDetailConfig(activePage.value));

const getCollectionName = computed(() => {
    if (!isCollectionPage.value) return "";
    return currentConfig.value?.pageName || "Items";
});

const itemColumns = computed(() => {
    if (!detailConfig.value?.tableColumns) return [];
    return detailConfig.value.tableColumns;
});

const itemConfigForList = computed(() => ({
    name: getCollectionName.value.toLowerCase(),
    namePlural: getCollectionName.value,
    icon: currentConfig.value?.icon || "mdi:file",
}));

interface TabItem {
    key: string
    label: string
    icon: string
    count?: number
}

const headerTabs = computed<TabItem[]>(() => {
    if (isCollectionPage.value) {
        return [
            { key: "items", label: getCollectionName.value, icon: currentConfig.value?.icon || "mdi:view-list", count: itemsList.value.length },
            { key: "settings", label: "Cài đặt", icon: "mdi:cog" },
        ];
    }
    return [
        { key: "live", label: "Live Edit", icon: "mdi:eye" },
        { key: "settings", label: "Cài đặt", icon: "mdi:cog" },
    ];
});

const currentActiveTab = computed(() => (isCollectionPage.value ? activeTab.value : activeContentTab.value));

const showHeaderSaveButton = computed(() => {
    if (isCollectionPage.value) return activeTab.value === "settings";
    return true;
});

const handleTabChange = (key: string) => {
    if (isCollectionPage.value) {
        activeTab.value = key as "items" | "settings";
    } else {
        activeContentTab.value = key as "live" | "settings";
    }
};

const filteredItems = computed(() => {
    let items = [...itemsList.value];

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        const searchFields = listConfig.value?.searchFields || ["name", "title"];
        items = items.filter((item) => searchFields.some((field: string) => String(item[field] || "").toLowerCase().includes(query)));
    }

    for (const [key, val] of Object.entries(activeFilters.value)) {
        if (val) {
            items = items.filter((item) => item[key] === val);
        }
    }

    if (sortBy.value) {
        const [field, direction] = sortBy.value.split(":");
        if (field) {
            items = [...items].sort((a, b) => {
                const aVal = a[field];
                const bVal = b[field];
                const mult = direction === "desc" ? -1 : 1;
                if (typeof aVal === "string") return mult * (aVal as string).localeCompare(bVal as string);
                return mult * ((aVal as number) - (bVal as number));
            });
        }
    }

    return items;
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1);

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredItems.value.slice(start, start + itemsPerPage);
});

const switchPage = (pageKey: string) => {
    activePage.value = pageKey;
    activeTab.value = checkIsCollection(pageKey) ? "items" : "settings";
    activeContentTab.value = "live";
    isMobileMenuOpen.value = false;
    searchQuery.value = "";
    sortBy.value = "";
    activeFilters.value = {};
    currentPage.value = 1;
    loadPageData();
};

const handleGlobalSave = async () => {
    if (isCollectionPage.value) return;

    if (activeContentTab.value === "live") {
        await liveEditRef.value?.handleSave();
    } else {
        await settingsRef.value?.handleSave();
    }
    hasChanges.value = false;
};

const loadPageData = async () => {
    loading.value = true;
    try {
        if (isCollectionPage.value) {
            itemsList.value = [];
        }
    } finally {
        loading.value = false;
    }
};

const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
    } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }
};

const toggleSection = (sectionKey: string) => {
    collapsedSections.value[sectionKey] = !collapsedSections.value[sectionKey];
};

const getFieldValue = (sectionKey: string, fieldKey: string, subKey?: string | null) => {
    const pageData = formData.value[activePage.value];
    if (!pageData || !pageData[sectionKey]) return undefined;
    const fieldValue = pageData[sectionKey][fieldKey];
    if (subKey && typeof fieldValue === "object" && fieldValue !== null) {
        return (fieldValue as Record<string, unknown>)[subKey];
    }
    return fieldValue;
};

const setFieldValue = (sectionKey: string, fieldKey: string, subKey: string | null, value: unknown) => {
    const page = activePage.value;
    if (!formData.value[page]) formData.value[page] = {};
    if (!formData.value[page]![sectionKey]) formData.value[page]![sectionKey] = {};

    if (subKey) {
        const currentValue = formData.value[page]![sectionKey]![fieldKey];
        formData.value[page]![sectionKey]![fieldKey] = {
            ...(typeof currentValue === "object" && currentValue !== null ? currentValue : {}),
            [subKey]: value,
        };
    } else {
        formData.value[page]![sectionKey]![fieldKey] = value;
    }
    hasChanges.value = true;
};

const saveForm = () => {
    console.log("Saving form data:", formData.value);
    hasChanges.value = false;
    alert("Đã lưu thành công!");
};

const openAddModal = () => {
    isNewItem.value = true;
    editingItem.value = detailConfig.value?.defaultValues ? { ...detailConfig.value.defaultValues } : {};
    isEditorOpen.value = true;
};

const openEditModal = (item: Record<string, unknown>) => {
    isNewItem.value = false;
    editingItem.value = { ...item };
    isEditorOpen.value = true;
};

const closeEditor = () => {
    isEditorOpen.value = false;
    editingItem.value = {};
};

const handleSaveItem = (data: Record<string, unknown>) => {
    console.log("Save item:", data);
    if (isNewItem.value) {
        itemsList.value.push({ ...data, id: Date.now().toString() });
    } else {
        const index = itemsList.value.findIndex((i) => i.id === data.id);
        if (index !== -1) {
            itemsList.value[index] = { ...data };
        }
    }
    closeEditor();
    alert(isNewItem.value ? "Đã thêm mới!" : "Đã cập nhật!");
};

const handleDelete = (item: Record<string, unknown>) => {
    if (confirm(`Xóa "${item.name || item.title}"?`)) {
        itemsList.value = itemsList.value.filter((i) => i.id !== item.id);
        console.log("Delete:", item);
        alert("Đã xóa!");
    }
};

watch([searchQuery, sortBy, activeFilters], () => {
    currentPage.value = 1;
});

onMounted(() => {
    loadPageData();
});
</script>

<style scoped>
@import "./styles/desktop.css";
@import "./styles/mobile.css";
</style>
