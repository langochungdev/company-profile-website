<!-- Chức năng: Component upload ảnh lên Cloudinary với progress bar -->
<template>
    <div class="image-uploader-wrapper" :class="{ 'drag-over': dragOver, 'has-error': !!error }">
        <div v-if="uploading" class="upload-progress">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${progress}%` }" />
            </div>
            <span class="progress-text">{{ progress }}%</span>
            <p class="progress-label">Đang upload...</p>
        </div>

        <div v-else-if="modelValue" class="image-preview">
            <img :src="modelValue" alt="Preview" />
            <button type="button" class="remove-btn" :disabled="deleting" @click="handleRemove">
                <Icon v-if="deleting" name="mdi:loading" class="spin" />
                <Icon v-else name="mdi:close" />
            </button>
        </div>

        <div v-else-if="!modelValue" class="upload-zone" @click="triggerFileInput" @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false" @drop.prevent="handleDrop">
            <Icon name="mdi:cloud-upload" class="upload-icon" />
            <p class="upload-text">Click hoặc kéo thả ảnh vào</p>
        </div>

        <input ref="fileInput" type="file" :accept="accept" class="hidden-input" @change="handleFileSelect" />

        <p v-if="error" class="error-message">
            <Icon name="mdi:alert-circle" />
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCloudinaryUpload } from "@/admin/composables/useCloudinaryUpload";
import { extractPublicId, isCloudinaryUrl } from "@/admin/utils/cloudinary";

const props = withDefaults(
    defineProps<{
        modelValue: string;
        folder?: string;
        accept?: string;
    }>(),
    {
        accept: "image/*",
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const { uploading, progress, error: uploadError, upload, deleteAsset } = useCloudinaryUpload();

const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);
const deleting = ref(false);
const error = ref<string | null>(null);

const triggerFileInput = () => {
    fileInput.value?.click();
};

const deleteOldImage = async (oldUrl: string) => {
    if (!oldUrl || !isCloudinaryUrl(oldUrl)) return;

    const publicId = extractPublicId(oldUrl);
    if (!publicId) return;

    try {
        await deleteAsset(publicId);
    } catch (e) {
        console.warn("[ImageUploader] Failed to delete old image:", e);
    }
};

const handleUpload = async (file: File) => {
    error.value = null;

    const oldUrl = props.modelValue;

    try {
        const result = await upload(file, { folder: props.folder });
        emit("update:modelValue", result.secure_url);

        if (oldUrl) {
            await deleteOldImage(oldUrl);
        }
    } catch (e) {
        error.value = (e as Error).message || "Upload thất bại";
    }
};

const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        handleUpload(file);
    }
    target.value = "";
};

const handleDrop = (e: DragEvent) => {
    dragOver.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
        handleUpload(file);
    }
};

const handleRemove = async () => {
    error.value = null;
    deleting.value = true;

    try {
        await deleteOldImage(props.modelValue);
        emit("update:modelValue", "");
    } catch (e) {
        error.value = (e as Error).message || "Xóa thất bại";
    } finally {
        deleting.value = false;
    }
};

watch(uploadError, (newError) => {
    if (newError) {
        error.value = newError.message;
    }
});
</script>

<style scoped>
@import "../../styles/components/fields/image-uploader/desktop.css";
@import "../../styles/components/fields/image-uploader/mobile.css";
</style>
