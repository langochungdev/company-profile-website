// Composable quản lý Listing Settings - useListingContext
import { ref, type Ref } from "vue";
import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";
import { getFirestorePath } from "@/utils/firestore";
import type { ListingSettings } from "@/pages/dev/config-page/demo-collection/collection.config";

interface ListingSettingsResult {
    settings: Ref<ListingSettings | null>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    loadSettings: () => Promise<void>;
    saveSettings: () => Promise<void>;
    updateSetting: <K extends keyof ListingSettings>(section: K, key: keyof ListingSettings[K], value: any) => void;
}

const defaultSettings: ListingSettings = {
    layout: {
        gridColumns: 3,
        itemsPerPage: 9,
        cardStyle: "grid",
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
        title: "",
        subtitle: "",
        image: "",
    },
    seo: {
        pageTitle: "",
        metaDescription: "",
        ogImage: "",
    },
};

export function useListingContext(collectionPath: string): ListingSettingsResult {
    const settings = ref<ListingSettings | null>(null);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const getSettingsPath = () => {
        const basePath = collectionPath.replace(/\/items$/, "");
        return getFirestorePath(basePath);
    };

    const getDb = (): Firestore => {
        const { $db } = useNuxtApp();
        if (!$db) {
            throw new Error("Firebase not initialized");
        }
        return $db as Firestore;
    };

    const loadSettings = async () => {
        if (import.meta.server) return;

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const settingsPath = getSettingsPath();
            const docRef = doc(db, settingsPath);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().settings) {
                settings.value = docSnap.data().settings as ListingSettings;
            } else {
                settings.value = { ...defaultSettings };
            }
        } catch (e) {
            error.value = e as Error;
            settings.value = { ...defaultSettings };
        } finally {
            loading.value = false;
        }
    };

    const saveSettings = async () => {
        if (import.meta.server) return;
        if (!settings.value) {
            error.value = new Error("No settings to save");
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const settingsPath = getSettingsPath();
            const docRef = doc(db, settingsPath);
            await setDoc(docRef, { settings: settings.value }, { merge: true });
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateSetting = <K extends keyof ListingSettings>(section: K, key: keyof ListingSettings[K], value: any) => {
        if (!settings.value) return;
        (settings.value[section] as any)[key] = value;
    };

    return {
        settings,
        loading,
        error,
        loadSettings,
        saveSettings,
        updateSetting,
    };
}
