<template>
    <div class="tag-selector-wrapper">
        <div class="tag-input">
            <select v-model="selectedOption" @change="addTag">
                <option value="">-- Chọn tag --</option>
                <option v-for="opt in availableOptions" :key="opt" :value="opt">
                    {{ opt }}
                </option>
            </select>
        </div>
        <div class="selected-tags">
            <span v-for="(tag, index) in normalizedTags" :key="index" class="tag-badge">
                {{ tag }}
                <button type="button" @click="removeTag(index)">
                    <Icon name="mdi:close" />
                </button>
            </span>
        </div>


    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
    modelValue: string[] | any[]
    options: string[]
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string[]]
}>()

const selectedOption = ref('')

const normalizedTags = computed(() => {
    if (!props.modelValue) return []
    return props.modelValue.map(tag => {
        if (typeof tag === 'string') return tag
        if (typeof tag === 'object' && tag !== null && 'value' in tag) return tag.value
        if (typeof tag === 'object' && tag !== null && 'name' in tag) return tag.name
        return String(tag)
    })
})

const availableOptions = computed(() => {
    return props.options.filter(opt => !normalizedTags.value.includes(opt))
})

const addTag = () => {
    if (selectedOption.value && !normalizedTags.value.includes(selectedOption.value)) {
        emit('update:modelValue', [...normalizedTags.value, selectedOption.value])
        selectedOption.value = ''
    }
}

const removeTag = (index: number) => {
    const newValue = [...normalizedTags.value]
    newValue.splice(index, 1)
    emit('update:modelValue', newValue)
}
</script>

<style scoped>
.tag-selector-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 36px;
}

.tag-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #e0e7ff;
    border-radius: 16px;
    font-size: 14px;
    color: #4338ca;
}

.tag-badge button {
    display: inline-flex;
    align-items: center;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #6366f1;
    transition: color 0.2s;
}

.tag-badge button:hover {
    color: #dc2626;
}

.tag-input select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
}
</style>
