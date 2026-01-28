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
                    <DashboardTabs v-if="activePage === 'dashboard'" />

                    <template v-else>
                        <ClientOnly v-if="activeContentTab === 'live'">
                            <LiveEditView :key="activePage" ref="liveEditRef" :page-key="activePage" @dirty-change="liveEditDirty = $event" @saving-change="isSaving = $event" />
                        </ClientOnly>

                        <SettingsView v-else ref="settingsRef" :key="activePage" :page-key="activePage" :page-name="currentPageName" :config-path="currentConfigPath" :schema-type="currentSchemaType" :readonly="false" @dirty-change="settingsDirty = $event" @saving-change="isSaving = $event" />
                    </template>
                </template>

                <div v-else-if="currentConfig" class="editor-container">
                    <div v-if="isCollectionPage" class="collection-page">
                        <template v-if="activeTab === 'items'">
                            <ProductPage v-if="activePage === 'product'" ref="productPageRef" />
                            <ServicePage v-else-if="activePage === 'service'" ref="servicePageRef" />
                            <PostPage v-else-if="activePage === 'post'" ref="postPageRef" />
                        </template>

                        <SettingsView v-else ref="collectionSettingsRef" :key="activePage" :page-key="activePage" :page-name="currentPageName" :config-path="currentConfigPath" :schema-type="currentSchemaType" :readonly="true" @dirty-change="settingsDirty = $event" @saving-change="isSaving = $event" />
                    </div>
                </div>
            </div>
        </main>

        <Toast />
    </div>
</template>

<script setup lang="ts">
import AdminSidebar from './components/layouts/AdminSidebar.vue'
import AdminHeader from './components/layouts/AdminHeader.vue'
import ProductPage from './components/collection/products/index.vue'
import ServicePage from './components/collection/services/index.vue'
import PostPage from './components/collection/posts/index.vue'
import LiveEditView from './components/views/LiveEditView.vue'
import SettingsView from './components/views/SettingsView.vue'
import DashboardTabs from './components/dashboard/DashboardTabs.vue'
import { PAGE_CONFIGS, getAllPages, getPageConfig, isCollectionPage as checkIsCollection } from './config/page.config'
import Toast from './components/Toast.vue'

const route = useRoute();
const router = useRouter();

const sidebarPages = computed(() => {
    return getAllPages().map((page) => ({
        key: page.key,
        name: page.pageName,
        icon: page.icon || "mdi:circle-small",
        type: page.configType === "detail" ? "collection" : "page",
    }));
});

const getInitialPage = (): string => {
    const urlPage = route.query.page as string;
    if (urlPage && PAGE_CONFIGS[urlPage]) return urlPage;
    return "dashboard";
};

const getInitialTab = (pageKey: string): "items" | "settings" => {
    const urlTab = route.query.tab as string;
    if (urlTab === "settings") return "settings";
    return checkIsCollection(pageKey) ? "items" : "settings";
};

const getInitialContentTab = (): "live" | "settings" => {
    const urlTab = route.query.tab as string;
    if (urlTab === "settings") return "settings";
    return "live";
};

const activePage = ref(getInitialPage());
const activeTab = ref<"items" | "settings">(getInitialTab(activePage.value));
const activeContentTab = ref<"live" | "settings">(getInitialContentTab());
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
const productPageRef = ref<{ loading: boolean; refresh: () => Promise<void> } | null>(null)
const servicePageRef = ref<{ loading: boolean; refresh: () => Promise<void> } | null>(null)
const postPageRef = ref<{ loading: boolean; refresh: () => Promise<void> } | null>(null)

const firstKey = Object.keys(PAGE_CONFIGS)[0] as string;
const currentConfig = computed(() => getPageConfig(activePage.value) || PAGE_CONFIGS[firstKey]);
const currentPageName = computed(() => currentConfig.value?.pageName || "");
const isCollectionPage = computed(() => checkIsCollection(activePage.value));
const currentConfigPath = computed(() => currentConfig.value?.path || "");
const currentSchemaType = computed(() => (currentConfig.value as any)?.schemaType || "home");

const getCollectionName = computed(() => {
    if (!isCollectionPage.value) return "";
    return currentConfig.value?.pageName || "Items";
});

interface TabItem {
    key: string
    label: string
    icon: string
    count?: number
}

const headerTabs = computed<TabItem[]>(() => {
    if (activePage.value === 'dashboard') {
        return [];
    }
    if (isCollectionPage.value) {
        return [
            { key: "items", label: getCollectionName.value, icon: currentConfig.value?.icon || "mdi:view-list" },
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
    if (activePage.value === 'dashboard') return false;
    if (isCollectionPage.value) return false;
    return true;
});

const showHeaderDiscardButton = computed(() => {
    if (activePage.value === 'dashboard') return false;
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

const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
    } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }
};

const syncUrlState = () => {
    const currentTab = isCollectionPage.value ? activeTab.value : activeContentTab.value;
    router.replace({
        query: {
            page: activePage.value,
            tab: currentTab,
        },
    });
};

watch([activePage, activeTab, activeContentTab], () => {
    syncUrlState();
});
</script>

<style scoped>
@import "./styles/admin.css";
</style>
