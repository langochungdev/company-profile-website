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
@import "../../styles/components/views/editable-section.css";
</style>
