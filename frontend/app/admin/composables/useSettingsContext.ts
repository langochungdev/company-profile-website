// Composable quản lý Settings (SEO, OpenGraph, Schema) cho admin panel

import { ref, type Ref } from "vue";
import type { Firestore } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { SettingsService } from "@/admin/services/settings.service";
import { DEFAULT_SETTINGS, type SettingsData } from "@/admin/config/settings.config";

interface SettingsContextResult {
    settings: Ref<SettingsData>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    isDirty: Ref<boolean>;
    loadSettings: () => Promise<void>;
    saveSettings: () => Promise<void>;
    updateSeoField: (key: string, value: string) => void;
    updateOgField: (key: string, value: string) => void;
    updateSchemaConfig: (key: string, value: unknown) => void;
    updateSchemaFieldMapping: (key: string, value: string) => void;
    resetToDefaults: () => void;
}

export function useSettingsContext(configPath: string): SettingsContextResult {
    const settings = ref<SettingsData>(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
    const originalSettings = ref<SettingsData>(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const isDirty = computed(() => JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value));

    const getSettingsPath = () => {
        let path = configPath;
        if (path.endsWith("/items")) {
            path = path.replace(/\/items$/, "");
        }
        if (path.endsWith("/previews")) {
            path = path.replace(/\/previews$/, "");
        }
        return getFirestorePath(path);
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
            const data = await SettingsService.get<SettingsData>(db, settingsPath);

            if (data) {
                settings.value = {
                    seo: { ...DEFAULT_SETTINGS.seo, ...data.seo },
                    openGraph: { ...DEFAULT_SETTINGS.openGraph, ...data.openGraph },
                    schema: {
                        config: { ...DEFAULT_SETTINGS.schema.config, ...(data.schema?.config || {}) },
                        fieldMapping: { ...DEFAULT_SETTINGS.schema.fieldMapping, ...(data.schema?.fieldMapping || {}) },
                    },
                };
                originalSettings.value = JSON.parse(JSON.stringify(settings.value));
            }
        } catch (e) {
            error.value = e as Error;
            console.error("[useSettingsContext] loadSettings error:", e);
        } finally {
            loading.value = false;
        }
    };

    const saveSettings = async () => {
        if (import.meta.server) return;

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const settingsPath = getSettingsPath();
            await SettingsService.save(db, settingsPath, settings.value);
            originalSettings.value = JSON.parse(JSON.stringify(settings.value));
        } catch (e) {
            error.value = e as Error;
            console.error("[useSettingsContext] saveSettings error:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateSeoField = (key: string, value: string) => {
        (settings.value.seo as Record<string, string>)[key] = value;
    };

    const updateOgField = (key: string, value: string) => {
        (settings.value.openGraph as Record<string, string>)[key] = value;
    };

    const updateSchemaConfig = (key: string, value: unknown) => {
        settings.value.schema.config[key] = value;
    };

    const updateSchemaFieldMapping = (key: string, value: string) => {
        settings.value.schema.fieldMapping[key] = value;
    };

    const resetToDefaults = () => {
        settings.value = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    };

    return {
        settings,
        loading,
        error,
        isDirty,
        loadSettings,
        saveSettings,
        updateSeoField,
        updateOgField,
        updateSchemaConfig,
        updateSchemaFieldMapping,
        resetToDefaults,
    };
}
