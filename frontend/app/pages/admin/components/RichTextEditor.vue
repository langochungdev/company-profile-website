<!-- Chức năng: Rich Text Editor sử dụng TipTap -->
<template>
    <div class="rich-text-editor">
        <div v-if="editor" class="editor-toolbar">
            <div class="toolbar-group">
                <button type="button" :class="{ active: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()" title="Bold">
                    <Icon name="mdi:format-bold" />
                </button>
                <button type="button" :class="{ active: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()" title="Italic">
                    <Icon name="mdi:format-italic" />
                </button>
                <button type="button" :class="{ active: editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()" title="Underline">
                    <Icon name="mdi:format-underline" />
                </button>
                <button type="button" :class="{ active: editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()" title="Strikethrough">
                    <Icon name="mdi:format-strikethrough" />
                </button>
            </div>

            <div class="toolbar-divider" />

            <div class="toolbar-group">
                <button type="button" :class="{ active: editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" title="Heading 2">
                    <Icon name="mdi:format-header-2" />
                </button>
                <button type="button" :class="{ active: editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" title="Heading 3">
                    <Icon name="mdi:format-header-3" />
                </button>
                <button type="button" :class="{ active: editor.isActive('paragraph') }" @click="editor.chain().focus().setParagraph().run()" title="Paragraph">
                    <Icon name="mdi:format-paragraph" />
                </button>
            </div>

            <div class="toolbar-divider" />

            <div class="toolbar-group">
                <button type="button" :class="{ active: editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()" title="Bullet List">
                    <Icon name="mdi:format-list-bulleted" />
                </button>
                <button type="button" :class="{ active: editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()" title="Numbered List">
                    <Icon name="mdi:format-list-numbered" />
                </button>
                <button type="button" :class="{ active: editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()" title="Quote">
                    <Icon name="mdi:format-quote-close" />
                </button>
            </div>

            <div class="toolbar-divider" />

            <div class="toolbar-group">
                <button type="button" :class="{ active: editor.isActive({ textAlign: 'left' }) }" @click="editor.chain().focus().setTextAlign('left').run()" title="Align Left">
                    <Icon name="mdi:format-align-left" />
                </button>
                <button type="button" :class="{ active: editor.isActive({ textAlign: 'center' }) }" @click="editor.chain().focus().setTextAlign('center').run()" title="Align Center">
                    <Icon name="mdi:format-align-center" />
                </button>
                <button type="button" :class="{ active: editor.isActive({ textAlign: 'right' }) }" @click="editor.chain().focus().setTextAlign('right').run()" title="Align Right">
                    <Icon name="mdi:format-align-right" />
                </button>
            </div>

            <div class="toolbar-divider" />

            <div class="toolbar-group">
                <button type="button" :class="{ active: editor.isActive('link') }" @click="setLink" title="Link">
                    <Icon name="mdi:link" />
                </button>
                <button type="button" @click="addImage" title="Image">
                    <Icon name="mdi:image" />
                </button>
            </div>

            <div class="toolbar-divider" />

            <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" title="Undo">
                    <Icon name="mdi:undo" />
                </button>
                <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" title="Redo">
                    <Icon name="mdi:redo" />
                </button>
            </div>
        </div>

        <EditorContent :editor="editor" class="editor-content" />

        <div v-if="maxLength" class="editor-footer">
            <span :class="{ 'over-limit': characterCount > maxLength }">
                {{ characterCount }} / {{ maxLength }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'

const props = defineProps<{
    modelValue?: string
    placeholder?: string
    maxLength?: number
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const editor = useEditor({
    content: props.modelValue || '',
    extensions: [
        StarterKit.configure({
            heading: { levels: [2, 3, 4] }
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' }
        }),
        Image.configure({ inline: true }),
        Placeholder.configure({ placeholder: props.placeholder || 'Nhập nội dung...' }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Underline
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    }
})

const characterCount = computed(() => editor.value?.storage.characterCount?.characters() || editor.value?.getText().length || 0)

watch(() => props.modelValue, (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
        editor.value.commands.setContent(newValue || '')
    }
})

const setLink = () => {
    if (!editor.value) return

    if (editor.value.isActive('link')) {
        editor.value.chain().focus().unsetLink().run()
        return
    }

    const url = window.prompt('Nhập URL:')
    if (url) {
        editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
}

const addImage = () => {
    if (!editor.value) return

    const url = window.prompt('Nhập URL ảnh:')
    if (url) {
        editor.value.chain().focus().setImage({ src: url }).run()
    }
}

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<style scoped>
@import "../styles/rich-text-editor/desktop.css";
@import "../styles/rich-text-editor/mobile.css";
</style>
