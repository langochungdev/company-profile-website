<!-- Chức năng: Component upload ảnh với local preview, deferred upload -->
<template>
    <div class="image-uploader-wrapper" :class="{ 'drag-over': dragOver, 'has-error': !!error, 'is-pending': isPending }">
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

const props = withDefaults(
    defineProps<{
        modelValue: string | PendingImageValue;
        fieldPath: string;
        folder?: string;
        accept?: string;
    }>(),
    {
        accept: "image/*",
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string | PendingImageValue): void;
}>();

const { addPending, removePending } = usePendingUploads();
const { addToDeleteQueue } = useDeleteQueue();

const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);
const error = ref<string | null>(null);
const lastKnownUrl = ref<string>("");

watch(
    () => props.modelValue,
    (newVal) => {
        if (typeof newVal === "string" && newVal && newVal.includes("cloudinary")) {
            lastKnownUrl.value = newVal;
        }
    },
    { immediate: true }
);

const isPending = computed(() => isPendingImage(props.modelValue));

const hasPreview = computed(() => {
    if (isPendingImage(props.modelValue)) {
        return !!props.modelValue.previewUrl;
    }
    return !!props.modelValue;
});

const previewSrc = computed(() => {
    if (isPendingImage(props.modelValue)) {
        return props.modelValue.previewUrl;
    }
    return props.modelValue;
});

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        handleFile(file);
    }
    target.value = "";
};

const handleDrop = (e: DragEvent) => {
    dragOver.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
        handleFile(file);
    }
};

const handleFile = (file: File) => {
    error.value = null;

    if (lastKnownUrl.value) {
        addToDeleteQueue(lastKnownUrl.value);
        console.log("[ImageUploader] Added to delete queue:", lastKnownUrl.value);
    }

    const previewUrl = addPending(props.fieldPath, file, undefined, props.folder);

    emit("update:modelValue", {
        pending: true,
        file,
        previewUrl,
    });
};

const handleRemove = () => {
    if (lastKnownUrl.value) {
        addToDeleteQueue(lastKnownUrl.value);
    }
    removePending(props.fieldPath);
    lastKnownUrl.value = "";
    emit("update:modelValue", "");
};
</script>

<style scoped>
@import "../../styles/components/fields/image-uploader/desktop.css";
@import "../../styles/components/fields/image-uploader/mobile.css";
</style>
