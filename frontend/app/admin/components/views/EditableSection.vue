<!-- Chức năng: Wrapper component tự động scan và setup editable fields -->
<template>
    <div ref="containerRef" class="editable-section-wrapper">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useFieldScanner } from '../../composables/useFieldScanner'

const props = defineProps<{
    sectionId: string
    enabled?: boolean
}>()

const emit = defineEmits<{
    edit: [sectionId: string, fieldPath: string]
}>()

const containerRef = ref<HTMLElement | null>(null)
const enabledRef = toRef(props, 'enabled')

const handleFieldClick = (sectionId: string, fieldPath: string) => {
    emit('edit', sectionId, fieldPath)
}

const { scannedFields, rescan } = useFieldScanner({
    containerRef,
    sectionId: props.sectionId,
    onFieldClick: handleFieldClick,
    enabled: enabledRef
})

defineExpose({ rescan, scannedFields })
</script>

<style scoped>
.editable-section-wrapper {
    width: 100%;
    max-width: 100%;
}
</style>

<style>
@import "../../styles/components/scannable-field/desktop.css";
@import "../../styles/components/scannable-field/mobile.css";
</style>
