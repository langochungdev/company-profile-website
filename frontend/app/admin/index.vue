<!-- Chức năng: Admin panel chính với sidebar, header và editor area -->
<template>
    <div class="admin-layout">
        <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="isMobileMenuOpen = false" />

        <AdminSidebar :pages="sidebarPages" :active-page="activePage" :is-collapsed="isSidebarCollapsed" :is-mobile-open="isMobileMenuOpen" @toggle="toggleSidebar" @switch="switchPage" />

        <main :class="['admin-main', { 'sidebar-collapsed': isSidebarCollapsed }]">
            <AdminHeader :page-name="currentPageName" :has-changes="hasChanges" :is-saving="isSaving" :show-save-button="showHeaderSaveButton" :show-discard-button="showHeaderDiscardButton" :tabs="headerTabs" :active-tab="currentActiveTab" @save="handleGlobalSave" @discard="handleGlobalDiscard" @tab-change="handleTabChange" @toggle-menu="toggleSidebar" />

            <div class="admin-content">
                <div v-if="loading" class="loading-state">
                    <div class="spinner" />
                    <p>Đang tải dữ liệu...</p>
                </div>

                <template v-else-if="!isCollectionPage">
                    <ClientOnly v-if="activeContentTab === 'live'">
                        <LiveEditView ref="liveEditRef" :page-key="activePage" @dirty-change="liveEditDirty = $event" @saving-change="isSaving = $event" />
                    </ClientOnly>

                    <SettingsView v-else ref="settingsRef" :key="activePage" :page-key="activePage" :page-name="currentPageName" :config-path="currentConfigPath" :schema-type="currentSchemaType" :readonly="false" @dirty-change="settingsDirty = $event" @saving-change="isSaving = $event" />
                </template>

                <div v-else-if="currentConfig" class="editor-container">
                    <div v-if="isCollectionPage" class="collection-page">
                        <ItemsManager v-if="activeTab === 'items'" :items="itemsList" :columns="itemColumns" :item-config="itemConfigForList" :list-config="listConfig || undefined" @add="openAddModal" @edit="openEditModal" @delete="handleDelete" @manage-categories="openCategoriesManager" @manage-tags="openTagsManager" />

                        <SettingsView v-else ref="collectionSettingsRef" :key="activePage" :page-key="activePage" :page-name="currentPageName" :config-path="currentConfigPath" :schema-type="currentSchemaType" :readonly="true" @dirty-change="settingsDirty = $event" @saving-change="isSaving = $event" />
                    </div>
                </div>
            </div>
        </main>

        <ItemEditor v-if="detailConfig" :is-open="isEditorOpen" :is-new="isNewItem" :item-name="getCollectionName" :config="detailConfig" :initial-data="editingItem" @close="closeEditor" @save="handleSaveItem" />

        <ConfigManager v-if="detailConfig" :is-open="isConfigOpen" :collection-path="detailConfig.path" :initial-tab="configTab" @close="isConfigOpen = false" />
    </div>
</template>

<script setup lang="ts">
import AdminSidebar from "./components/layouts/AdminSidebar.vue";
import AdminHeader from "./components/layouts/AdminHeader.vue";
import ItemsManager from "./components/collection/ItemsManager.vue";
import ItemEditor from "./components/collection/ItemEditor.vue";
import ConfigManager from "./components/collection/ConfigManager.vue";
import LiveEditView from "./components/views/LiveEditView.vue";
import SettingsView from "./components/views/SettingsView.vue";
import { PAGE_CONFIGS, getAllPages, getPageConfig, isCollectionPage as checkIsCollection, getListingConfig, getDetailConfig } from "./config/page.config";
import { useCollectionContext } from "./composables/useCollectionContext";
import { usePreviewContext } from "./composables/usePreviewContext";

const sidebarPages = computed(() => {
    return getAllPages().map((page) => ({
        key: page.key,
        name: page.pageName,
        icon: page.icon || "mdi:circle-small",
        type: page.configType === "detail" ? "collection" : "page",
    }));
});

const activePage = ref("home");
const activeTab = ref<"items" | "settings">("items");
const activeContentTab = ref<"live" | "settings">("live");
const formData = ref<Record<string, Record<string, Record<string, unknown>>>>({});
const collapsedSections = ref<Record<string, boolean>>({});
const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = ref(false);
const liveEditDirty = ref(false);
const settingsDirty = ref(false);
const isSaving = ref(false);
const loading = ref(false);

const hasChanges = computed(() => {
    if (isCollectionPage.value) return false;
    return activeContentTab.value === 'live' ? liveEditDirty.value : settingsDirty.value;
});

const liveEditRef = ref<{ handleSave: () => Promise<void>; handleDiscard: () => void } | null>(null);
const settingsRef = ref<{ handleSave: () => Promise<void>; handleDiscard: () => Promise<void> } | null>(null);
const collectionSettingsRef = ref<{ handleSave: () => Promise<void>; handleDiscard: () => Promise<void> } | null>(null);

const isEditorOpen = ref(false);
const isNewItem = ref(true);
const editingItem = ref<Record<string, unknown>>({});

const isConfigOpen = ref(false);
const configTab = ref<"categories" | "tags">("categories");

const collectionContext = shallowRef<ReturnType<typeof useCollectionContext> | null>(null);
const previewContext = shallowRef<ReturnType<typeof usePreviewContext> | null>(null);
const itemsList = computed(() => previewContext.value?.previews?.value || []);

const firstKey = Object.keys(PAGE_CONFIGS)[0] as string;
const currentConfig = computed(() => getPageConfig(activePage.value) || PAGE_CONFIGS[firstKey]);
const currentPageName = computed(() => currentConfig.value?.pageName || "");
const isCollectionPage = computed(() => checkIsCollection(activePage.value));
const currentConfigPath = computed(() => currentConfig.value?.path || "");
const currentSchemaType = computed(() => (currentConfig.value as any)?.schemaType || "home");

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
    if (isCollectionPage.value) return false;
    return true;
});

const showHeaderDiscardButton = computed(() => {
    if (isCollectionPage.value) return false;
    return true;
});

const handleTabChange = (key: string) => {
    if (isCollectionPage.value) {
        activeTab.value = key as "items" | "settings";
        return;
    }

    const currentDirty = activeContentTab.value === 'live' ? liveEditDirty.value : settingsDirty.value;

    if (currentDirty) {
        const confirmed = window.confirm('Bạn có thay đổi chưa lưu. Bạn có muốn hủy không?');
        if (!confirmed) return;

        if (activeContentTab.value === 'live') {
            liveEditRef.value?.handleDiscard();
            liveEditDirty.value = false;
        } else {
            settingsRef.value?.handleDiscard();
            settingsDirty.value = false;
        }
    }

    activeContentTab.value = key as "live" | "settings";
};

const handleGlobalDiscard = async () => {
    if (activeContentTab.value === 'live') {
        liveEditRef.value?.handleDiscard();
        liveEditDirty.value = false;
    } else {
        await settingsRef.value?.handleDiscard();
        settingsDirty.value = false;
    }
};

const switchPage = (pageKey: string) => {
    const currentDirty = activeContentTab.value === 'live' ? liveEditDirty.value : settingsDirty.value;

    if (currentDirty && !isCollectionPage.value) {
        const confirmed = window.confirm('Bạn có thay đổi chưa lưu. Bạn có muốn hủy không?');
        if (!confirmed) return;

        if (activeContentTab.value === 'live') {
            liveEditRef.value?.handleDiscard();
            liveEditDirty.value = false;
        } else {
            settingsRef.value?.handleDiscard();
            settingsDirty.value = false;
        }
    }

    activePage.value = pageKey;
    activeTab.value = checkIsCollection(pageKey) ? "items" : "settings";
    activeContentTab.value = "live";
    isMobileMenuOpen.value = false;
    loadPageData();
};

const handleGlobalSave = async () => {
    if (isCollectionPage.value) {
        if (activeTab.value === "settings") {
            await collectionSettingsRef.value?.handleSave();
            settingsDirty.value = false;
        }
        return;
    }

    if (activeContentTab.value === "live") {
        await liveEditRef.value?.handleSave();
        liveEditDirty.value = false;
    } else {
        await settingsRef.value?.handleSave();
        settingsDirty.value = false;
    }
};

const loadPageData = async () => {
    loading.value = true;
    try {
        if (isCollectionPage.value && detailConfig.value?.path) {
            collectionContext.value = useCollectionContext({
                path: detailConfig.value.path,
                itemFields: detailConfig.value.itemFields,
            });
            previewContext.value = usePreviewContext(detailConfig.value.path);
            await previewContext.value.loadPreviews();
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
    liveEditDirty.value = true;
};

const saveForm = () => {
    console.log("Saving form data:", formData.value);
    liveEditDirty.value = false;
    alert("Đã lưu thành công!");
};

const openAddModal = () => {
    isNewItem.value = true;
    editingItem.value = detailConfig.value?.defaultValues ? { ...detailConfig.value.defaultValues } : {};
    isEditorOpen.value = true;
};

const openEditModal = async (item: Record<string, unknown>) => {
    isNewItem.value = false;

    if (!collectionContext.value) return;

    loading.value = true;
    try {
        const fullItem = await collectionContext.value.getItem(item.id as string);
        editingItem.value = fullItem ? { ...fullItem } : { ...item };
        isEditorOpen.value = true;
    } catch (error) {
        console.error("[Admin] Load item detail error:", error);
        editingItem.value = { ...item };
        isEditorOpen.value = true;
    } finally {
        loading.value = false;
    }
};

const closeEditor = () => {
    isEditorOpen.value = false;
    editingItem.value = {};
};

const openCategoriesManager = () => {
    configTab.value = "categories";
    isConfigOpen.value = true;
};

const openTagsManager = () => {
    configTab.value = "tags";
    isConfigOpen.value = true;
};

const handleSaveItem = async (data: Record<string, unknown>) => {
    if (!collectionContext.value) return;

    isSaving.value = true;
    try {
        if (isNewItem.value) {
            await collectionContext.value.addItem(data as any);
            alert("Đã thêm mới thành công!");
        } else {
            const id = data.id as string;
            const { id: _, ...updateData } = data;
            await collectionContext.value.updateItem(id, updateData as any);
            alert("Đã cập nhật thành công!");
        }
        closeEditor();
    } catch (error: any) {
        alert(error.message || "Có lỗi xảy ra!");
        console.error("[Admin] Save item error:", error);
    } finally {
        isSaving.value = false;
    }
};

const handleDelete = async (item: Record<string, unknown>) => {
    if (!collectionContext.value) return;

    if (confirm(`Xóa "${item.name || item.title}"?`)) {
        isSaving.value = true;
        try {
            await collectionContext.value.deleteItem(item.id as string);
            alert("Đã xóa thành công!");
        } catch (error: any) {
            alert(error.message || "Có lỗi xảy ra khi xóa!");
            console.error("[Admin] Delete item error:", error);
        } finally {
            isSaving.value = false;
        }
    }
};

onMounted(() => {
    loadPageData();
});
</script>

<style scoped>
@import "./styles/admin.css";
</style>
