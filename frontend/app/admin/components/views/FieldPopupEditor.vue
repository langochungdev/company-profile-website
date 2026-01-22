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
                                <p v-if="isCollectionMode" class="header-count">{{ collectionLength }} / {{ maxItems }} ảnh</p>
                            </div>
                        </div>
                        <button class="btn-close" @click="$emit('close')">
                            <Icon name="mdi:close" />
                        </button>
                    </header>

                    <div class="popup-content">
                        <template v-if="isCollectionMode">
                            <ImageUploader mode="collection" :model-value="(localValue as CollectionItem[])" :field-path="fieldPath || ''" :image-field="imageField" :min-items="minItems" :max-items="maxItems" @update:model-value="localValue = $event" />
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
import Field from '@/admin/components/fields/Field.vue'
import ImageUploader from '@/admin/components/fields/ImageUploader.vue'
import { useTempFormState } from '@/admin/composables/useTempFormState'
import type { FieldConfig } from '@/admin/config/page.config'
import type { ImageValue } from '@/admin/utils/imageHelper'

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

const { saveTempState, getTempState, hasTempState } = useTempFormState()

const localValue = ref<unknown>(props.initialValue)
const isReady = ref(false)

const isCollectionMode = computed(() => props.mode === 'collection')
const imageField = computed(() => props.imageField || 'image')
const minItems = computed(() => props.minItems || 1)
const maxItems = computed(() => props.maxItems || 20)

const headerIcon = computed(() => isCollectionMode.value ? 'mdi:image-multiple' : 'mdi:pencil')
const headerTitle = computed(() => props.fieldConfig?.label || (isCollectionMode.value ? 'Quản lý ảnh' : 'Chỉnh sửa'))

const collectionLength = computed(() => {
    if (!Array.isArray(localValue.value)) return 0
    return localValue.value.length
})

watch(() => props.isOpen, async (isOpen) => {
    if (isOpen) {
        isReady.value = false
        await nextTick()

        if (props.fieldPath && hasTempState(props.fieldPath)) {
            localValue.value = getTempState(props.fieldPath)
        } else {
            localValue.value = props.initialValue
        }

        await nextTick()
        isReady.value = true
    } else {
        isReady.value = false
    }
})

const handleApply = () => {
    if (props.fieldPath) {
        saveTempState(props.fieldPath, localValue.value)
    }
    emit('apply', localValue.value)
}
</script>

<style scoped>
@import "../../styles/components/views/field-popup-editor/desktop.css";
@import "../../styles/components/views/field-popup-editor/mobile.css";
</style>
