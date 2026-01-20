<!-- Chức năng: Popup editor cho Live Edit mode - hỗ trợ cả field đơn và collection -->
<template>
    <Teleport to="body">
        <Transition name="popup">
            <div v-if="isOpen" class="popup-overlay" @click.self="$emit('close')">
                <div class="popup-editor" :class="{ 'popup-editor--collection': isCollectionMode }">
                    <header class="popup-header">
                        <div class="header-info">
                            <Icon :name="headerIcon" class="header-icon" />
                            <div class="header-text">
                                <h3>{{ headerTitle }}</h3>
                                <p v-if="isCollectionMode" class="header-count">{{ collectionItems.length }} / {{ maxItems }} ảnh</p>
                            </div>
                        </div>
                        <button class="btn-close" @click="$emit('close')">
                            <Icon name="mdi:close" />
                        </button>
                    </header>

                    <div class="popup-content">
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
                                        <button class="btn-item-action delete" @click="removeItem(index)" :disabled="collectionItems.length <= minItems" title="Xóa">
                                            <Icon name="mdi:trash-can-outline" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <label class="upload-dropzone" :class="{ 'drag-over': isDragOver, disabled: collectionItems.length >= maxItems }" @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false" @drop.prevent="handleDrop">
                                <Icon name="mdi:cloud-upload-outline" class="upload-icon" />
                                <span class="upload-text">Kéo thả ảnh hoặc click để chọn</span>
                                <input type="file" accept="image/*" multiple :disabled="collectionItems.length >= maxItems" @change="handleFileSelect" />
                            </label>
                        </template>

                        <template v-else>
                            <Field v-if="fieldConfig && isReady" :field="(fieldConfig as any)" :model-value="localValue" :field-path="fieldPath" @update:model-value="localValue = $event" />
                            <p v-if="fieldConfig?.note" class="field-note">
                                <Icon name="mdi:information-outline" />
                                {{ fieldConfig.note }}
                            </p>
                        </template>
                    </div>

                    <footer class="popup-footer">
                        <button class="btn-cancel" @click="$emit('close')">
                            <Icon name="mdi:close" />
                            <span>Hủy</span>
                        </button>
                        <button class="btn-apply" @click="handleApply">
                            <Icon name="mdi:check" />
                            <span>Áp dụng</span>
                        </button>
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import Field from '../fields/Field.vue'
import type { FieldConfig } from '../../config/page.config'
import { getImageSrc, type ImageValue } from '@/admin/utils/imageHelper'
import { usePendingUploads, type PendingImageValue } from '@/admin/composables/usePendingUploads'

interface CollectionItem {
    [key: string]: ImageValue | string | undefined
}

const props = defineProps<{
    isOpen: boolean
    fieldConfig: FieldConfig | null
    initialValue: unknown
    fieldPath?: string
    mode?: 'field' | 'collection'
    imageField?: string
    minItems?: number
    maxItems?: number
}>()

const emit = defineEmits<{
    close: []
    apply: [value: unknown]
}>()

const localValue = ref<unknown>(props.initialValue)
const isReady = ref(false)
const isDragOver = ref(false)
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const isCollectionMode = computed(() => props.mode === 'collection')
const imageField = computed(() => props.imageField || 'image')
const minItems = computed(() => props.minItems || 1)
const maxItems = computed(() => props.maxItems || 20)

const headerIcon = computed(() => isCollectionMode.value ? 'mdi:image-multiple' : 'mdi:pencil')
const headerTitle = computed(() => props.fieldConfig?.label || (isCollectionMode.value ? 'Quản lý ảnh' : 'Chỉnh sửa'))

const collectionItems = computed({
    get: () => (Array.isArray(localValue.value) ? localValue.value : []) as CollectionItem[],
    set: (val) => { localValue.value = val }
})

watch(() => props.initialValue, (newVal) => {
    localValue.value = newVal
}, { immediate: true })

watch(() => props.isOpen, async (isOpen) => {
    if (isOpen) {
        isReady.value = false
        await nextTick()
        localValue.value = props.initialValue
        await nextTick()
        isReady.value = true
    } else {
        isReady.value = false
        isDragOver.value = false
        dragIndex.value = null
    }
})

const handleApply = () => {
    emit('apply', localValue.value)
}

const handleDragStart = (index: number) => {
    dragIndex.value = index
}

const handleDragOver = (index: number) => {
    if (dragIndex.value === null || dragIndex.value === index) return
    dragOverIndex.value = index

    const items = [...collectionItems.value]
    const draggedItem = items.splice(dragIndex.value, 1)[0]
    if (!draggedItem) return
    items.splice(index, 0, draggedItem)
    dragIndex.value = index
    collectionItems.value = items
}

const handleDragEnd = () => {
    dragIndex.value = null
    dragOverIndex.value = null
}

const handleDrop = async (event: DragEvent) => {
    isDragOver.value = false
    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return
    await processFiles(Array.from(files))
}

const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    await processFiles(Array.from(input.files))
    input.value = ''
}

const { addPending } = usePendingUploads()

const processFiles = async (files: File[]) => {
    const remainingSlots = maxItems.value - collectionItems.value.length
    const filesToAdd = files.filter(f => f.type.startsWith('image/')).slice(0, remainingSlots)

    const newItems: CollectionItem[] = []
    const currentLength = collectionItems.value.length

    for (let i = 0; i < filesToAdd.length; i++) {
        const file = filesToAdd[i]
        if (!file) continue

        const fieldPath = `${props.fieldPath}.${currentLength + i}.${imageField.value}`
        const previewUrl = addPending(fieldPath, file)

        const pendingImage: PendingImageValue = {
            pending: true,
            file,
            previewUrl,
        }
        newItems.push({ [imageField.value]: pendingImage })
    }

    collectionItems.value = [...collectionItems.value, ...newItems]
}

const removeItem = (index: number) => {
    if (collectionItems.value.length <= minItems.value) return
    collectionItems.value = collectionItems.value.filter((_, i) => i !== index)
}
</script>

<style scoped>
@import "../../styles/components/views/field-popup-editor/desktop.css";
@import "../../styles/components/views/field-popup-editor/mobile.css";
</style>
