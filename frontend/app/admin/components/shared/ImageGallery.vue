<template>
    <div class="image-gallery-wrapper">
        <div class="gallery-header">
            <button v-if="canAddMore" type="button" class="btn-add-image" @click="triggerUpload">
                <Icon name="mdi:plus" />
                <span>Thêm ảnh</span>
            </button>
            <input ref="fileInput" type="file" accept="image/*" multiple @change="handleUpload" style="display: none" />
            <span class="image-count">{{ modelValue.length }}/{{ max }}</span>
        </div>

        <div v-if="modelValue.length > 0" class="gallery-grid">
            <div v-for="(img, index) in modelValue" :key="index" class="gallery-item">
                <img :src="img.url" :alt="img.alt || 'Image'" />
                <div class="item-overlay">
                    <button type="button" class="btn-remove" @click="removeImage(index)">
                        <Icon name="mdi:delete" />
                    </button>
                    <button v-if="index > 0" type="button" class="btn-move" @click="moveUp(index)">
                        <Icon name="mdi:arrow-up" />
                    </button>
                </div>
                <input :value="img.alt" type="text" placeholder="Alt text..." class="alt-input" @input="updateAlt(index, ($event.target as HTMLInputElement).value)" />
            </div>
        </div>

        <p v-if="modelValue.length < min" class="error-hint">
            Cần tối thiểu {{ min }} ảnh
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePendingUploads } from '@/admin/composables/usePendingUploads'
import { useDeleteQueue } from '@/admin/composables/useDeleteQueue'
import { resizeImage } from '@/admin/utils/imageResizer'

interface ImageItem {
    url: string
    alt: string
    width?: number
    height?: number
    pending?: boolean
    fieldPath?: string
}

const props = withDefaults(defineProps<{
    modelValue: ImageItem[]
    min?: number
    max?: number
    folder?: string
}>(), {
    min: 1,
    max: 10,
    folder: 'products'
})

const emit = defineEmits<{
    'update:modelValue': [value: ImageItem[]]
}>()

const { addPending, removePending } = usePendingUploads()
const { addToDeleteQueue } = useDeleteQueue()

const fileInput = ref<HTMLInputElement>()
const canAddMore = computed(() => props.modelValue.length < props.max)

const triggerUpload = () => {
    fileInput.value?.click()
}

const handleUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = Array.from(input.files || [])

    for (const file of files) {
        if (props.modelValue.length >= props.max) break

        const resizedFile = await resizeImage(file, 'default')
        const uniqueFieldPath = `images.${Date.now()}.${Math.random().toString(36).substring(7)}`
        const oldUrl = props.modelValue.length > 0 ? props.modelValue[props.modelValue.length - 1]?.url : undefined

        const previewUrl = addPending(uniqueFieldPath, resizedFile, oldUrl, props.folder)

        const newImages = [...props.modelValue, {
            url: previewUrl,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            pending: true,
            fieldPath: uniqueFieldPath
        }]

        emit('update:modelValue', newImages)
    }

    input.value = ''
}

const removeImage = (index: number) => {
    const img = props.modelValue[index]
    if (img?.fieldPath) {
        removePending(img.fieldPath)
    }
    // Track Cloudinary URL để xóa sau khi save
    if (img?.url && img.url.includes('cloudinary') && !img.pending) {
        addToDeleteQueue(img.url)
    }
    const newImages = [...props.modelValue]
    newImages.splice(index, 1)
    emit('update:modelValue', newImages)
}

const moveUp = (index: number) => {
    if (index === 0) return
    const newImages = [...props.modelValue]
    const temp = newImages[index - 1]!
    newImages[index - 1] = newImages[index]!
    newImages[index] = temp
    emit('update:modelValue', newImages)
}

const updateAlt = (index: number, newAlt: string) => {
    const newImages = props.modelValue.map((img, i) =>
        i === index ? { ...img, alt: newAlt } : img
    )
    emit('update:modelValue', newImages)
}
</script>

<style scoped>
.image-gallery-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.gallery-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-add-image {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-add-image:hover {
    background: #1d4ed8;
}

.image-count {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
}

.gallery-item {
    position: relative;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

.gallery-item img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
}

.item-overlay {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
}

.gallery-item:hover .item-overlay {
    opacity: 1;
}

.btn-remove,
.btn-move {
    padding: 6px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.btn-remove:hover {
    background: #dc2626;
}

.btn-move:hover {
    background: #2563eb;
}

.alt-input {
    width: 100%;
    padding: 6px 8px;
    border: none;
    border-top: 1px solid #e5e7eb;
    font-size: 12px;
}

.error-hint {
    color: #dc2626;
    font-size: 14px;
    margin: 0;
}
</style>
