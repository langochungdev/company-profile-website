// Composable quản lý CRUD cho collection items - useDetailContext
import { ref, type Ref } from "vue";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, type Firestore, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import { getFirestorePath } from "@/utils/firestore";

interface CollectionConfig {
    path: string;
    itemFields?: Record<string, any>;
    [key: string]: any;
}

interface CollectionItem {
    id: string;
    [key: string]: any;
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

export function useDetailContext(config: CollectionConfig): CollectionContentResult {
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
            const colRef = collection(db, collectionPath);

            const constraints: any[] = [];

            if (options.orderByField) {
                constraints.push(orderBy(options.orderByField, options.orderDirection || "asc"));
            }

            if (options.limitCount) {
                constraints.push(limit(options.limitCount));
            }

            if (options.lastDoc) {
                constraints.push(startAfter(options.lastDoc));
            }

            const q = constraints.length > 0 ? query(colRef, ...constraints) : query(colRef);
            const snapshot = await getDocs(q);

            const loadedItems: CollectionItem[] = [];
            snapshot.forEach((docSnap) => {
                loadedItems.push({
                    id: docSnap.id,
                    ...docSnap.data(),
                });
            });

            if (options.lastDoc) {
                items.value = [...items.value, ...loadedItems];
            } else {
                items.value = loadedItems;
            }

            totalItems.value = items.value.length;

            if (snapshot.docs.length > 0) {
                lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
            }
        } catch (e) {
            error.value = e as Error;
            console.error("[useDetailContext] loadItems error:", e);
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

        if (itemData.slug && checkDuplicateSlug(itemData.slug)) {
            throw new Error(`Slug "${itemData.slug}" đã tồn tại! Vui lòng chọn slug khác.`);
        }

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const collectionPath = getCollectionPath();
            const colRef = collection(db, collectionPath);

            const docRef = await addDoc(colRef, {
                ...itemData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            const newItem: CollectionItem = {
                id: docRef.id,
                ...itemData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            items.value = [...items.value, newItem];
            totalItems.value = items.value.length;

            return docRef.id;
        } catch (e) {
            error.value = e as Error;
            console.error("[useDetailContext] addItem error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateItem = async (id: string, data: Partial<CollectionItem>): Promise<void> => {
        if (import.meta.server) return;

        if (data.slug && checkDuplicateSlug(data.slug, id)) {
            throw new Error(`Slug "${data.slug}" đã tồn tại! Vui lòng chọn slug khác.`);
        }

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const collectionPath = getCollectionPath();
            const docRef = doc(db, collectionPath, id);

            const updateData = {
                ...data,
                updatedAt: new Date().toISOString(),
            };
            delete updateData.id;

            await updateDoc(docRef, updateData);

            const index = items.value.findIndex((item) => item.id === id);
            if (index !== -1) {
                items.value[index] = { ...items.value[index], ...updateData, id };
            }
        } catch (e) {
            error.value = e as Error;
            console.error("[useDetailContext] updateItem error:", e);
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
            const docRef = doc(db, collectionPath, id);

            await deleteDoc(docRef);

            items.value = items.value.filter((item) => item.id !== id);
            totalItems.value = items.value.length;
        } catch (e) {
            error.value = e as Error;
            console.error("[useDetailContext] deleteItem error:", e);
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
