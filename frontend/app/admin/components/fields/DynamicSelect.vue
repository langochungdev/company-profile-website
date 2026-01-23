<!-- Chức năng: Dynamic select field load options từ collection config -->
<template>
    <div class="dynamic-select-wrapper">
        <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
        </label>

        <div v-if="loading" class="loading-indicator">
            <Icon name="mdi:loading" class="spin" />
            <span>Đang tải...</span>
        </div>

        <select v-else v-model="localValue" class="dynamic-select" :disabled="options.length === 0">
            <option value="">-- Chọn {{ field.label?.toLowerCase() }} --</option>
            <option v-for="opt in options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
            </option>
        </select>

        <p v-if="options.length === 0 && !loading" class="empty-hint">
            <Icon name="mdi:information-outline" />
            <span>Chưa có {{ field.label?.toLowerCase() }}. Vui lòng thêm trong quản lý.</span>
        </p>

        <p v-if="field.note" class="field-note">{{ field.note }}</p>
    </div>
</template>

<script setup lang="ts">
import { useCollectionConfig } from "@/admin/composables/useCollectionConfig";

interface DynamicSelectField {
    type: string;
    label?: string;
    required?: boolean;
    note?: string;
    configKey: "categories" | "tags";
    collectionPath?: string;
}

const props = defineProps<{
    field: DynamicSelectField;
    modelValue: string;
    collectionPath?: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

const localValue = computed({
    get: () => props.modelValue || "",
    set: (val) => emit("update:modelValue", val),
});

const path = computed(() => props.collectionPath || props.field.collectionPath || "collections/products/items");

const { config, loading, loadConfig } = useCollectionConfig(path.value);

const options = computed(() => {
    if (props.field.configKey === "categories") {
        return config.value.categories.map((c) => ({ value: c.name, label: c.name }));
    }
    return config.value.tags.map((t) => ({ value: t.name, label: t.name }));
});

onMounted(() => {
    loadConfig();
});
</script>

<style scoped>
@import "../../styles/components/fields/dynamic-select.css";
</style>
