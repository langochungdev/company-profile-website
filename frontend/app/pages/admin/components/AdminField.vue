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
            <div class="image-upload">
                <div v-if="modelValue" class="image-preview">
                    <img :src="String(modelValue)" alt="Preview" />
                    <button class="remove-image" @click="$emit('update:modelValue', '')">
                        <Icon name="mdi:close" />
                    </button>
                </div>
                <div v-else class="upload-placeholder">
                    <Icon name="mdi:cloud-upload" class="upload-icon" />
                    <span>Click để upload ảnh</span>
                    <input type="file" accept="image/*" class="file-input" @change="handleImageUpload" />
                </div>
            </div>
        </template>

        <template v-else-if="field.type === 'video'">
            <input type="text" class="field-input" :value="modelValue" placeholder="Nhập YouTube URL hoặc upload video" @input="handleInput($event)" />
            <div v-if="modelValue && String(modelValue).includes('youtube')" class="video-preview">
                <iframe :src="getYouTubeEmbed(String(modelValue))" frameborder="0" allowfullscreen />
            </div>
        </template>

        <template v-else-if="field.type === 'richtext'">
            <div class="richtext-toolbar">
                <button type="button" @click="execCommand('bold')">
                    <Icon name="mdi:format-bold" />
                </button>
                <button type="button" @click="execCommand('italic')">
                    <Icon name="mdi:format-italic" />
                </button>
                <button type="button" @click="execCommand('insertUnorderedList')">
                    <Icon name="mdi:format-list-bulleted" />
                </button>
                <button type="button" @click="execCommand('insertOrderedList')">
                    <Icon name="mdi:format-list-numbered" />
                </button>
            </div>
            <div ref="richtextRef" class="richtext-editor" contenteditable="true" @input="handleRichtextInput" v-html="modelValue" />
        </template>

        <p v-if="field.note" class="field-note">{{ field.note }}</p>
    </div>
</template>

<script setup lang="ts">
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
}

const props = defineProps<{
    field: FieldConfig
    modelValue: unknown
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

const richtextRef = ref<HTMLElement | null>(null)

const handleImageUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = () => {
            emit('update:modelValue', reader.result as string)
        }
        reader.readAsDataURL(file)
    }
}

const getYouTubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : ''
}

const execCommand = (command: string) => {
    document.execCommand(command, false)
}

const handleRichtextInput = () => {
    if (richtextRef.value) {
        emit('update:modelValue', richtextRef.value.innerHTML)
    }
}
</script>

<style scoped>
.field-wrapper {
    margin-bottom: 20px;
}

.field-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
}

.required-mark {
    color: #ef4444;
    margin-left: 2px;
}

.field-input,
.field-textarea,
.field-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;
    background: #ffffff;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-textarea {
    resize: vertical;
    min-height: 80px;
}

.char-counter {
    text-align: right;
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
}

.field-note {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
}

.toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.toggle-input {
    display: none;
}

.toggle-slider {
    width: 44px;
    height: 24px;
    background: #d1d5db;
    border-radius: 12px;
    position: relative;
    transition: background 0.2s;
}

.toggle-slider::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #ffffff;
    border-radius: 50%;
    transition: transform 0.2s;
}

.toggle-input:checked+.toggle-slider {
    background: #3b82f6;
}

.toggle-input:checked+.toggle-slider::after {
    transform: translateX(20px);
}

.toggle-label {
    font-size: 14px;
    color: #374151;
}

.image-upload {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    overflow: hidden;
}

.image-preview {
    position: relative;
    max-width: 300px;
}

.image-preview img {
    width: 100%;
    height: auto;
    display: block;
}

.remove-image {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-placeholder {
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #6b7280;
    cursor: pointer;
    position: relative;
}

.upload-icon {
    width: 40px;
    height: 40px;
    color: #9ca3af;
}

.file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

.video-preview {
    margin-top: 12px;
    aspect-ratio: 16/9;
    max-width: 400px;
}

.video-preview iframe {
    width: 100%;
    height: 100%;
    border-radius: 8px;
}

.richtext-toolbar {
    display: flex;
    gap: 4px;
    padding: 8px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
}

.richtext-toolbar button {
    width: 32px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.richtext-toolbar button:hover {
    background: #e5e7eb;
}

.richtext-editor {
    min-height: 150px;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 0 0 6px 6px;
    outline: none;
}

.richtext-editor:focus {
    border-color: #3b82f6;
}
</style>
