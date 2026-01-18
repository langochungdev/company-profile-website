<!-- Chức năng: Modal editor cho CRUD item -->
<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <Icon :name="isNew ? 'mdi:plus' : 'mdi:pencil'" />
                        <span>{{ isNew ? "Thêm" : "Sửa" }} {{ itemName }}</span>
                    </h2>
                    <button class="close-btn" @click="$emit('close')">
                        <Icon name="mdi:close" />
                    </button>
                </div>

                <div class="modal-body">
                    <div v-if="hasItemFields" class="editor-fields">
                        <template v-for="(field, fieldKey) in config.itemFields" :key="fieldKey">
                            <ArrayField v-if="isArrayField(field)" :field="field as any" :model-value="(formData[fieldKey as string] as any[]) || []" @update:model-value="formData[fieldKey as string] = $event" />
                            <Field v-else :field="(field as any)" :model-value="formData[fieldKey as string]" @update:model-value="formData[fieldKey as string] = $event" />
                        </template>
                    </div>

                    <div v-else-if="hasSections" class="editor-sections">
                        <Section v-for="(section, sectionKey) in config.sections" :key="sectionKey" :label="section.label" :is-collapsed="collapsedSections[sectionKey as string] ?? section.collapsed ?? false" @toggle="toggleSection(sectionKey as string)">
                            <template v-for="(field, fieldKey) in section.fields" :key="fieldKey">
                                <ArrayField v-if="isArrayField(field)" :field="field as any" :model-value="(formData[fieldKey as string] as any[]) || []" @update:model-value="formData[fieldKey as string] = $event" />
                                <Field v-else :field="(field as any)" :model-value="formData[fieldKey as string]" @update:model-value="formData[fieldKey as string] = $event" />
                            </template>
                        </Section>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="cancel-btn" @click="$emit('close')">Hủy</button>
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
import Section from "../shared/Section.vue";
import Field from "../fields/Field.vue";
import ArrayField from "../fields/ArrayField.vue";
import type { SectionConfig, FieldConfig, TableColumn } from "../../page.config";

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

const hasItemFields = computed(() => !!props.config?.itemFields && Object.keys(props.config.itemFields).length > 0);
const hasSections = computed(() => !!props.config?.sections && Object.keys(props.config.sections).length > 0);

const isArrayField = (field: FieldConfig) => {
    return field.type === "array";
};

watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
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

const handleSave = () => {
    emit("save", { ...formData.value });
};
</script>

<style scoped>
@import "../../styles/components/collection/item-editor/desktop.css";

.editor-fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
}
</style>
