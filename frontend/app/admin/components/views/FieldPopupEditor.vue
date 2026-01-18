<!-- Chức năng: Popup editor cho Live Edit mode -->
<template>
    <Teleport to="body">
        <Transition name="popup">
            <div v-if="isOpen" class="popup-overlay" @click.self="$emit('close')">
                <div class="popup-editor">
                    <header class="popup-header">
                        <div class="header-info">
                            <Icon name="mdi:pencil" class="header-icon" />
                            <h3>{{ fieldConfig?.label || 'Chỉnh sửa' }}</h3>
                        </div>
                        <button class="btn-close" @click="$emit('close')">
                            <Icon name="mdi:close" />
                        </button>
                    </header>

                    <div class="popup-content">
                        <Field v-if="fieldConfig" :field="(fieldConfig as any)" :model-value="localValue" @update:model-value="localValue = $event" />
                        <p v-if="fieldConfig?.note" class="field-note">
                            <Icon name="mdi:information-outline" />
                            {{ fieldConfig.note }}
                        </p>
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
import { ref, watch } from 'vue'
import Field from '../fields/Field.vue'
import type { FieldConfig } from '../../config/page.config'

const props = defineProps<{
    isOpen: boolean
    fieldConfig: FieldConfig | null
    initialValue: unknown
}>()

const emit = defineEmits<{
    close: []
    apply: [value: unknown]
}>()

const localValue = ref<unknown>(props.initialValue)

watch(() => props.initialValue, (newVal) => {
    localValue.value = newVal
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        localValue.value = props.initialValue
    }
})

const handleApply = () => {
    emit('apply', localValue.value)
}
</script>

<style scoped>
@import "../../styles/components/views/field-popup-editor/desktop.css";
</style>
