<template>
    <div class="settings-view-wrapper">
        <section v-if="readonly" class="google-preview-section">
            <div class="preview-header">
                <Icon name="mdi:magnify" />
                <span>Google Preview</span>
            </div>
            <div class="google-preview">
                <div class="preview-title">{{ previewTitle }}</div>
                <div class="preview-url">{{ previewUrl }}</div>
                <div class="preview-description">{{ previewDescription }}</div>
            </div>
            <div v-if="readonly" class="readonly-badge">
                <Icon name="mdi:lock" />
                <span>Chế độ xem - Cấu hình từ CMS</span>
            </div>
        </section>

        <div class="settings-content">
            <section v-for="(section, sectionKey) in settingsSections" :key="sectionKey" class="settings-section">
                <button class="section-header" @click="toggleSection(sectionKey)">
                    <div class="section-title">
                        <Icon :name="section.icon" />
                        <span>{{ section.label }}</span>
                    </div>
                    <Icon :name="collapsedSections[sectionKey] ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="collapse-icon" />
                </button>

                <div v-show="!collapsedSections[sectionKey]" class="section-body">
                    <div v-for="(field, fieldKey) in section.fields" :key="fieldKey" class="field-group">
                        <label class="field-label">
                            {{ field.label }}
                            <span v-if="(field as any).required" class="required">*</span>
                        </label>
                        <p v-if="(field as any).note" class="field-note">{{ (field as any).note }}</p>

                        <input v-if="field.type === 'text'" v-model="settingsData[sectionKey][fieldKey]" type="text" class="field-input" :class="{ 'input-readonly': readonly }" :placeholder="(field as any).placeholder" :maxlength="(field as any).max" :disabled="readonly" />

                        <textarea v-else-if="field.type === 'textarea'" v-model="settingsData[sectionKey][fieldKey]" class="field-textarea" :class="{ 'input-readonly': readonly }" :placeholder="(field as any).placeholder" :maxlength="(field as any).max" :rows="(field as any).rows || 3" :disabled="readonly" />

                        <select v-else-if="field.type === 'select'" v-model="settingsData[sectionKey][fieldKey]" class="field-select" :class="{ 'input-readonly': readonly }" :disabled="readonly">
                            <option v-for="opt in getSelectOptions((field as any).options)" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                        </select>

                        <div v-else-if="field.type === 'image'" class="image-field">
                            <div v-if="settingsData[sectionKey][fieldKey]" class="image-preview">
                                <img :src="getImageSrc(settingsData[sectionKey][fieldKey])" :alt="field.label" />
                                <button v-if="!readonly" class="btn-remove" @click="handleImageRemove(sectionKey, fieldKey)">
                                    <Icon name="mdi:close" />
                                </button>
                            </div>
                            <label v-else-if="!readonly" class="image-upload">
                                <Icon name="mdi:cloud-upload" />
                                <span>Chọn ảnh</span>
                                <input type="file" accept="image/*" class="hidden" @change="handleImageUpload($event, sectionKey, fieldKey)" />
                            </label>
                            <div v-else class="image-placeholder">
                                <Icon name="mdi:image-off" />
                                <span>Chưa có ảnh</span>
                            </div>
                            <p v-if="(field as any).size" class="size-hint">Kích thước: {{ (field as any).size }}</p>
                        </div>

                        <span v-if="(field as any).max && field.type !== 'code'" class="char-count">{{ (settingsData[sectionKey][fieldKey] || '').length }}/{{ (field as any).max }}</span>
                    </div>
                </div>
            </section>


        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useSettingsContext } from "@/admin/composables/useSettingsContext";
import { usePendingUploads, type PendingImageValue } from "@/admin/composables/usePendingUploads";
import { useDeleteQueue } from "@/admin/composables/useDeleteQueue";

import { getImageSrc } from "@/admin/utils/imageHelper";

const props = defineProps<{
    pageKey: string;
    pageName: string;
    configPath: string;
    readonly?: boolean;
}>();

const runtimeConfig = useRuntimeConfig();
const SITE_URL = runtimeConfig.public.siteUrl as string;

const previewTitle = computed(() => {
    return settingsData.seo.title || props.pageName || 'Untitled';
});

const previewUrl = computed(() => {
    const baseUrl = SITE_URL || 'https://example.com';
    return `${baseUrl} > ${props.pageKey}`;
});

const previewDescription = computed(() => {
    const desc = settingsData.seo.description || '';
    return desc.length > 160 ? desc.slice(0, 157) + '...' : desc;
});


const emit = defineEmits<{
    "dirty-change": [isDirty: boolean];
    "saving-change": [isSaving: boolean];
}>();

const { settings, loading, isDirty, loadSettings, saveSettings } = useSettingsContext(props.configPath);

const settingsSections = {
    seo: {
        label: "SEO & Meta",
        icon: "mdi:magnify",
        fields: {
            title: { type: "text", label: "Meta Title", placeholder: "Tiêu đề trang...", max: 60, note: "Tiêu đề hiển thị trên tab trình duyệt và kết quả tìm kiếm", required: true },
            description: { type: "textarea", label: "Meta Description", placeholder: "Mô tả trang...", max: 160, rows: 3, note: "Mô tả ngắn gọn nội dung trang (tối đa 160 ký tự)", required: true },
            keywords: { type: "text", label: "Meta Keywords", placeholder: "từ khóa 1, từ khóa 2, ...", note: "Các từ khóa cách nhau bởi dấu phẩy" },
            canonical: { type: "text", label: "Canonical URL", placeholder: "https://example.com/page" },
            robots: {
                type: "select",
                label: "Robots",
                options: [
                    { value: "index,follow", label: "Index, Follow (Mặc định)" },
                    { value: "noindex,follow", label: "No Index, Follow" },
                    { value: "index,nofollow", label: "Index, No Follow" },
                    { value: "noindex,nofollow", label: "No Index, No Follow" },
                ],
            },
        },
    },
    openGraph: {
        label: "Open Graph (Social)",
        icon: "mdi:share-variant",
        fields: {
            ogTitle: { type: "text", label: "OG Title", placeholder: "Tiêu đề khi chia sẻ...", max: 60, note: "Để trống sẽ dùng Meta Title" },
            ogDescription: { type: "textarea", label: "OG Description", placeholder: "Mô tả khi chia sẻ...", max: 200, rows: 2, note: "Để trống sẽ dùng Meta Description" },
            ogImage: { type: "image", label: "OG Image", size: "1200x630px", note: "Ảnh hiển thị khi chia sẻ lên Facebook, LinkedIn...", required: true },
            ogType: {
                type: "select",
                label: "OG Type",
                options: [
                    { value: "website", label: "Website" },
                    { value: "article", label: "Article" },
                    { value: "product", label: "Product" },
                ],
            },
            twitterCard: {
                type: "select",
                label: "Twitter Card",
                options: [
                    { value: "summary_large_image", label: "Summary Large Image" },
                    { value: "summary", label: "Summary" },
                ],
            },
        },
    },
};

type SectionKey = keyof typeof settingsSections;

const settingsData = reactive<Record<SectionKey, Record<string, string>>>({
    seo: { title: "", description: "", keywords: "", canonical: "", robots: "index,follow" },
    openGraph: { ogTitle: "", ogDescription: "", ogImage: "", ogType: "website", twitterCard: "summary_large_image" },
});

const collapsedSections = ref<Record<string, boolean>>({
    seo: false,
    openGraph: true,
});

const isSyncing = ref(false);

const getSelectOptions = (options: any) => {
    if (!options) return [];
    return options;
};

const toggleSection = (key: string) => {
    collapsedSections.value[key] = !collapsedSections.value[key];
};

const { addPending, uploadAllPending, hasPending } = usePendingUploads();
const { addToDeleteQueue, processDeleteQueue, hasUrlsToDelete } = useDeleteQueue();

const handleImageUpload = (event: Event, sectionKey: string, fieldKey: string) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const fieldPath = `${sectionKey}.${fieldKey}`;
    const currentValue = (settingsData as any)[sectionKey][fieldKey];
    const oldUrl = typeof currentValue === 'string' && currentValue.includes('cloudinary') ? currentValue : undefined;

    if (oldUrl) {
        addToDeleteQueue(oldUrl);
    }

    const previewUrl = addPending(fieldPath, file, oldUrl, sectionKey);

    const pendingValue: PendingImageValue = {
        pending: true,
        file,
        previewUrl,
        oldUrl,
    };

    (settingsData as any)[sectionKey][fieldKey] = pendingValue;
    input.value = "";
};

const handleImageRemove = (sectionKey: string, fieldKey: string) => {
    const currentValue = (settingsData as any)[sectionKey][fieldKey];

    if (typeof currentValue === 'string' && currentValue.includes('cloudinary')) {
        addToDeleteQueue(currentValue);
    }

    (settingsData as any)[sectionKey][fieldKey] = '';
};

const syncFromContext = () => {
    if (settings.value) {
        settingsData.seo = { ...settingsData.seo, ...settings.value.seo };
        settingsData.openGraph = { ...settingsData.openGraph, ...settings.value.openGraph };
    }
};

const syncToContext = () => {
    settings.value.seo = { ...settingsData.seo } as any;
    settings.value.openGraph = { ...settingsData.openGraph } as any;
};

const handleSave = async () => {
    emit("saving-change", true);
    try {
        if (hasUrlsToDelete.value) {
            await processDeleteQueue();
        }

        if (hasPending.value) {
            const results = await uploadAllPending();

            // Update settingsData with uploaded URLs
            results.forEach((result, fieldPath) => {
                const [section, field] = fieldPath.split('.');
                if (section && field && (settingsData as any)[section]) {
                    (settingsData as any)[section][field] = result.secure_url;
                }
            });
        }

        syncToContext();
        await saveSettings();
    } catch (e) {
        console.error("Save failed:", e);
        alert("Lưu thất bại: " + (e as Error).message);
    } finally {
        emit("saving-change", false);
    }
};

watch(isDirty, (val) => {
    emit("dirty-change", val);
});

watch(loading, (val) => {
    emit("saving-change", val);
});

watch(settingsData, () => {
    if (isSyncing.value) return;
    syncToContext();
}, { deep: true });

onMounted(async () => {
    await loadSettings();
    isSyncing.value = true;
    syncFromContext();
    await nextTick();
    isSyncing.value = false;
});

const handleDiscard = async () => {
    await loadSettings();
    isSyncing.value = true;
    syncFromContext();
    await nextTick();
    isSyncing.value = false;
};

defineExpose({ handleSave, handleDiscard });
</script>

<style scoped>
@import "../../styles/components/views/settings-view.css";
</style>
