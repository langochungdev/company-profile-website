// Composable fetch dữ liệu trang từ Firestore cho public pages

import { ref, type Ref } from "vue";
import type { Firestore } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { PageService } from "@/admin/services/page.service";

interface UsePageDataResult<T> {
    data: Ref<T | null>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    loadData: () => Promise<void>;
}

export function usePageData<T extends Record<string, unknown>>(pagePath: string): UsePageDataResult<T> {
    const data = ref<T | null>(null) as Ref<T | null>;
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const loadData = async () => {
        if (import.meta.server) return;

        loading.value = true;
        error.value = null;

        try {
            const { $db } = useNuxtApp();
            if (!$db) {
                throw new Error("Firebase not initialized");
            }

            const firestorePath = getFirestorePath(pagePath);
            const result = await PageService.get<T>($db as Firestore, firestorePath);

            if (result) {
                data.value = result;
            }
        } catch (e) {
            error.value = e as Error;
            console.error("Failed to load page data:", e);
        } finally {
            loading.value = false;
        }
    };

    return {
        data,
        loading,
        error,
        loadData,
    };
}
