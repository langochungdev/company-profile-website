<!-- Chức năng: Render dynamic field types cho admin editor -->
<template>
    <div class="field-wrapper">
        <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required-mark">*</span>
        </label>

        <template v-if="field.type === 'text'">
            <input type="text" class="field-input" :value="modelValue" :maxlength="field.max" :placeholder="field.placeholder" @input="handleInput($event)" />
            <div v-if="field.max" class="char-counter">
                {{ String(modelValue || '').length }}/{{ field.max }}
            </div>
        </template>

        <template v-else-if="field.type === 'textarea'">
            <textarea class="field-textarea" :value="String(modelValue || '')" :maxlength="field.max" :rows="field.rows || 3" :placeholder="field.placeholder" @input="handleInput($event)" />
            <div v-if="field.max" class="char-counter">
                {{ String(modelValue || '').length }}/{{ field.max }}
            </div>
        </template>

        <template v-else-if="field.type === 'number'">
            <input type="number" class="field-input" :value="modelValue" :min="field.min" :max="field.max" @input="handleNumberInput($event)" />
        </template>

        <template v-else-if="field.type === 'boolean'">
            <label class="toggle-wrapper">
                <input type="checkbox" class="toggle-input" :checked="Boolean(modelValue)" @change="handleCheckbox($event)" />
                <span class="toggle-slider" />
                <span class="toggle-label">{{ modelValue ? 'Bật' : 'Tắt' }}</span>
            </label>
        </template>

        <template v-else-if="field.type === 'select'">
            <select class="field-select" :value="modelValue" @change="handleInput($event)">
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
        </template>

        <template v-else-if="field.type === 'image'">
            <ImageUploader :model-value="modelValue as any" :folder="field.folder" :field-path="fieldPath || field.label" @update:model-value="emit('update:modelValue', $event)" />
        </template>

        <template v-else-if="field.type === 'video'">
            <input type="text" class="field-input" :value="modelValue" placeholder="Nhập YouTube URL hoặc upload video" @input="handleInput($event)" />
            <div v-if="modelValue && String(modelValue).includes('youtube')" class="video-preview">
                <iframe :src="getYouTubeEmbed(String(modelValue))" frameborder="0" allowfullscreen />
            </div>
        </template>

        <template v-else-if="field.type === 'richtext'">
            <RichTextEditor :model-value="String(modelValue || '')" :placeholder="field.placeholder" :max-length="field.max" @update:model-value="emit('update:modelValue', $event)" />
        </template>

        <p v-if="field.note" class="field-note">{{ field.note }}</p>
    </div>
</template>

<script setup lang="ts">
import RichTextEditor from './RichTextEditor.vue'
import ImageUploader from './ImageUploader.vue'

interface FieldConfig {
    type: string
    label: string
    required?: boolean
    max?: number
    min?: number
    rows?: number
    options?: string[]
    note?: string
    placeholder?: string
    default?: unknown
    folder?: string
}

const props = defineProps<{
    field: FieldConfig
    modelValue: unknown
    fieldPath?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: unknown): void
}>()

const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', target.value)
}

const handleNumberInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', Number(target.value))
}

const handleCheckbox = (e: Event) => {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', target.checked)
}

const getYouTubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : ''
}
</script>

<style scoped>
@import "../../styles/components/fields/field/desktop.css";
@import "../../styles/components/fields/field/mobile.css";
</style>
