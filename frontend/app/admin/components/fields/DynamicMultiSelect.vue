<!-- Chức năng: Dynamic multi-select field load options từ collection config -->
<template>
    <div class="dynamic-multi-select-wrapper">
        <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
        </label>

        <div v-if="loading" class="loading-indicator">
            <Icon name="mdi:loading" class="spin" />
            <span>Đang tải...</span>
        </div>

        <div v-else class="multi-select-container">
            <div v-if="selectedItems.length > 0" class="selected-tags">
                <span v-for="item in selectedItems" :key="item" class="selected-tag">
                    {{ item }}
                    <button type="button" class="remove-tag" @click="removeTag(item)">
                        <Icon name="mdi:close" />
                    </button>
                </span>
            </div>

            <div v-if="availableOptions.length > 0" class="options-dropdown">
                <select class="add-select" @change="addTag($event)">
                    <option value="">+ Thêm {{ field.label?.toLowerCase() }}...</option>
                    <option v-for="opt in availableOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>
            </div>

            <p v-if="options.length === 0" class="empty-hint">
                <Icon name="mdi:information-outline" />
                <span>Chưa có {{ field.label?.toLowerCase() }}. Vui lòng thêm trong quản lý.</span>
            </p>
        </div>

        <p v-if="field.note" class="field-note">{{ field.note }}</p>
    </div>
</template>

<script setup lang="ts">
import { useCollectionConfig } from "@/admin/composables/useCollectionConfig";

interface TagItem {
    value: string;
}

interface DynamicMultiSelectField {
    type: string;
    label?: string;
    required?: boolean;
    note?: string;
    configKey: "categories" | "tags";
    collectionPath?: string;
}

const props = defineProps<{
    field: DynamicMultiSelectField;
    modelValue: TagItem[];
    collectionPath?: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: TagItem[]];
}>();

const path = computed(() => props.collectionPath || props.field.collectionPath || "collections/products/items");

const { config, loading, loadConfig } = useCollectionConfig(path.value);

const options = computed(() => {
    if (props.field.configKey === "categories") {
        return config.value.categories.map((c) => ({ value: c.name, label: c.name }));
    }
    return config.value.tags.map((t) => ({ value: t.name, label: t.name }));
});

const selectedItems = computed(() => {
    if (!Array.isArray(props.modelValue)) return [];
    return props.modelValue.map((item) => (typeof item === "string" ? item : item.value));
});

const availableOptions = computed(() => {
    return options.value.filter((opt) => !selectedItems.value.includes(opt.value));
});

const addTag = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (!value) return;

    const currentTags = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    currentTags.push({ value });
    emit("update:modelValue", currentTags);

    select.value = "";
};

const removeTag = (tagValue: string) => {
    const currentTags = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const filtered = currentTags.filter((item) => {
        const val = typeof item === "string" ? item : item.value;
        return val !== tagValue;
    });
    emit("update:modelValue", filtered);
};

onMounted(() => {
    loadConfig();
});
</script>

<style scoped>
@import "../../styles/components/fields/dynamic-multi-select.css";
</style>
