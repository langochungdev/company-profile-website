// Composable quản lý single page document

import { ref, type Ref } from "vue";
import type { Firestore } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { PageService } from "@/admin/services/page.service";
import type { PageConfig, SectionConfig, FieldConfig } from "@/admin/config/page.config";

interface PageContentResult {
    data: Ref<Record<string, any> | null>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    loadData: () => Promise<void>;
    updateField: (fieldPath: string, value: any) => void;
    saveData: () => Promise<void>;
    resetToDefaults: () => void;
}

function generateDefaults(config: PageConfig): Record<string, any> {
    const defaults: Record<string, any> = {};

    Object.entries(config.sections).forEach(([sectionKey, section]) => {
        defaults[sectionKey] = generateSectionDefaults(section);
    });

    return defaults;
}

function generateSectionDefaults(section: SectionConfig): Record<string, any> {
    const sectionData: Record<string, any> = {};

    Object.entries(section.fields).forEach(([fieldKey, field]) => {
        sectionData[fieldKey] = generateFieldDefault(field);
    });

    return sectionData;
}

function generateFieldDefault(field: FieldConfig): any {
    if (field.default !== undefined) {
        return field.default;
    }

    switch (field.type) {
        case "text":
        case "textarea":
        case "richtext":
            return "";

        case "number":
            return field.min ?? 0;

        case "boolean":
            return false;

        case "select":
            if (field.options && field.options.length > 0) {
                const firstOption = field.options[0];
                return typeof firstOption === "string" ? firstOption : (firstOption?.value ?? "");
            }
            return "";

        case "image":
        case "video":
            return "";

        case "date":
            return new Date().toISOString().split("T")[0];

        case "color":
            return "#000000";

        case "array":
            const count = field.exact ?? field.min ?? 0;
            const items = [];

            for (let i = 0; i < count; i++) {
                if (field.schema) {
                    const item: Record<string, any> = {};
                    Object.entries(field.schema).forEach(([key, subField]) => {
                        item[key] = generateFieldDefault(subField as FieldConfig);
                    });
                    items.push(item);
                }
            }
            return items;

        case "group":
            if (field.fields) {
                const groupData: Record<string, any> = {};
                Object.entries(field.fields).forEach(([key, subField]) => {
                    groupData[key] = generateFieldDefault(subField as FieldConfig);
                });
                return groupData;
            }
            return {};

        default:
            return null;
    }
}

export function usePageContext(config: PageConfig): PageContentResult {
    const data = ref<Record<string, any> | null>(null);
    const loading = ref(false);
    const error = ref<Error | null>(null);
    const defaults = generateDefaults(config);

    const getDb = (): Firestore => {
        const { $db } = useNuxtApp();
        if (!$db) {
            throw new Error("Firebase not initialized");
        }
        return $db as Firestore;
    };

    const loadData = async () => {
        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const firestorePath = getFirestorePath(config.path);
            const result = await PageService.get<Record<string, any>>(db, firestorePath);

            if (result) {
                data.value = result;
            } else {
                data.value = { ...defaults };
            }
        } catch (e) {
            error.value = e as Error;
            data.value = { ...defaults };
        } finally {
            loading.value = false;
        }
    };

    const updateField = (fieldPath: string, value: any) => {
        if (!data.value) return;

        const keys = fieldPath.split(".");
        let current: any = data.value;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!key) continue;

            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }

        const lastKey = keys[keys.length - 1];
        if (lastKey !== undefined) {
            current[lastKey] = value;
        }
    };

    const saveData = async () => {
        if (!data.value) {
            error.value = new Error("No data to save");
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            const db = getDb();
            const firestorePath = getFirestorePath(config.path);
            await PageService.save(db, firestorePath, data.value);
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const resetToDefaults = () => {
        data.value = { ...defaults };
    };

    return {
        data,
        loading,
        error,
        loadData,
        updateField,
        saveData,
        resetToDefaults,
    };
}
