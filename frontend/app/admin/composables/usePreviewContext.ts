// Composable load preview collection cho listing pages

import { ref, type Ref } from "vue";
import type { Firestore, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { PreviewService, type PreviewQueryOptions } from "@/admin/services/preview.service";

interface PreviewItem {
    id: string;
    [key: string]: unknown;
}

interface LoadPreviewOptions {
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
    category?: string;
}

interface PreviewContextResult {
    previews: Ref<PreviewItem[]>;
    allPreviews: Ref<PreviewItem[]>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    totalPreviews: Ref<number>;
    hasMore: Ref<boolean>;
    loadPreviews: (options?: LoadPreviewOptions) => Promise<void>;
    loadAll: () => Promise<void>;
    loadMore: () => Promise<void>;
    filterByCategory: (category: string | null) => Promise<void>;
}

const DEFAULT_LIMIT = 10;

export function usePreviewContext(collectionPath: string): PreviewContextResult {
    const previews = ref<PreviewItem[]>([]);
    const allPreviews = ref<PreviewItem[]>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);
    const totalPreviews = ref(0);
    const hasMore = ref(true);
    let lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null;
    let currentCategory: string | null = null;
    let currentOrderBy = "updatedAt";
    let currentDirection: "asc" | "desc" = "desc";

    const getPreviewsPath = () => {
        const basePath = collectionPath.replace(/\/items$/, "/previews");
        return getFirestorePath(basePath);
    };

    const getDb = (): Firestore => {
        const { $db } = useNuxtApp();
        if (!$db) {
            throw new Error("Firebase not initialized");
        }
        return $db as Firestore;
    };

    const loadPreviews = async (options: LoadPreviewOptions = {}) => {
        if (import.meta.server) return;

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const previewsPath = getPreviewsPath();

            if (options.category) {
                currentCategory = options.category;
            }

            currentOrderBy = options.orderByField || "updatedAt";
            currentDirection = options.orderDirection || "desc";

            const queryOptions: PreviewQueryOptions = {
                orderByField: currentOrderBy,
                orderDirection: currentDirection,
                limitCount: options.limitCount || DEFAULT_LIMIT,
                lastDoc: options.lastDoc,
                category: options.category,
            };

            const result = await PreviewService.getAll<PreviewItem>(db, previewsPath, queryOptions);

            if (options.lastDoc) {
                previews.value = [...previews.value, ...result.items];
            } else {
                previews.value = result.items;
            }

            totalPreviews.value = previews.value.length;
            hasMore.value = result.hasMore;
            lastVisibleDoc = result.lastDoc;
        } catch (e) {
            error.value = e as Error;
            console.error("[usePreviewContext] loadPreviews error:", e);
        } finally {
            loading.value = false;
        }
    };

    const loadMore = async () => {
        if (!hasMore.value || loading.value || !lastVisibleDoc) return;

        await loadPreviews({
            orderByField: currentOrderBy,
            orderDirection: currentDirection,
            category: currentCategory || undefined,
            lastDoc: lastVisibleDoc,
        });
    };

    const filterByCategory = async (category: string | null) => {
        currentCategory = category;
        lastVisibleDoc = null;
        hasMore.value = true;

        await loadPreviews({
            orderByField: currentOrderBy,
            orderDirection: currentDirection,
        });
    };

    const loadAll = async () => {
        if (import.meta.server) return;

        try {
            const db = getDb();
            const previewsPath = getPreviewsPath();

            const queryOptions: PreviewQueryOptions = {
                orderByField: "updatedAt",
                orderDirection: "desc",
                limitCount: 999,
            };

            const result = await PreviewService.getAll<PreviewItem>(db, previewsPath, queryOptions);
            allPreviews.value = result.items;
        } catch (e) {
            console.error("[usePreviewContext] loadAll error:", e);
        }
    };

    return {
        previews,
        allPreviews,
        loading,
        error,
        totalPreviews,
        hasMore,
        loadPreviews,
        loadAll,
        loadMore,
        filterByCategory,
    };
}
