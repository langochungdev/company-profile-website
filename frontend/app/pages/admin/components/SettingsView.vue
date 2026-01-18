<!-- Chức năng: Settings tab cho SEO, Open Graph, Analytics và Advanced settings -->
<template>
    <div class="settings-view-wrapper">
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

                        <input v-if="field.type === 'text'" v-model="formData[sectionKey][fieldKey]" type="text" class="field-input" :placeholder="(field as any).placeholder" :maxlength="(field as any).max" />

                        <textarea v-else-if="field.type === 'textarea'" v-model="formData[sectionKey][fieldKey]" class="field-textarea" :placeholder="(field as any).placeholder" :maxlength="(field as any).max" :rows="(field as any).rows || 3" />

                        <select v-else-if="field.type === 'select'" v-model="formData[sectionKey][fieldKey]" class="field-select">
                            <option v-for="opt in (field as any).options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                        </select>

                        <div v-else-if="field.type === 'color'" class="color-field">
                            <input v-model="formData[sectionKey][fieldKey]" type="color" class="color-picker" />
                            <input v-model="formData[sectionKey][fieldKey]" type="text" class="color-text" placeholder="#000000" />
                        </div>

                        <div v-else-if="field.type === 'image'" class="image-field">
                            <div v-if="formData[sectionKey][fieldKey]" class="image-preview">
                                <img :src="formData[sectionKey][fieldKey]" :alt="field.label" />
                                <button class="btn-remove" @click="formData[sectionKey][fieldKey] = ''">
                                    <Icon name="mdi:close" />
                                </button>
                            </div>
                            <label v-else class="image-upload">
                                <Icon name="mdi:cloud-upload" />
                                <span>Chọn ảnh</span>
                                <input type="file" accept="image/*" class="hidden" @change="handleImageUpload($event, sectionKey, fieldKey)" />
                            </label>
                            <p v-if="(field as any).size" class="size-hint">Kích thước: {{ (field as any).size }}</p>
                        </div>

                        <div v-else-if="field.type === 'code'" class="code-field">
                            <textarea v-model="formData[sectionKey][fieldKey]" class="code-textarea" :placeholder="(field as any).placeholder" :rows="(field as any).rows || 5" spellcheck="false" />
                        </div>

                        <span v-if="(field as any).max" class="char-count">{{ (formData[sectionKey][fieldKey] || '').length }}/{{ (field as any).max }}</span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";

const props = defineProps<{
    pageKey: string;
    pageName: string;
}>();

const emit = defineEmits<{
    "dirty-change": [isDirty: boolean];
    "saving-change": [isSaving: boolean];
}>();

const settingsSections = {
    seo: {
        label: "SEO & Meta",
        icon: "mdi:magnify",
        fields: {
            title: { type: "text", label: "Page Title", placeholder: "Tiêu đề trang...", max: 60, note: "Tiêu đề hiển thị trên tab trình duyệt và kết quả tìm kiếm" },
            description: { type: "textarea", label: "Meta Description", placeholder: "Mô tả trang...", max: 160, rows: 3, note: "Mô tả ngắn gọn nội dung trang (tối đa 160 ký tự)" },
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
            ogTitle: { type: "text", label: "OG Title", placeholder: "Tiêu đề khi chia sẻ...", max: 60 },
            ogDescription: { type: "textarea", label: "OG Description", placeholder: "Mô tả khi chia sẻ...", max: 200, rows: 2 },
            ogImage: { type: "image", label: "OG Image", size: "1200x630px", note: "Ảnh hiển thị khi chia sẻ lên Facebook, LinkedIn..." },
            ogType: {
                type: "select",
                label: "OG Type",
                options: [
                    { value: "website", label: "Website" },
                    { value: "article", label: "Article" },
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
    branding: {
        label: "Favicon & Branding",
        icon: "mdi:palette",
        fields: {
            favicon: { type: "image", label: "Favicon", size: "32x32px", note: "Icon hiển thị trên tab trình duyệt" },
            appleTouchIcon: { type: "image", label: "Apple Touch Icon", size: "180x180px" },
            themeColor: { type: "color", label: "Theme Color", note: "Màu theme cho mobile browser" },
        },
    },
    analytics: {
        label: "Analytics & Tracking",
        icon: "mdi:chart-line",
        fields: {
            gaId: { type: "text", label: "Google Analytics 4 ID", placeholder: "G-XXXXXXXXXX" },
            gtmId: { type: "text", label: "Google Tag Manager ID", placeholder: "GTM-XXXXXXX" },
            fbPixelId: { type: "text", label: "Facebook Pixel ID", placeholder: "123456789012345" },
            customHeadScripts: { type: "code", label: "Custom Head Scripts", placeholder: "<!-- Thêm scripts vào <head> -->", rows: 4 },
        },
    },
    advanced: {
        label: "Advanced",
        icon: "mdi:code-tags",
        fields: {
            customCss: { type: "code", label: "Custom CSS", placeholder: "/* Custom styles */", rows: 6 },
            customFooterScripts: { type: "code", label: "Footer Scripts", placeholder: "<!-- Scripts trước </body> -->", rows: 4 },
            googleVerification: { type: "text", label: "Google Site Verification", placeholder: "google-site-verification=..." },
            bingVerification: { type: "text", label: "Bing Verification", placeholder: "msvalidate.01=..." },
        },
    },
};

type SectionKey = keyof typeof settingsSections;

const formData = reactive<Record<SectionKey, Record<string, string>>>({
    seo: { title: "", description: "", keywords: "", canonical: "", robots: "index,follow" },
    openGraph: { ogTitle: "", ogDescription: "", ogImage: "", ogType: "website", twitterCard: "summary_large_image" },
    branding: { favicon: "", appleTouchIcon: "", themeColor: "#3b82f6" },
    analytics: { gaId: "", gtmId: "", fbPixelId: "", customHeadScripts: "" },
    advanced: { customCss: "", customFooterScripts: "", googleVerification: "", bingVerification: "" },
});

const originalData = ref<string>("");
const collapsedSections = ref<Record<string, boolean>>({});
const isSaving = ref(false);

const isDirty = computed(() => JSON.stringify(formData) !== originalData.value);

const toggleSection = (key: string) => {
    collapsedSections.value[key] = !collapsedSections.value[key];
};

const handleImageUpload = (event: Event, sectionKey: string, fieldKey: string) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            (formData as any)[sectionKey][fieldKey] = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const handleSave = async () => {
    isSaving.value = true;
    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        originalData.value = JSON.stringify(formData);
    } finally {
        isSaving.value = false;
    }
};

watch(isDirty, (val) => {
    emit("dirty-change", val);
});

watch(isSaving, (val) => {
    emit("saving-change", val);
});

onMounted(() => {
    originalData.value = JSON.stringify(formData);
});

defineExpose({ handleSave });
</script>

<style scoped>
@import "../styles/settings-view.css";
</style>
