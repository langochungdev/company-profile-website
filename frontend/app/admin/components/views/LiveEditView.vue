<!-- Chức năng: Component Live Edit có thể embed trong Admin Layout -->
<template>
    <div class="live-edit-view-wrapper">
        <div class="preview-area">
            <div v-if="isLoading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải...</span>
            </div>

            <template v-else-if="hasLiveEditSupport">
                <EditableSection v-for="(section, sectionId) in enabledSections" :key="sectionId" :section-id="String(sectionId)" :enabled="true" @edit="handleFieldEdit">
                    <div class="section-header">
                        <span class="section-label">{{ section.label }}</span>
                        <button class="btn-visibility" @click="toggleSectionVisibility(String(sectionId))">
                            <Icon :name="sectionVisibility[sectionId] !== false ? 'mdi:eye' : 'mdi:eye-off'" />
                        </button>
                    </div>
                    <div :class="['section-content', { 'is-hidden': sectionVisibility[sectionId] === false }]">
                        <component :is="getSectionComponent(String(sectionId))" :data="getSectionData(String(sectionId))" />
                    </div>
                </EditableSection>
            </template>

            <div v-else class="unsupported-page">
                <Icon name="mdi:alert-circle-outline" />
                <h3>Page này chưa hỗ trợ Live Edit</h3>
                <p>Thêm `component` field vào sections trong *.cms.ts để bật tính năng này</p>
            </div>
        </div>

        <FieldPopupEditor :is-open="isPopupOpen" :field-config="editTarget?.fieldConfig || null" :initial-value="editTarget?.currentValue" @close="closeEditor" @apply="applyEdit" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineAsyncComponent, computed } from "vue";
import EditableSection from "./EditableSection.vue";
import FieldPopupEditor from "./FieldPopupEditor.vue";
import { useLiveEdit } from "../../composables/useLiveEdit";

const props = defineProps<{
    pageKey: string;
}>();

const emit = defineEmits<{
    "dirty-change": [isDirty: boolean];
    "saving-change": [isSaving: boolean];
}>();

const { config, isDirty, isSaving, isLoading, editTarget, isPopupOpen, loadData, getSectionData, openEditor, closeEditor, applyEdit, save, discard } = useLiveEdit(props.pageKey);

const sectionVisibility = ref<Record<string, boolean>>({});

const handleFieldEdit = (sectionId: string, fieldPath: string) => {
    openEditor(sectionId, fieldPath);
};

const sectionComponents = computed(() => {
    if (!config.value?.sections) return {};

    const componentBase = (config.value as any).componentBase || "components";
    const pageKey = props.pageKey;

    return Object.fromEntries(
        Object.entries(config.value.sections)
            .filter(([, section]) => (section as any).component)
            .map(([key, section]) => [
                key,
                defineAsyncComponent(() =>
                    import(`@/pages/${pageKey}/${componentBase}/${(section as any).component}.vue`)
                )
            ])
    );
});

const hasLiveEditSupport = computed(() => {
    return Object.keys(sectionComponents.value).length > 0;
});

const enabledSections = computed(() => {
    if (!config.value?.sections) return {};
    return Object.fromEntries(
        Object.entries(config.value.sections).filter(([, section]) => (section as any).enabled !== false)
    );
});

const getSectionComponent = (sectionId: string) => {
    return sectionComponents.value[sectionId] || null;
};

const toggleSectionVisibility = (sectionId: string) => {
    sectionVisibility.value[sectionId] = !sectionVisibility.value[sectionId];
};

const handleSave = async () => {
    await save();
};

watch(isDirty, (val) => {
    emit("dirty-change", val);
});

watch(isSaving, (val) => {
    emit("saving-change", val);
});

watch(
    () => props.pageKey,
    () => {
        loadData();
        if (config.value?.sections) {
            Object.keys(config.value.sections).forEach((sectionId) => {
                sectionVisibility.value[sectionId] = true;
            });
        }
    },
    { immediate: true }
);

onMounted(() => {
    if (config.value?.sections) {
        Object.keys(config.value.sections).forEach((sectionId) => {
            sectionVisibility.value[sectionId] = true;
        });
    }
});

defineExpose({ handleSave });
</script>

<style scoped>
@import "../../styles/components/views/live-edit-view/desktop.css";
@import "../../styles/components/views/live-edit-view/mobile.css";
</style>
