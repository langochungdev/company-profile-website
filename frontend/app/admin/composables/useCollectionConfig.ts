// Composable quản lý config (categories, tags) cho collection

import { ref, type Ref } from "vue";
import type { Firestore } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { ConfigService, type ConfigItem, type CollectionConfig } from "@/admin/services/config.service";

interface UseCollectionConfigResult {
    config: Ref<CollectionConfig>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    loadConfig: () => Promise<void>;
    addCategory: (name: string) => Promise<string>;
    updateCategory: (id: string, name: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addTag: (name: string) => Promise<string>;
    updateTag: (id: string, name: string) => Promise<void>;
    deleteTag: (id: string) => Promise<void>;
    getCategoryOptions: () => { value: string; label: string }[];
    getTagOptions: () => { value: string; label: string }[];
}

export function useCollectionConfig(collectionPath: string): UseCollectionConfigResult {
    const config = ref<CollectionConfig>({ categories: [], tags: [] });
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const getDb = (): Firestore => {
        const { $db } = useNuxtApp();
        if (!$db) {
            throw new Error("Firebase not initialized");
        }
        return $db as Firestore;
    };

    const getFullPath = () => getFirestorePath(collectionPath);

    const loadConfig = async () => {
        if (import.meta.server) return;

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const path = getFullPath();
            config.value = await ConfigService.getConfig(db, path);
        } catch (e) {
            error.value = e as Error;
            console.error("[useCollectionConfig] loadConfig error:", e);
        } finally {
            loading.value = false;
        }
    };

    const addCategory = async (name: string): Promise<string> => {
        const db = getDb();
        const path = getFullPath();
        const id = await ConfigService.addCategory(db, path, name);
        config.value.categories.push({ id, name });
        return id;
    };

    const updateCategory = async (id: string, name: string): Promise<void> => {
        const db = getDb();
        const path = getFullPath();
        await ConfigService.updateCategory(db, path, id, name);
        const index = config.value.categories.findIndex((c) => c.id === id);
        const item = config.value.categories[index];
        if (index !== -1 && item) {
            item.name = name;
        }
    };

    const deleteCategory = async (id: string): Promise<void> => {
        const db = getDb();
        const path = getFullPath();
        await ConfigService.deleteCategory(db, path, id);
        config.value.categories = config.value.categories.filter((c) => c.id !== id);
    };

    const addTag = async (name: string): Promise<string> => {
        const db = getDb();
        const path = getFullPath();
        const id = await ConfigService.addTag(db, path, name);
        config.value.tags.push({ id, name });
        return id;
    };

    const updateTag = async (id: string, name: string): Promise<void> => {
        const db = getDb();
        const path = getFullPath();
        await ConfigService.updateTag(db, path, id, name);
        const index = config.value.tags.findIndex((t) => t.id === id);
        const item = config.value.tags[index];
        if (index !== -1 && item) {
            item.name = name;
        }
    };

    const deleteTag = async (id: string): Promise<void> => {
        const db = getDb();
        const path = getFullPath();
        await ConfigService.deleteTag(db, path, id);
        config.value.tags = config.value.tags.filter((t) => t.id !== id);
    };

    const getCategoryOptions = () => {
        return config.value.categories.map((c) => ({ value: c.id, label: c.name }));
    };

    const getTagOptions = () => {
        return config.value.tags.map((t) => ({ value: t.id, label: t.name }));
    };

    return {
        config,
        loading,
        error,
        loadConfig,
        addCategory,
        updateCategory,
        deleteCategory,
        addTag,
        updateTag,
        deleteTag,
        getCategoryOptions,
        getTagOptions,
    };
}
