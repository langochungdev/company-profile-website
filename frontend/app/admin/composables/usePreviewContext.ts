// Composable load preview collection cho listing pages

import { ref, type Ref } from "vue";
import { collection, getDocs, query, orderBy, limit, startAfter, where, type Firestore, type DocumentData, type QueryDocumentSnapshot, type QueryConstraint } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";

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
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    totalPreviews: Ref<number>;
    hasMore: Ref<boolean>;
    loadPreviews: (options?: LoadPreviewOptions) => Promise<void>;
    loadMore: () => Promise<void>;
    filterByCategory: (category: string | null) => Promise<void>;
}

const DEFAULT_LIMIT = 12;

export function usePreviewContext(collectionPath: string): PreviewContextResult {
    const previews = ref<PreviewItem[]>([]);
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
            const colRef = collection(db, previewsPath);

            const constraints: QueryConstraint[] = [];

            if (options.category) {
                currentCategory = options.category;
                constraints.push(where("category", "==", options.category));
            }

            currentOrderBy = options.orderByField || "updatedAt";
            currentDirection = options.orderDirection || "desc";
            constraints.push(orderBy(currentOrderBy, currentDirection));

            const limitCount = options.limitCount || DEFAULT_LIMIT;
            constraints.push(limit(limitCount));

            if (options.lastDoc) {
                constraints.push(startAfter(options.lastDoc));
            }

            const q = query(colRef, ...constraints);
            const snapshot = await getDocs(q);

            const loadedPreviews: PreviewItem[] = [];
            snapshot.forEach((docSnap) => {
                loadedPreviews.push({
                    id: docSnap.id,
                    ...docSnap.data(),
                });
            });

            if (options.lastDoc) {
                previews.value = [...previews.value, ...loadedPreviews];
            } else {
                previews.value = loadedPreviews;
            }

            totalPreviews.value = previews.value.length;
            hasMore.value = loadedPreviews.length >= limitCount;

            if (snapshot.docs.length > 0) {
                lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
            } else {
                hasMore.value = false;
            }
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
            category: category || undefined,
        });
    };

    return {
        previews,
        loading,
        error,
        totalPreviews,
        hasMore,
        loadPreviews,
        loadMore,
        filterByCategory,
    };
}
