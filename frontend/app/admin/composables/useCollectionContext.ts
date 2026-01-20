// Composable quản lý CRUD cho collection items với auto-sync preview

import { ref, type Ref } from "vue";
import type { Firestore, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { extractPreview } from "@/admin/utils/preview-extractor";
import { CollectionService, type CollectionQueryOptions } from "@/admin/services/collection.service";
import type { FieldConfig } from "@/admin/config/page.config";

interface CollectionConfig {
    path: string;
    itemFields?: Record<string, FieldConfig>;
    [key: string]: unknown;
}

interface CollectionItem {
    id: string;
    [key: string]: unknown;
}

interface CollectionContentResult {
    items: Ref<CollectionItem[]>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    totalItems: Ref<number>;
    loadItems: (options?: LoadOptions) => Promise<void>;
    addItem: (item: Omit<CollectionItem, "id">) => Promise<string>;
    updateItem: (id: string, data: Partial<CollectionItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    getItem: (id: string) => CollectionItem | undefined;
    checkDuplicateSlug: (slug: string, excludeId?: string) => boolean;
}

interface LoadOptions {
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

export function useCollectionContext(config: CollectionConfig): CollectionContentResult {
    const items = ref<CollectionItem[]>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);
    const totalItems = ref(0);
    let lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null;

    const getCollectionPath = () => {
        if (!config.path) {
            throw new Error("Collection config missing 'path' property");
        }
        return getFirestorePath(config.path);
    };

    const getPreviewsPath = () => {
        const itemsPath = getCollectionPath();
        return itemsPath.replace(/\/items$/, "/previews");
    };

    const getDb = (): Firestore => {
        const { $db } = useNuxtApp();
        if (!$db) {
            throw new Error("Firebase not initialized");
        }
        return $db as Firestore;
    };

    const loadItems = async (options: LoadOptions = {}) => {
        if (import.meta.server) return;

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const collectionPath = getCollectionPath();

            const queryOptions: CollectionQueryOptions = {
                orderByField: options.orderByField,
                orderDirection: options.orderDirection,
                limitCount: options.limitCount,
                lastDoc: options.lastDoc,
            };

            const result = await CollectionService.getAll<CollectionItem>(db, collectionPath, queryOptions);

            if (options.lastDoc) {
                items.value = [...items.value, ...result.items];
            } else {
                items.value = result.items;
            }

            totalItems.value = items.value.length;
            lastVisibleDoc = result.lastDoc;
        } catch (e) {
            error.value = e as Error;
            console.error("[useCollectionContext] loadItems error:", e);
        } finally {
            loading.value = false;
        }
    };

    const checkDuplicateSlug = (slug: string, excludeId?: string): boolean => {
        if (!slug) return false;
        const trimmedSlug = slug.trim();
        return items.value.some((item) => {
            if (excludeId && item.id === excludeId) return false;
            return item.slug === trimmedSlug;
        });
    };

    const addItem = async (itemData: Omit<CollectionItem, "id">): Promise<string> => {
        if (import.meta.server) return "";

        if (itemData.slug && checkDuplicateSlug(itemData.slug as string)) {
            throw new Error(`Slug "${itemData.slug}" đã tồn tại! Vui lòng chọn slug khác.`);
        }

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const collectionPath = getCollectionPath();
            const previewsPath = getPreviewsPath();

            let previewData: Record<string, unknown> | undefined;
            if (config.itemFields) {
                previewData = extractPreview(itemData as Record<string, unknown>, config.itemFields);
            }

            const docId = await CollectionService.create(db, collectionPath, itemData as Record<string, unknown>, config.itemFields ? previewsPath : undefined, previewData);

            const timestamp = new Date().toISOString();
            const newItem: CollectionItem = {
                id: docId,
                ...itemData,
                createdAt: timestamp,
                updatedAt: timestamp,
            };

            items.value = [...items.value, newItem];
            totalItems.value = items.value.length;

            return docId;
        } catch (e) {
            error.value = e as Error;
            console.error("[useCollectionContext] addItem error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateItem = async (id: string, data: Partial<CollectionItem>): Promise<void> => {
        if (import.meta.server) return;

        if (data.slug && checkDuplicateSlug(data.slug as string, id)) {
            throw new Error(`Slug "${data.slug}" đã tồn tại! Vui lòng chọn slug khác.`);
        }

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const collectionPath = getCollectionPath();
            const previewsPath = getPreviewsPath();

            const existingItem = items.value.find((item) => item.id === id);
            const fullItem = { ...existingItem, ...data, id };

            let previewData: Record<string, unknown> | undefined;
            if (config.itemFields) {
                previewData = extractPreview(fullItem as Record<string, unknown>, config.itemFields);
            }

            await CollectionService.update(db, collectionPath, id, data as Record<string, unknown>, config.itemFields ? previewsPath : undefined, previewData);

            const index = items.value.findIndex((item) => item.id === id);
            if (index !== -1) {
                const timestamp = new Date().toISOString();
                items.value[index] = { ...fullItem, updatedAt: timestamp } as CollectionItem;
            }
        } catch (e) {
            error.value = e as Error;
            console.error("[useCollectionContext] updateItem error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const deleteItem = async (id: string): Promise<void> => {
        if (import.meta.server) return;

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const collectionPath = getCollectionPath();
            const previewsPath = getPreviewsPath();

            await CollectionService.delete(db, collectionPath, id, config.itemFields ? previewsPath : undefined);

            items.value = items.value.filter((item) => item.id !== id);
            totalItems.value = items.value.length;
        } catch (e) {
            error.value = e as Error;
            console.error("[useCollectionContext] deleteItem error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const getItem = (id: string): CollectionItem | undefined => {
        return items.value.find((item) => item.id === id);
    };

    return {
        items,
        loading,
        error,
        totalItems,
        loadItems,
        addItem,
        updateItem,
        deleteItem,
        getItem,
        checkDuplicateSlug,
    };
}
