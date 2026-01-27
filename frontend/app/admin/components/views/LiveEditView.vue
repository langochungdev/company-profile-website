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
                        <div class="section-header-actions">
                            <button v-if="hasCollectionField(String(sectionId))" class="btn-collection" @click="openCollectionEditor(String(sectionId))">
                                <Icon name="mdi:image-multiple" />
                            </button>
                            <button class="btn-visibility" @click="toggleSectionVisibility(String(sectionId))">
                                <Icon :name="sectionVisibility[sectionId] !== false ? 'mdi:eye' : 'mdi:eye-off'" />
                            </button>
                        </div>
                    </div>
                    <div :class="['section-content', { 'is-hidden': sectionVisibility[sectionId] === false }]">
                        <component :is="getSectionComponent(String(sectionId))" :data="getSectionData(String(sectionId))" :edit-mode="true" />
                    </div>
                </EditableSection>
            </template>

            <div v-else class="unsupported-page">
                <Icon name="mdi:alert-circle-outline" />
                <h3>Page này chưa hỗ trợ Live Edit</h3>
                <p>Thêm `component` field vào sections trong *.cms.ts để bật tính năng này</p>
            </div>
        </div>

        <FieldPopupEditor :is-open="isPopupOpen && !isCollectionMode" :field-config="editTarget?.fieldConfig || null" :initial-value="editTarget?.currentValue" :field-path="fullFieldPath" @close="closeEditor" @apply="applyEdit" />

        <FieldPopupEditor :is-open="isCollectionOpen" :field-config="activeCollectionConfig" :initial-value="activeCollectionItems" :field-path="activeCollectionFieldPath" mode="collection" :image-field="activeCollectionImageField" :min-items="activeCollectionMinItems" :max-items="activeCollectionMaxItems" @close="closeCollectionEditor" @apply="handleCollectionApply" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineAsyncComponent, computed, toRef } from "vue";
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

const pageKeyRef = toRef(props, "pageKey");
const { config, isDirty, isSaving, isLoading, editTarget, isPopupOpen, loadData, getSectionData, getFieldValue, updateField, openEditor, closeEditor, applyEdit, save, discard } = useLiveEdit(pageKeyRef);

const sectionVisibility = ref<Record<string, boolean>>({});
const isCollectionOpen = ref(false);
const activeCollectionSectionId = ref<string | null>(null);
const activeCollectionFieldKey = ref<string | null>(null);

const isCollectionMode = computed(() => isCollectionOpen.value);

const fullFieldPath = computed(() => {
    if (!editTarget.value) return undefined;
    return `${editTarget.value.sectionId}.${editTarget.value.fieldPath}`;
});

const activeCollectionConfig = computed(() => {
    if (!activeCollectionSectionId.value || !activeCollectionFieldKey.value) return null;
    const section = config.value?.sections[activeCollectionSectionId.value];
    return section?.fields?.[activeCollectionFieldKey.value] || null;
});

const activeCollectionItems = computed(() => {
    if (!activeCollectionSectionId.value || !activeCollectionFieldKey.value) return [];
    const data = getSectionData(activeCollectionSectionId.value);
    return (data[activeCollectionFieldKey.value] as unknown[]) || [];
});

const activeCollectionFieldPath = computed(() => {
    if (!activeCollectionSectionId.value || !activeCollectionFieldKey.value) return undefined;
    return `${activeCollectionSectionId.value}.${activeCollectionFieldKey.value}`;
});

const activeCollectionImageField = computed(() => {
    if (!activeCollectionSectionId.value || !activeCollectionFieldKey.value) return "image";
    const section = config.value?.sections[activeCollectionSectionId.value];
    const field = section?.fields?.[activeCollectionFieldKey.value];
    const schema = field?.schema;
    if (schema) {
        const imageKey = Object.keys(schema).find(k => schema[k]?.type === "image");
        return imageKey || "image";
    }
    return "image";
});

const activeCollectionMinItems = computed(() => {
    if (!activeCollectionSectionId.value || !activeCollectionFieldKey.value) return 1;
    const section = config.value?.sections[activeCollectionSectionId.value];
    const field = section?.fields?.[activeCollectionFieldKey.value] as { minItems?: number } | undefined;
    return field?.minItems ?? 1;
});

const activeCollectionMaxItems = computed(() => {
    if (!activeCollectionSectionId.value || !activeCollectionFieldKey.value) return 20;
    const section = config.value?.sections[activeCollectionSectionId.value];
    const field = section?.fields?.[activeCollectionFieldKey.value] as { maxItems?: number } | undefined;
    return field?.maxItems ?? 20;
});

const hasCollectionField = (sectionId: string): boolean => {
    const section = config.value?.sections[sectionId];
    if (!section?.fields) return false;
    return Object.values(section.fields).some((field) => {
        const f = field as { editMode?: string };
        return f.editMode === "collection";
    });
};

const getCollectionFieldKey = (sectionId: string): string | null => {
    const section = config.value?.sections[sectionId];
    if (!section?.fields) return null;
    const entry = Object.entries(section.fields).find(([, field]) => {
        const f = field as { editMode?: string };
        return f.editMode === "collection";
    });
    return entry ? entry[0] : null;
};

const openCollectionEditor = (sectionId: string) => {
    const fieldKey = getCollectionFieldKey(sectionId);
    if (!fieldKey) return;
    activeCollectionSectionId.value = sectionId;
    activeCollectionFieldKey.value = fieldKey;
    isCollectionOpen.value = true;
};

const closeCollectionEditor = () => {
    isCollectionOpen.value = false;
    activeCollectionSectionId.value = null;
    activeCollectionFieldKey.value = null;
};

const handleCollectionApply = (items: unknown) => {
    if (!activeCollectionSectionId.value || !activeCollectionFieldKey.value) return;
    updateField(activeCollectionSectionId.value, activeCollectionFieldKey.value, items);
    closeCollectionEditor();
};

const handleFieldEdit = (sectionId: string, fieldPath: string) => {
    openEditor(sectionId, fieldPath);
};

type ComponentModule = () => Promise<{ default: unknown }>;
const pageComponentModules: Record<string, ComponentModule> = {
    "home/HeroSection": () => import("../../../pages/home/(components)/HeroSection.vue"),
    "home/ServicesSection": () => import("../../../pages/home/(components)/ServicesSection.vue"),
    "home/ProjectSection": () => import("../../../pages/home/(components)/ProjectSection.vue"),
    "home/BlogSection": () => import("../../../pages/home/(components)/BlogSection.vue"),
    "home/NewsSection": () => import("../../../pages/home/(components)/NewsSection.vue"),
    "home/CertSection": () => import("../../../pages/home/(components)/CertSection.vue"),
    "home/PartnerSection": () => import("../../../pages/home/(components)/PartnerSection.vue"),
    "about-us/AboutContent": () => import("../../../pages/about-us/(components)/AboutContent.vue"),
    "contact/ContactForm": () => import("../../../pages/contact/(components)/ContactForm.vue"),
};

const sectionComponents = computed(() => {
    if (!config.value?.sections) return {};

    const pageKey = pageKeyRef.value;

    return Object.fromEntries(
        Object.entries(config.value.sections)
            .filter(([, section]) => {
                const s = section as { component?: string };
                return !!s.component;
            })
            .map(([key, section]) => {
                const s = section as { component?: string };
                const componentKey = `${pageKey}/${s.component}`;
                const loader = pageComponentModules[componentKey];

                if (!loader) {
                    console.warn(`Component not found: ${componentKey}`);
                    return [key, null];
                }

                return [
                    key,
                    defineAsyncComponent(loader)
                ];
            })
            .filter(([, comp]) => comp !== null)
    );
});

const hasLiveEditSupport = computed(() => {
    return Object.keys(sectionComponents.value).length > 0;
});

const enabledSections = computed(() => {
    if (!config.value?.sections) return {};
    return Object.fromEntries(
        Object.entries(config.value.sections).filter(([, section]) => {
            const s = section as { enabled?: boolean };
            return s.enabled !== false;
        })
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
    pageKeyRef,
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

const handleDiscard = () => {
    discard();
};

defineExpose({ handleSave, handleDiscard });
</script>

<style scoped>
@import "../../styles/components/views/live-edit-view.css";
</style>

<style>
@import "../../styles/components/views/field-scanner.css";
</style>
