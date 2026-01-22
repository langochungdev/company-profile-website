<!-- Chức năng: Component upload ảnh với local preview, deferred upload - hỗ trợ single và collection mode -->
<template>
    <div class="image-uploader-wrapper" :class="wrapperClasses">
        <div v-if="showQualityOption" class="quality-options">
            <label class="quality-option" :class="{ active: selectedQuality === 'default', disabled: !isQualityEnabled }">
                <input type="radio" value="default" v-model="selectedQuality" :disabled="!isQualityEnabled" />
                <Icon name="mdi:image-filter-center-focus" class="option-icon" />
                <div class="option-content">
                    <span class="option-label">Mặc định</span>
                    <span class="option-desc">Tối ưu dung lượng</span>
                </div>
            </label>
            <label class="quality-option" :class="{ active: selectedQuality === 'high', disabled: !isQualityEnabled }">
                <input type="radio" value="high" v-model="selectedQuality" :disabled="!isQualityEnabled" />
                <Icon name="mdi:high-definition" class="option-icon" />
                <div class="option-content">
                    <span class="option-label">Nét</span>
                    <span class="option-desc">Chất lượng cao</span>
                </div>
            </label>
        </div>
        <div v-if="isProcessing" class="processing-message">
            <Icon name="mdi:loading" class="spin" />
            <span>Đang xử lý ảnh...</span>
        </div>

        <template v-if="isCollectionMode">
            <div v-if="collectionItems.length === 0" class="collection-empty">
                <div class="empty-icon">
                    <Icon name="mdi:image-multiple-outline" />
                </div>
                <h4>Chưa có ảnh nào</h4>
                <p>Thêm ảnh bằng cách kéo thả hoặc click bên dưới</p>
            </div>

            <div v-else class="collection-grid">
                <div v-for="(item, index) in collectionItems" :key="index" class="collection-item" :class="{ dragging: dragIndex === index }" draggable="true" @dragstart="handleDragStart(index)" @dragover.prevent="handleDragOver(index)" @dragend="handleDragEnd">
                    <span class="item-index">{{ index + 1 }}</span>
                    <img :src="getImageSrc(item[imageField])" :alt="`Ảnh ${index + 1}`" @error="handleImageError($event)" />
                    <div class="image-error-placeholder" v-if="imageErrors.has(index)">
                        <Icon name="mdi:image-off-outline" />
                        <span>Không tải được</span>
                    </div>
                    <div class="item-overlay" />
                    <div class="item-actions">
                        <button type="button" class="btn-item-action delete" @click="removeItem(index)" title="Xóa">
                            <Icon name="mdi:trash-can-outline" />
                        </button>
                    </div>
                </div>
            </div>

            <label class="upload-dropzone" :class="{ 'drag-over': dragOver, disabled: collectionItems.length >= maxItems }" @dragover.prevent="dragOver = true" @dragleave="dragOver = false" @drop.prevent="handleCollectionDrop">
                <Icon name="mdi:cloud-upload-outline" class="upload-icon" />
                <span class="upload-text">Kéo thả ảnh hoặc click để chọn</span>
                <input type="file" accept="image/*" multiple :disabled="collectionItems.length >= maxItems" @change="handleCollectionFileSelect" />
            </label>
        </template>

        <template v-else>
            <div v-if="hasPreview" class="image-preview">
                <img :src="previewSrc" alt="Preview" @error="handleSingleImageError" />
                <div class="image-error-placeholder" v-if="singleImageError">
                    <Icon name="mdi:image-off-outline" />
                    <span>Không tải được</span>
                </div>
                <span v-if="isPending" class="pending-badge">Chưa lưu</span>
                <button type="button" class="remove-btn" @click="handleRemove">
                    <Icon name="mdi:close" />
                </button>
            </div>

            <div v-if="hasPreview" class="metadata-panel" :class="{ collapsed: !metadataExpanded }">
                <button type="button" class="metadata-toggle" @click="metadataExpanded = !metadataExpanded">
                    <Icon name="mdi:cog-outline" class="toggle-icon" />
                    <span class="toggle-label">SEO Metadata</span>
                    <Icon :name="metadataExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="toggle-arrow" />
                </button>

                <div v-show="metadataExpanded" class="metadata-fields">
                    <div class="field-group">
                        <label>
                            Alt Text
                            <span class="required">*</span>
                        </label>
                        <input ref="altInput" v-model="metadata.alt" type="text" placeholder="Mô tả ngắn gọn cho ảnh" class="metadata-input" />
                        <span class="hint">Quan trọng cho SEO và accessibility</span>
                    </div>

                    <div class="field-group">
                        <label>Title (Hover)</label>
                        <input v-model="metadata.title" type="text" placeholder="Text hiển thị khi hover" class="metadata-input" />
                    </div>

                    <div class="field-row">
                        <div class="field-group">
                            <label>Width</label>
                            <input v-model.number="metadata.width" type="number" disabled class="metadata-input" />
                        </div>
                        <div class="field-group">
                            <label>Height</label>
                            <input v-model.number="metadata.height" type="number" disabled class="metadata-input" />
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="upload-zone" @click="triggerFileInput" @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false" @drop.prevent="handleDrop">
                <Icon name="mdi:cloud-upload" class="upload-icon" />
                <p class="upload-text">Click hoặc kéo thả ảnh vào</p>
            </div>

            <input ref="fileInput" type="file" :accept="accept" class="hidden-input" @change="handleFileSelect" />
        </template>

        <p v-if="error" class="error-message">
            <Icon name="mdi:alert-circle" />
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { usePendingUploads, isPendingImage, type PendingImageValue } from "@/admin/composables/usePendingUploads";
import { useDeleteQueue } from "@/admin/composables/useDeleteQueue";
import { getImageSrc, type ImageValue } from "@/admin/utils/imageHelper";
import { resizeImage, type ImageQuality } from "@/admin/utils/imageResizer";
import { extractImageDimensions } from "@/admin/utils/imageExtractor";

interface CollectionItem {
    [key: string]: ImageValue | string | undefined
}

const props = withDefaults(
    defineProps<{
        modelValue: ImageValue | CollectionItem[];
        fieldPath: string;
        folder?: string;
        accept?: string;
        mode?: "single" | "collection";
        imageField?: string;
        minItems?: number;
        maxItems?: number;
        showQualityOption?: boolean;
    }>(),
    {
        accept: "image/*",
        mode: "single",
        imageField: "image",
        minItems: 0,
        maxItems: 20,
        showQualityOption: true,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: ImageValue | CollectionItem[]): void;
}>();

const { addPending, removePending } = usePendingUploads();
const { addToDeleteQueue } = useDeleteQueue();

const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);
const error = ref<string | null>(null);
const lastKnownUrl = ref<string>("");
const dragIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);
const selectedQuality = ref<ImageQuality>("default");
const originalFile = ref<File | null>(null);
const originalPreview = ref<string>("");
const isProcessing = ref(false);
const imageErrors = ref<Set<number>>(new Set());
const singleImageError = ref(false);
const metadataExpanded = ref(true);
const altInput = ref<HTMLInputElement | null>(null);
const isRestoringMetadata = ref(false);
const metadata = ref({
    alt: "",
    title: "",
    width: undefined as number | undefined,
    height: undefined as number | undefined,
});

const isCollectionMode = computed(() => props.mode === "collection");

const wrapperClasses = computed(() => ({
    "drag-over": dragOver.value,
    "has-error": !!error.value,
    "is-pending": isPending.value,
    "is-collection": isCollectionMode.value
}));

const collectionItems = computed({
    get: () => (Array.isArray(props.modelValue) ? props.modelValue : []) as CollectionItem[],
    set: (val) => emit("update:modelValue", val)
});

watch(
    () => props.modelValue,
    async (newVal) => {
        if (isCollectionMode.value) return;

        isRestoringMetadata.value = true;

        if (isPendingImage(newVal)) {
            if (newVal.metadata) {
                metadata.value = {
                    alt: newVal.metadata.alt || "",
                    title: newVal.metadata.title || "",
                    width: newVal.metadata.width,
                    height: newVal.metadata.height,
                };
            }
        } else if (typeof newVal === "string") {
            if (newVal && newVal.includes("cloudinary")) {
                lastKnownUrl.value = newVal;
            } else if (newVal === "") {
                lastKnownUrl.value = "";
                singleImageError.value = false;
                originalFile.value = null;
                if (originalPreview.value) {
                    URL.revokeObjectURL(originalPreview.value);
                }
                originalPreview.value = "";
                metadata.value = { alt: "", title: "", width: undefined, height: undefined };
            }
        } else if (newVal && typeof newVal === "object" && "url" in newVal) {
            const imgMeta = newVal as { url: string; alt?: string; title?: string; width?: number; height?: number };
            lastKnownUrl.value = imgMeta.url;
            metadata.value = {
                alt: imgMeta.alt || "",
                title: imgMeta.title || "",
                width: imgMeta.width,
                height: imgMeta.height,
            };
        }

        await nextTick();
        isRestoringMetadata.value = false;
    },
    { immediate: true }
);

const isPending = computed(() => !isCollectionMode.value && isPendingImage(props.modelValue as string | PendingImageValue));

const hasPreview = computed(() => {
    if (isCollectionMode.value) return false;
    const val = props.modelValue;
    if (isPendingImage(val)) {
        return !!val.previewUrl;
    }
    if (typeof val === "string") {
        return !!val;
    }
    if (val && typeof val === "object" && "url" in val) {
        return !!(val as { url: string }).url;
    }
    return false;
});

const previewSrc = computed(() => {
    if (isCollectionMode.value) return "";
    const val = props.modelValue;
    if (isPendingImage(val)) {
        return val.previewUrl;
    }
    if (typeof val === "string") {
        return val;
    }
    if (val && typeof val === "object" && "url" in val) {
        return (val as { url: string }).url;
    }
    return "";
});

const isQualityEnabled = computed(() => {
    if (isCollectionMode.value) {
        return !isProcessing.value;
    }
    return !!originalFile.value && !isProcessing.value;
});

watch(selectedQuality, async (newQuality) => {
    if (!originalFile.value || isProcessing.value) return;
    isProcessing.value = true;
    try {
        await processOriginalFile(newQuality);
    } finally {
        isProcessing.value = false;
    }
});

watch(
    metadata,
    (newMeta) => {
        if (!hasPreview.value) return;
        if (isRestoringMetadata.value) return;

        const currentValue = props.modelValue;

        if (isPending.value) {
            emit("update:modelValue", {
                ...(currentValue as PendingImageValue),
                metadata: {
                    alt: newMeta.alt,
                    title: newMeta.title,
                    width: newMeta.width,
                    height: newMeta.height,
                },
            });
        } else if (currentValue && typeof currentValue === "object" && "url" in currentValue) {
            emit("update:modelValue", {
                url: (currentValue as { url: string }).url,
                alt: newMeta.alt || undefined,
                title: newMeta.title || undefined,
                width: newMeta.width,
                height: newMeta.height,
            });
        } else if (typeof currentValue === "string" && currentValue) {
            emit("update:modelValue", {
                url: currentValue,
                alt: newMeta.alt || undefined,
                title: newMeta.title || undefined,
                width: newMeta.width,
                height: newMeta.height,
            });
        }
    },
    { deep: true }
);

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileSelect = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        await handleFile(file);
    }
    target.value = "";
};

const handleDrop = async (e: DragEvent) => {
    dragOver.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
        await handleFile(file);
    }
};

const handleFile = async (file: File) => {
    error.value = null;
    singleImageError.value = false;

    originalFile.value = file;
    if (originalPreview.value) {
        URL.revokeObjectURL(originalPreview.value);
    }
    originalPreview.value = URL.createObjectURL(file);

    if (lastKnownUrl.value) {
        addToDeleteQueue(lastKnownUrl.value);
    }

    try {
        const dimensions = await extractImageDimensions(file);
        metadata.value.width = dimensions.width;
        metadata.value.height = dimensions.height;
    } catch (e) {
        console.error("[ImageUploader] Failed to extract dimensions:", e);
    }

    metadataExpanded.value = true;

    await nextTick();
    altInput.value?.focus();

    await processOriginalFile(selectedQuality.value);
};

const processOriginalFile = async (quality: ImageQuality) => {
    if (!originalFile.value) return;

    const resizedFile = await resizeImage(originalFile.value, quality);
    const previewUrl = addPending(props.fieldPath, resizedFile, undefined, props.folder);

    emit("update:modelValue", {
        pending: true,
        file: resizedFile,
        previewUrl,
        metadata: {
            alt: metadata.value.alt,
            title: metadata.value.title,
            width: metadata.value.width,
            height: metadata.value.height,
        },
    });
};

const handleRemove = () => {
    if (lastKnownUrl.value && !singleImageError.value) {
        addToDeleteQueue(lastKnownUrl.value);
    }
    removePending(props.fieldPath);
    if (originalPreview.value) {
        URL.revokeObjectURL(originalPreview.value);
    }
    originalFile.value = null;
    originalPreview.value = "";
    lastKnownUrl.value = "";
    singleImageError.value = false;
    metadata.value = {
        alt: "",
        title: "",
        width: undefined,
        height: undefined,
    };
    emit("update:modelValue", "");
};

const handleDragStart = (index: number) => {
    dragIndex.value = index;
};

const handleDragOver = (index: number) => {
    if (dragIndex.value === null || dragIndex.value === index) return;
    dragOverIndex.value = index;

    const items = [...collectionItems.value];
    const draggedItem = items.splice(dragIndex.value, 1)[0];
    if (!draggedItem) return;
    items.splice(index, 0, draggedItem);
    dragIndex.value = index;
    collectionItems.value = items;
};

const handleDragEnd = () => {
    dragIndex.value = null;
    dragOverIndex.value = null;
};

const handleCollectionDrop = async (event: DragEvent) => {
    dragOver.value = false;
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    await processFiles(Array.from(files));
};

const handleCollectionFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    await processFiles(Array.from(input.files));
    input.value = "";
};

const processFiles = async (files: File[]) => {
    const remainingSlots = props.maxItems - collectionItems.value.length;
    const imageFiles = files.filter(f => f.type.startsWith("image/")).slice(0, remainingSlots);

    const newItems: CollectionItem[] = [];
    const currentLength = collectionItems.value.length;

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (!file) continue;

        const resizedFile = await resizeImage(file, selectedQuality.value);
        const fieldPath = `${props.fieldPath}.${currentLength + i}.${props.imageField}`;
        const previewUrl = addPending(fieldPath, resizedFile);

        const pendingImage: PendingImageValue = {
            pending: true,
            file: resizedFile,
            previewUrl,
        };
        newItems.push({ [props.imageField]: pendingImage });
    }

    collectionItems.value = [...collectionItems.value, ...newItems];
};

const removeItem = (index: number) => {
    const item = collectionItems.value[index];
    if (item) {
        const imageValue = item[props.imageField];
        const hasImageError = imageErrors.value.has(index);

        if (typeof imageValue === 'string' && imageValue.includes('cloudinary') && !hasImageError) {
            addToDeleteQueue(imageValue);
        }
    }

    imageErrors.value.delete(index);
    collectionItems.value = collectionItems.value.filter((_, i) => i !== index);
};

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    const index = parseInt(img.closest('.collection-item')?.querySelector('.item-index')?.textContent || '0') - 1;
    imageErrors.value.add(index);
    img.style.opacity = '0';
};

const handleSingleImageError = (event: Event) => {
    singleImageError.value = true;
    const img = event.target as HTMLImageElement;
    img.style.opacity = '0';
};
</script>

<style scoped>
@import "../../styles/components/fields/image-uploader/desktop.css";
@import "../../styles/components/fields/image-uploader/mobile.css";
</style>
