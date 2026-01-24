<template>
    <div class="rich-text-editor">
        <div v-if="editor" class="toolbar">
            <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" title="Bold">
                <Icon name="mdi:format-bold" />
            </button>
            <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" title="Italic">
                <Icon name="mdi:format-italic" />
            </button>
            <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" title="Underline">
                <Icon name="mdi:format-underline" />
            </button>
            <button type="button" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" title="Strikethrough">
                <Icon name="mdi:format-strikethrough" />
            </button>

            <div class="divider" />

            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" title="Heading 2">
                <Icon name="mdi:format-header-2" />
            </button>
            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" title="Heading 3">
                <Icon name="mdi:format-header-3" />
            </button>
            <button type="button" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }" title="Paragraph">
                <Icon name="mdi:format-paragraph" />
            </button>

            <div class="divider" />

            <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" title="Bullet List">
                <Icon name="mdi:format-list-bulleted" />
            </button>
            <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" title="Ordered List">
                <Icon name="mdi:format-list-numbered" />
            </button>
            <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" title="Blockquote">
                <Icon name="mdi:format-quote-close" />
            </button>

            <div class="divider" />

            <button type="button" @click="setLink" :class="{ 'is-active': editor.isActive('link') }" title="Link">
                <Icon name="mdi:link-variant" />
            </button>
            <button type="button" @click="addImage" title="Image">
                <Icon name="mdi:image" />
            </button>
            <button type="button" @click="addYouTube" title="YouTube">
                <Icon name="mdi:youtube" />
            </button>

            <div class="divider" />

            <button type="button" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" title="Align Left">
                <Icon name="mdi:format-align-left" />
            </button>
            <button type="button" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" title="Align Center">
                <Icon name="mdi:format-align-center" />
            </button>
            <button type="button" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" title="Align Right">
                <Icon name="mdi:format-align-right" />
            </button>

            <div class="divider" />

            <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" title="Undo">
                <Icon name="mdi:undo" />
            </button>
            <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" title="Redo">
                <Icon name="mdi:redo" />
            </button>
        </div>

        <EditorContent :editor="editor" class="editor-content" />

        <input ref="imageInput" type="file" accept="image/*" style="display: none" @change="onImageSelected" />
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import { watch, ref } from 'vue'
import { useRichTextImages } from '@/admin/composables/useRichTextImages'
import ResizableImage from './ResizableImage.vue'

const props = defineProps<{
    modelValue: string
    placeholder?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                target: '_blank',
                rel: 'noopener noreferrer',
            },
        }),
        Image.configure({
            inline: true,
            allowBase64: true,
            HTMLAttributes: {
                class: 'editor-image',
            },
        }).extend({
            addAttributes() {
                return {
                    ...this.parent?.(),
                    width: {
                        default: null,
                        renderHTML: (attributes) => {
                            if (!attributes.width) return {}
                            return { width: attributes.width }
                        },
                    },
                    height: {
                        default: null,
                        renderHTML: (attributes) => {
                            if (!attributes.height) return {}
                            return { height: attributes.height }
                        },
                    },
                }
            },
            addNodeView() {
                return VueNodeViewRenderer(ResizableImage as any)
            },
        }),
        Youtube.configure({
            width: 640,
            height: 360,
            HTMLAttributes: {
                class: 'editor-youtube',
            },
        }),
        Placeholder.configure({
            placeholder: props.placeholder || 'Nhập nội dung...',
        }),
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    },
})

watch(() => props.modelValue, (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
        editor.value.commands.setContent(newValue)
    }
})

const imageInput = ref<HTMLInputElement>()
const { addPendingImage } = useRichTextImages()

const setLink = () => {
    const url = window.prompt('Nhập URL:')
    if (url) {
        editor.value?.chain().focus().setLink({ href: url }).run()
    }
}

const addImage = () => {
    imageInput.value?.click()
}

const onImageSelected = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file && file.type.startsWith('image/')) {
        const previewUrl = addPendingImage(file)
        editor.value?.chain().focus().setImage({ src: previewUrl }).run()
    }

    target.value = ''
}

const addYouTube = () => {
    const url = window.prompt('Nhập YouTube URL:')
    if (url) {
        editor.value?.chain().focus().setYoutubeVideo({ src: url }).run()
    }
}

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<style scoped>
.rich-text-editor {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

.toolbar {
    display: flex;
    gap: 4px;
    padding: 8px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
}

.toolbar button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
}

.toolbar button:hover:not(:disabled) {
    background: #e5e7eb;
    color: #111827;
}

.toolbar button.is-active {
    background: #3b82f6;
    color: white;
}

.toolbar button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.divider {
    width: 1px;
    background: #e5e7eb;
    margin: 0 4px;
}

.editor-content {
    min-height: 200px;
    max-height: 500px;
    overflow-y: auto;
}

.editor-content :deep(.ProseMirror) {
    padding: 16px;
    outline: none;
    min-height: 200px;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: #9ca3af;
    float: left;
    height: 0;
    pointer-events: none;
}

.editor-content :deep(.ProseMirror h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin: 1em 0 0.5em;
}

.editor-content :deep(.ProseMirror h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin: 1em 0 0.5em;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
}

.editor-content :deep(.ProseMirror ul) {
    list-style-type: disc;
}

.editor-content :deep(.ProseMirror ol) {
    list-style-type: decimal;
}

.editor-content :deep(.ProseMirror li) {
    display: list-item;
    margin: 0.25em 0;
}

.editor-content :deep(.ProseMirror blockquote) {
    border-left: 3px solid #e5e7eb;
    padding-left: 1em;
    color: #6b7280;
    margin: 1em 0;
}

.editor-content :deep(.ProseMirror a) {
    color: #3b82f6;
    text-decoration: underline;
}

.editor-content :deep(.ProseMirror .editor-youtube) {
    max-width: 100%;
    margin: 1em 0;
    border-radius: 8px;
    overflow: hidden;
}

.editor-content :deep(.ProseMirror code) {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
}

.editor-content :deep(.ProseMirror pre) {
    background: #1f2937;
    color: #f9fafb;
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1em 0;
}

.editor-content :deep(.ProseMirror pre code) {
    background: none;
    padding: 0;
    color: inherit;
}
</style>
