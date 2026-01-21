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
                    <img :src="getImageSrc(item[imageField])" :alt="`Ảnh ${index + 1}`" />
                    <div class="item-overlay" />
                    <div class="item-actions">
                        <button type="button" class="btn-item-action delete" @click="removeItem(index)" :disabled="collectionItems.length <= minItems" title="Xóa">
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
                <img :src="previewSrc" alt="Preview" />
                <span v-if="isPending" class="pending-badge">Chưa lưu</span>
                <button type="button" class="remove-btn" @click="handleRemove">
                    <Icon name="mdi:close" />
                </button>
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
import { ref, computed, watch } from "vue";
import { usePendingUploads, isPendingImage, type PendingImageValue } from "@/admin/composables/usePendingUploads";
import { useDeleteQueue } from "@/admin/composables/useDeleteQueue";
import { getImageSrc, type ImageValue } from "@/admin/utils/imageHelper";
import { resizeImage, type ImageQuality } from "@/admin/utils/imageResizer";

interface CollectionItem {
    [key: string]: ImageValue | string | undefined
}

const props = withDefaults(
    defineProps<{
        modelValue: string | PendingImageValue | CollectionItem[];
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
        minItems: 1,
        maxItems: 20,
        showQualityOption: true,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string | PendingImageValue | CollectionItem[]): void;
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
    (newVal) => {
        if (!isCollectionMode.value && typeof newVal === "string" && newVal && newVal.includes("cloudinary")) {
            lastKnownUrl.value = newVal;
        }
    },
    { immediate: true }
);

const isPending = computed(() => !isCollectionMode.value && isPendingImage(props.modelValue as string | PendingImageValue));

const hasPreview = computed(() => {
    if (isCollectionMode.value) return false;
    const val = props.modelValue as string | PendingImageValue;
    if (isPendingImage(val)) {
        return !!val.previewUrl;
    }
    return !!val;
});

const previewSrc = computed(() => {
    if (isCollectionMode.value) return "";
    const val = props.modelValue as string | PendingImageValue;
    if (isPendingImage(val)) {
        return val.previewUrl;
    }
    return val as string;
});

const isQualityEnabled = computed(() => {
    if (isCollectionMode.value) {
        return collectionItems.value.length === 0;
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

    originalFile.value = file;
    if (originalPreview.value) {
        URL.revokeObjectURL(originalPreview.value);
    }
    originalPreview.value = URL.createObjectURL(file);

    if (lastKnownUrl.value) {
        addToDeleteQueue(lastKnownUrl.value);
    }

    emit("update:modelValue", {
        pending: true,
        file,
        previewUrl: originalPreview.value,
    });

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
    });
};

const handleRemove = () => {
    if (lastKnownUrl.value) {
        addToDeleteQueue(lastKnownUrl.value);
    }
    removePending(props.fieldPath);
    if (originalPreview.value) {
        URL.revokeObjectURL(originalPreview.value);
    }
    originalFile.value = null;
    originalPreview.value = "";
    lastKnownUrl.value = "";
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
    if (collectionItems.value.length <= props.minItems) return;
    collectionItems.value = collectionItems.value.filter((_, i) => i !== index);
};
</script>

<style scoped>
@import "../../styles/components/fields/image-uploader/desktop.css";
@import "../../styles/components/fields/image-uploader/mobile.css";
</style>
