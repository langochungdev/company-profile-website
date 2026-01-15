<!-- Chức năng: Modal editor cho CRUD item -->
<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <Icon :name="isNew ? 'mdi:plus' : 'mdi:pencil'" />
                        <span>{{ isNew ? 'Thêm' : 'Sửa' }} {{ itemName }}</span>
                    </h2>
                    <button class="close-btn" @click="$emit('close')">
                        <Icon name="mdi:close" />
                    </button>
                </div>

                <div class="modal-body">
                    <div class="editor-sections">
                        <AdminSection v-for="(section, sectionKey) in config.sections" :key="sectionKey" :label="section.label" :is-collapsed="collapsedSections[sectionKey as string] ?? section.collapsed ?? false" @toggle="toggleSection(sectionKey as string)">
                            <template v-for="(field, fieldKey) in section.fields" :key="fieldKey">
                                <AdminArrayField v-if="isArrayField(field)" :field="field as any" :model-value="(formData[fieldKey as string] as any[]) || []" @update:model-value="formData[fieldKey as string] = $event" />
                                <AdminField v-else :field="(field as any)" :model-value="formData[fieldKey as string]" @update:model-value="formData[fieldKey as string] = $event" />
                            </template>
                        </AdminSection>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="cancel-btn" @click="$emit('close')">Hủy</button>
                    <button class="save-btn" @click="handleSave">
                        <Icon name="mdi:check" />
                        <span>{{ isNew ? 'Thêm mới' : 'Lưu thay đổi' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import AdminSection from './AdminSection.vue'
import AdminField from './AdminField.vue'
import AdminArrayField from './AdminArrayField.vue'
import type { SectionConfig, FieldConfig, TableColumn } from '../page.config'

interface DetailConfig {
    sections: Record<string, SectionConfig>
    tableColumns: TableColumn[]
    defaultValues: Record<string, unknown>
}

const props = defineProps<{
    isOpen: boolean
    isNew: boolean
    itemName: string
    config: DetailConfig
    initialData?: Record<string, unknown>
}>()

const emit = defineEmits<{
    close: []
    save: [data: Record<string, unknown>]
}>()

const formData = ref<Record<string, unknown>>({})
const collapsedSections = ref<Record<string, boolean>>({})

const isArrayField = (field: FieldConfig) => {
    return field.type === 'array'
}

watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        if (props.isNew) {
            formData.value = { ...props.config.defaultValues }
        } else if (props.initialData) {
            formData.value = { ...props.initialData }
        }
    }
}, { immediate: true })

const toggleSection = (sectionKey: string) => {
    collapsedSections.value[sectionKey] = !collapsedSections.value[sectionKey]
}

const handleSave = () => {
    emit('save', { ...formData.value })
}
</script>

<style scoped>
@import "../styles/admin-item-editor/desktop.css";
</style>
