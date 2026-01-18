/**
 * Composable: Live Edit Mode cho Admin Panel
 */

import { ref, computed, watch, toValue, type MaybeRef } from "vue";
import { getPageConfig, type PageConfig, type FieldConfig } from "../page.config";

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

    const loadData = async () => {
        isLoading.value = true;
        try {
            initializeData();

            if (editedData.value.hero) {
                editedData.value.hero.slides = [
                    {
                        badge: "Giải Pháp An Ninh Toàn Diện",
                        title: "SHT - Chuyên Gia",
                        highlight: "Camera & Hạ Tầng Mạng",
                        description: "Cung cấp giải pháp an ninh thông minh, hạ tầng mạng chuyên nghiệp.",
                        image: "https://placehold.co/1920x1080/jpg?text=1920x1080",
                    },
                    {
                        badge: "8 Lĩnh Vực Cốt Lõi",
                        title: "Hệ Thống Camera AI",
                        highlight: "Giám Sát Thông Minh",
                        description: "Camera nhận diện khuôn mặt, giám sát từ xa 24/7.",
                        image: "https://placehold.co/1920x1080/jpg?text=1920x1080",
                    },
                    {
                        badge: "Uy Tín - Chất Lượng",
                        title: "Hạ Tầng Mạng",
                        highlight: "Ổn Định 24/7",
                        description: "Thi công mạng LAN, WiFi doanh nghiệp.",
                        image: "https://placehold.co/1920x1080/jpg?text=1920x1080",
                    },
                ];
                originalData.value = JSON.parse(JSON.stringify(editedData.value));
            }
        } finally {
            isLoading.value = false;
        }
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
            editedData.value[sectionId][fieldPath] = value;
        } else {
            let target = editedData.value[sectionId] as Record<string, unknown>;
            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i];
                if (key && !target[key]) {
                    target[key] = {};
                }
                if (key) {
                    target = target[key] as Record<string, unknown>;
                }
            }
            const lastKey = parts[parts.length - 1];
            if (lastKey) {
                target[lastKey] = value;
            }
        }
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

        editTarget.value = {
            sectionId,
            fieldPath,
            fieldConfig,
            currentValue: getFieldValue(sectionId, fieldPath),
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
            console.log("Saving data:", editedData.value);
            await new Promise((resolve) => setTimeout(resolve, 500));
            originalData.value = JSON.parse(JSON.stringify(editedData.value));
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
