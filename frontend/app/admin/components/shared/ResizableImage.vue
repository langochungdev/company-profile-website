<template>
    <node-view-wrapper class="resizable-image-wrapper">
        <div :class="['image-container', { 'selected': selected }]" :style="{ width: currentWidth }">
            <img :src="node.attrs.src" :alt="node.attrs.alt" :style="imageStyle" @click="selectImage" />
            <div v-if="selected" class="resize-handle resize-handle-se" @mousedown="startResize" />
        </div>
    </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
import { ref, computed } from 'vue'

const props = defineProps<{
    node: any
    updateAttributes: (attrs: Record<string, any>) => void
    selected: boolean
}>()

const isResizing = ref(false)
const currentWidth = ref(props.node.attrs.width || 'auto')

const imageStyle = computed(() => {
    const style: Record<string, string> = {
        display: 'block',
        maxWidth: '100%',
        height: 'auto'
    }

    if (currentWidth.value && currentWidth.value !== 'auto') {
        style.width = '100%'
    }

    return style
})

const selectImage = () => {
    // TipTap will handle selection
}

const startResize = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startWidth = (e.target as HTMLElement).parentElement?.offsetWidth || 0

    const onMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX
        const newWidth = Math.max(50, startWidth + diff)
        currentWidth.value = `${newWidth}px`
    }

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        props.updateAttributes({
            width: currentWidth.value
        })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}
</script>

<style scoped>
.resizable-image-wrapper {
    display: inline-block;
    line-height: 0;
}

.image-container {
    position: relative;
    display: inline-block;
    max-width: 100%;
    margin: 1em 0;
}

.image-container img {
    border-radius: 8px;
    transition: box-shadow 0.2s;
    cursor: pointer;
}

.image-container:hover img {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-container.selected img {
    outline: 2px solid #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.resize-handle {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #3b82f6;
    border: 2px solid white;
    border-radius: 50%;
    cursor: nwse-resize;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.resize-handle-se {
    bottom: -6px;
    right: -6px;
}

.resize-handle:hover {
    background: #2563eb;
    transform: scale(1.2);
}
</style>
