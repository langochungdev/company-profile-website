/**
 * Composable: Live Edit Mode cho Admin Panel
 */

import { ref, computed, watch, toValue, type MaybeRef } from "vue";
import { getPageConfig, type PageConfig, type FieldConfig } from "../config/page.config";
import { usePendingUploads } from "./usePendingUploads";
import { useDeleteQueue } from "./useDeleteQueue";
import { normalizeImageData } from "@/admin/utils/normalizeData";
import { PageService } from "@/admin/services/page.service";
import { getFirestorePath } from "@/admin/utils/firestore";
import type { Firestore } from "firebase/firestore";

export interface EditTarget {
    sectionId: string;
    fieldPath: string;
    fieldConfig: FieldConfig;
    currentValue: unknown;
}

export const useLiveEdit = (pageKeyRef: MaybeRef<string>) => {
    const config = computed(() => getPageConfig(toValue(pageKeyRef)));
    const originalData = ref<Record<string, Record<string, unknown>>>({});
    const editedData = ref<Record<string, Record<string, unknown>>>({});
    const isSaving = ref(false);
    const isLoading = ref(false);
    const editTarget = ref<EditTarget | null>(null);
    const isPopupOpen = ref(false);

    const isDirty = computed(() => JSON.stringify(originalData.value) !== JSON.stringify(editedData.value));

    const initializeData = () => {
        if (!config.value?.sections) return;

        const data: Record<string, Record<string, unknown>> = {};

        Object.entries(config.value.sections).forEach(([sectionId, section]) => {
            data[sectionId] = {};
            if (section.fields) {
                Object.entries(section.fields).forEach(([fieldKey, field]) => {
                    data[sectionId]![fieldKey] = field.default ?? getDefaultValue(field.type);
                });
            }
        });

        originalData.value = JSON.parse(JSON.stringify(data));
        editedData.value = JSON.parse(JSON.stringify(data));
    };

    const getDefaultValue = (type: string): unknown => {
        switch (type) {
            case "text":
            case "textarea":
            case "richtext":
            case "image":
            case "video":
            case "color":
                return "";
            case "number":
                return 0;
            case "boolean":
                return false;
            case "array":
                return [];
            case "group":
                return {};
            case "select":
                return "";
            default:
                return "";
        }
    };

    const loadData = async (externalData?: Record<string, Record<string, unknown>>) => {
        isLoading.value = true;
        try {
            initializeData();

            const pageConfig = config.value;
            if (pageConfig?.path) {
                const { $db } = useNuxtApp();
                const firestorePath = getFirestorePath(pageConfig.path);
                const firestoreData = await PageService.get<Record<string, Record<string, unknown>>>($db as Firestore, firestorePath);

                if (firestoreData) {
                    Object.entries(firestoreData).forEach(([sectionId, sectionData]) => {
                        if (editedData.value[sectionId]) {
                            editedData.value[sectionId] = { ...editedData.value[sectionId], ...sectionData };
                        } else {
                            editedData.value[sectionId] = sectionData;
                        }
                    });
                }
            }

            if (externalData) {
                Object.entries(externalData).forEach(([sectionId, sectionData]) => {
                    if (editedData.value[sectionId]) {
                        editedData.value[sectionId] = { ...editedData.value[sectionId], ...sectionData };
                    } else {
                        editedData.value[sectionId] = sectionData;
                    }
                });
            }

            originalData.value = JSON.parse(JSON.stringify(editedData.value));
        } catch (error) {
            console.error("[useLiveEdit] Load data failed:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const setData = (sectionId: string, data: Record<string, unknown>) => {
        editedData.value[sectionId] = { ...editedData.value[sectionId], ...data };
        originalData.value[sectionId] = JSON.parse(JSON.stringify(editedData.value[sectionId]));
    };

    const getSectionData = (sectionId: string) => {
        return editedData.value[sectionId] ?? {};
    };

    const getFieldValue = (sectionId: string, fieldPath: string): unknown => {
        const parts = fieldPath.split(".");
        let value: unknown = editedData.value[sectionId];

        for (const part of parts) {
            if (value && typeof value === "object") {
                value = (value as Record<string, unknown>)[part];
            } else {
                return undefined;
            }
        }

        return value;
    };

    const updateField = (sectionId: string, fieldPath: string, value: unknown) => {
        if (!editedData.value[sectionId]) {
            editedData.value[sectionId] = {};
        }

        const parts = fieldPath.split(".");
        if (parts.length === 1) {
            editedData.value[sectionId] = {
                ...editedData.value[sectionId],
                [fieldPath]: value,
            };
            return;
        }

        const sectionData = JSON.parse(JSON.stringify(editedData.value[sectionId]));
        let target: unknown = sectionData;

        for (let i = 0; i < parts.length - 1; i++) {
            const key = parts[i];
            if (!key) continue;

            const nextKey = parts[i + 1];
            const isNextKeyNumeric = nextKey && /^\d+$/.test(nextKey);

            if (typeof target === "object" && target !== null) {
                const obj = target as Record<string, unknown>;
                if (obj[key] === undefined || obj[key] === null) {
                    obj[key] = isNextKeyNumeric ? [] : {};
                } else if (isNextKeyNumeric && !Array.isArray(obj[key])) {
                    const existingObj = obj[key] as Record<string, unknown>;
                    const arr: unknown[] = [];
                    Object.keys(existingObj).forEach((k) => {
                        const idx = parseInt(k, 10);
                        if (!isNaN(idx)) arr[idx] = existingObj[k];
                    });
                    obj[key] = arr;
                }
                target = obj[key];
            }
        }

        const lastKey = parts[parts.length - 1];
        if (lastKey && typeof target === "object" && target !== null) {
            (target as Record<string, unknown>)[lastKey] = value;
        }

        editedData.value[sectionId] = sectionData;
    };

    const openEditor = (sectionId: string, fieldPath: string) => {
        const section = config.value?.sections[sectionId];
        if (!section) return;

        const parts = fieldPath.split(".");
        const firstPart = parts[0];
        if (!firstPart) return;

        let fieldConfig: FieldConfig | undefined = section.fields[firstPart];

        for (let i = 1; i < parts.length && fieldConfig; i++) {
            const part = parts[i];
            if (!part) continue;

            if (/^\d+$/.test(part)) {
                continue;
            }

            if (fieldConfig.type === "group" && fieldConfig.fields) {
                fieldConfig = fieldConfig.fields[part];
            } else if (fieldConfig.type === "array" && fieldConfig.schema) {
                fieldConfig = fieldConfig.schema[part];
            }
        }

        if (!fieldConfig) return;

        const currentValue = getFieldValue(sectionId, fieldPath);

        editTarget.value = {
            sectionId,
            fieldPath,
            fieldConfig,
            currentValue,
        };
        isPopupOpen.value = true;
    };

    const closeEditor = () => {
        isPopupOpen.value = false;
        editTarget.value = null;
    };

    const applyEdit = (value: unknown) => {
        if (editTarget.value) {
            updateField(editTarget.value.sectionId, editTarget.value.fieldPath, value);
        }
        closeEditor();
    };

    const save = async () => {
        isSaving.value = true;
        try {
            const { hasPending, uploadAllPending } = usePendingUploads();
            const { hasUrlsToDelete, processDeleteQueue } = useDeleteQueue();

            if (hasUrlsToDelete.value) {
                await processDeleteQueue();
            }

            let normalizedData = JSON.parse(JSON.stringify(editedData.value));

            if (hasPending.value) {
                const uploadResults = await uploadAllPending();

                normalizedData = {};
                for (const [sectionId, sectionData] of Object.entries(editedData.value)) {
                    normalizedData[sectionId] = normalizeImageData(sectionData as Record<string, unknown>, uploadResults, sectionId);
                }
            }

            const pageConfig = config.value;
            if (!pageConfig?.path) {
                throw new Error("Page config path not found");
            }

            const { $db } = useNuxtApp();
            const firestorePath = getFirestorePath(pageConfig.path);
            await PageService.save($db as Firestore, firestorePath, normalizedData);

            originalData.value = JSON.parse(JSON.stringify(normalizedData));
            editedData.value = JSON.parse(JSON.stringify(normalizedData));
        } catch (error) {
            console.error("[useLiveEdit] Save failed:", error);
            throw error;
        } finally {
            isSaving.value = false;
        }
    };

    const discard = () => {
        editedData.value = JSON.parse(JSON.stringify(originalData.value));
        closeEditor();
    };

    return {
        config,
        data: editedData,
        originalData,
        isDirty,
        isSaving,
        isLoading,
        editTarget,
        isPopupOpen,
        loadData,
        setData,
        getSectionData,
        getFieldValue,
        updateField,
        openEditor,
        closeEditor,
        applyEdit,
        save,
        discard,
    };
};
