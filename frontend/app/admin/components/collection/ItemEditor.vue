<!-- Chức năng: Modal editor cho CRUD item -->
<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @mousedown.self="handleClose">
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <Icon :name="isNew ? 'mdi:plus' : 'mdi:pencil'" />
                        <span>{{ isNew ? "Thêm" : "Sửa" }} {{ itemName }}</span>
                    </h2>
                    <button class="close-btn" @click="handleClose">
                        <Icon name="mdi:close" />
                    </button>
                </div>

                <div class="modal-body">
                    <div v-if="hasItemFields" class="editor-fields">
                        <template v-for="(field, fieldKey) in config.itemFields" :key="fieldKey">
                            <div v-if="isArrayField(field)" class="array-field">
                                <div class="array-header">
                                    <span class="array-label">{{ field.label }}</span>
                                    <span v-if="field.min || field.max" class="array-count">{{ ((formData[fieldKey as string] as any[]) || []).length }}/{{ field.max || '∞' }} items</span>
                                </div>
                                <div v-if="((formData[fieldKey as string] as any[]) || []).length === 0" class="array-empty">
                                    <Icon name="mdi:playlist-plus" class="empty-icon" />
                                    <p>Chưa có items. Nhấn Add để thêm mới.</p>
                                </div>
                                <div v-else class="array-items">
                                    <div v-for="(item, index) in ((formData[fieldKey as string] as any[]) || [])" :key="index" class="array-item">
                                        <div class="item-header">
                                            <div class="item-drag">
                                                <Icon name="mdi:drag-vertical" class="drag-icon" />
                                                <span class="item-index">Item {{ index + 1 }}</span>
                                            </div>
                                            <button class="item-remove" @click="removeArrayItem(fieldKey as string, index)">
                                                <Icon name="mdi:close" />
                                                <span>Xóa</span>
                                            </button>
                                        </div>
                                        <div class="item-fields">
                                            <Field v-for="(subField, subKey) in field.schema" :key="subKey" :field="(subField as any)" :model-value="item[subKey]" @update:model-value="updateArrayItemField(fieldKey as string, index, subKey as string, $event)" />
                                        </div>
                                    </div>
                                </div>
                                <button v-if="!field.max || ((formData[fieldKey as string] as any[]) || []).length < field.max" class="add-item-btn" @click="addArrayItem(fieldKey as string, field as any)">
                                    <Icon name="mdi:plus" />
                                    <span>Thêm item</span>
                                </button>
                                <p v-if="field.note" class="field-note">{{ field.note }}</p>
                            </div>
                            <Field v-else :field="(field as any)" :model-value="formData[fieldKey as string]" :field-path="fieldKey as string" @update:model-value="formData[fieldKey as string] = $event" />
                        </template>
                    </div>

                    <div v-else-if="hasSections" class="editor-sections">
                        <div v-for="(section, sectionKey) in config.sections" :key="sectionKey" class="admin-section">
                            <button class="section-header" @click="toggleSection(sectionKey as string)">
                                <div class="section-title">
                                    <Icon name="mdi:folder" class="section-icon" />
                                    <span>{{ section.label }}</span>
                                </div>
                                <Icon :name="(collapsedSections[sectionKey as string] ?? section.collapsed ?? false) ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="chevron-icon" />
                            </button>
                            <div v-show="!(collapsedSections[sectionKey as string] ?? section.collapsed ?? false)" class="section-content">
                                <template v-for="(field, fieldKey) in section.fields" :key="fieldKey">
                                    <div v-if="isArrayField(field)" class="array-field">
                                        <div class="array-header">
                                            <span class="array-label">{{ field.label }}</span>
                                            <span v-if="field.min || field.max" class="array-count">{{ ((formData[fieldKey as string] as any[]) || []).length }}/{{ field.max || '∞' }} items</span>
                                        </div>
                                        <div v-if="((formData[fieldKey as string] as any[]) || []).length === 0" class="array-empty">
                                            <Icon name="mdi:playlist-plus" class="empty-icon" />
                                            <p>Chưa có items. Nhấn Add để thêm mới.</p>
                                        </div>
                                        <div v-else class="array-items">
                                            <div v-for="(item, index) in ((formData[fieldKey as string] as any[]) || [])" :key="index" class="array-item">
                                                <div class="item-header">
                                                    <div class="item-drag">
                                                        <Icon name="mdi:drag-vertical" class="drag-icon" />
                                                        <span class="item-index">Item {{ index + 1 }}</span>
                                                    </div>
                                                    <button class="item-remove" @click="removeArrayItem(fieldKey as string, index)">
                                                        <Icon name="mdi:close" />
                                                        <span>Xóa</span>
                                                    </button>
                                                </div>
                                                <div class="item-fields">
                                                    <Field v-for="(subField, subKey) in field.schema" :key="subKey" :field="(subField as any)" :model-value="item[subKey]" @update:model-value="updateArrayItemField(fieldKey as string, index, subKey as string, $event)" />
                                                </div>
                                            </div>
                                        </div>
                                        <button v-if="!field.max || ((formData[fieldKey as string] as any[]) || []).length < field.max" class="add-item-btn" @click="addArrayItem(fieldKey as string, field as any)">
                                            <Icon name="mdi:plus" />
                                            <span>Thêm item</span>
                                        </button>
                                        <p v-if="field.note" class="field-note">{{ field.note }}</p>
                                    </div>
                                    <Field v-else :field="(field as any)" :model-value="formData[fieldKey as string]" :field-path="fieldKey as string" @update:model-value="formData[fieldKey as string] = $event" />
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="cancel-btn" @click="handleClose">Hủy</button>
                    <button class="save-btn" @click="handleSave">
                        <Icon name="mdi:check" />
                        <span>{{ isNew ? "Thêm mới" : "Lưu thay đổi" }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import Field from "../fields/Field.vue";
import type { SectionConfig, FieldConfig, TableColumn } from "../../config/page.config";
import { usePendingUploads } from "@/admin/composables/usePendingUploads";

interface DetailConfig {
    itemFields?: Record<string, FieldConfig>;
    sections?: Record<string, SectionConfig>;
    tableColumns?: TableColumn[];
    defaultValues?: Record<string, unknown>;
}

const props = defineProps<{
    isOpen: boolean;
    isNew: boolean;
    itemName: string;
    config: DetailConfig;
    initialData?: Record<string, unknown>;
}>();

const emit = defineEmits<{
    close: [];
    save: [data: Record<string, unknown>];
}>();

const formData = ref<Record<string, unknown>>({});
const collapsedSections = ref<Record<string, boolean>>({});
const { hasPending, clearAll } = usePendingUploads();

const hasItemFields = computed(() => !!props.config?.itemFields && Object.keys(props.config.itemFields).length > 0);
const hasSections = computed(() => !!props.config?.sections && Object.keys(props.config.sections).length > 0);

const isArrayField = (field: FieldConfig) => {
    return field.type === "array";
};

watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            clearAll(); // Ensure clean state when opening
            if (props.isNew) {
                formData.value = { ...(props.config?.defaultValues || {}) };
            } else if (props.initialData) {
                formData.value = { ...props.initialData };
            }
        }
    },
    { immediate: true }
);

const toggleSection = (sectionKey: string) => {
    collapsedSections.value[sectionKey] = !collapsedSections.value[sectionKey];
};

const handleClose = () => {
    if (hasPending.value) {
        if (!window.confirm("Có thay đổi chưa lưu (ảnh đang chờ upload). Bạn có chắc muốn thoát?")) {
            return;
        }
    }
    clearAll(); // Clear any pending uploads (revoke URLs)
    emit("close");
};

const handleSave = () => {
    emit("save", { ...formData.value });
};

const addArrayItem = (fieldKey: string, field: any) => {
    const items = (formData.value[fieldKey] as any[]) || [];
    const newItem: Record<string, unknown> = {};
    for (const [key, fieldConfig] of Object.entries(field.schema || {})) {
        const config = fieldConfig as { default?: unknown };
        newItem[key] = config.default ?? '';
    }
    formData.value[fieldKey] = [...items, newItem];
};

const removeArrayItem = (fieldKey: string, index: number) => {
    const items = [...((formData.value[fieldKey] as any[]) || [])];
    items.splice(index, 1);
    formData.value[fieldKey] = items;
};

const updateArrayItemField = (fieldKey: string, index: number, subKey: string, value: unknown) => {
    const items = [...((formData.value[fieldKey] as any[]) || [])];
    items[index] = { ...items[index], [subKey]: value };
    formData.value[fieldKey] = items;
};
</script>

<style scoped>
@import "../../styles/components/collection/item-editor.css";
</style>
