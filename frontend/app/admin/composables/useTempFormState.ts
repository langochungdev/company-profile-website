import { ref } from "vue";
import { toRaw } from "vue";

interface TempState {
    [fieldPath: string]: unknown;
}

const tempStateStore = ref<TempState>({});

const isPendingImageValue = (value: unknown): boolean => {
    return typeof value === "object" && value !== null && "pending" in value && (value as { pending: boolean }).pending === true;
};

const deepClone = (value: unknown): unknown => {
    try {
        const raw = toRaw(value);

        if (isPendingImageValue(raw)) {
            return raw;
        }

        if (Array.isArray(raw)) {
            return raw.map((item) => {
                if (isPendingImageValue(item)) {
                    return item;
                }
                return deepClone(item);
            });
        }

        if (typeof raw === "object" && raw !== null) {
            const cloned: Record<string, unknown> = {};
            for (const [key, val] of Object.entries(raw)) {
                if (isPendingImageValue(val)) {
                    cloned[key] = val;
                } else {
                    cloned[key] = deepClone(val);
                }
            }
            return cloned;
        }

        return raw;
    } catch (error) {
        console.warn("[useTempFormState] Clone failed, using fallback:", error);
        return value;
    }
};

export const useTempFormState = () => {
    const saveTempState = (fieldPath: string, value: unknown) => {
        if (!fieldPath) return;
        tempStateStore.value[fieldPath] = deepClone(value);
    };

    const getTempState = (fieldPath: string): unknown | null => {
        if (!fieldPath) return null;
        return tempStateStore.value[fieldPath] ?? null;
    };

    const clearTempState = (fieldPath: string) => {
        if (!fieldPath) return;
        delete tempStateStore.value[fieldPath];
    };

    const clearAllTempState = () => {
        tempStateStore.value = {};
    };

    const hasTempState = (fieldPath: string): boolean => {
        return fieldPath in tempStateStore.value;
    };

    return {
        saveTempState,
        getTempState,
        clearTempState,
        clearAllTempState,
        hasTempState,
    };
};
