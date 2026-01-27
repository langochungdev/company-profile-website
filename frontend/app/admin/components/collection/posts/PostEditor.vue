<template>
    <div v-if="isOpen" class="post-editor-modal">
        <div class="modal-overlay" @click="$emit('close')" />

        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ isNew ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết' }}</h2>
                <button type="button" class="btn-close" @click="$emit('close')">
                    <Icon name="mdi:close" />
                </button>
            </div>

            <form @submit.prevent="handleSave" class="modal-body">
                <div class="form-grid-2cols">
                    <div class="field-group">
                        <label>
                            Tiêu đề <span class="required">*</span>
                        </label>
                        <input v-model="formData.title" type="text" maxlength="150" placeholder="Nhập tiêu đề bài viết..." required />
                        <span class="char-count">{{ formData.title.length }}/150</span>
                    </div>

                    <div class="field-group">
                        <label>
                            Danh mục <span class="required">*</span>
                        </label>
                        <select v-model="formData.category" required>
                            <option value="">-- Chọn danh mục --</option>
                            <option v-for="cat in categories" :key="cat" :value="cat">
                                {{ cat }}
                            </option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label>Slug URL</label>
                        <div class="slug-input-wrapper">
                            <input v-model="formData.slug" type="text" placeholder="tu-dong-tao-tu-tieu-de" :class="{ 'error': slugError }" @input="onSlugInput" @focus="onSlugFocus" />
                            <span v-if="isCheckingSlug" class="slug-spinner">
                                <Icon name="mdi:loading" class="spin" />
                            </span>
                        </div>
                        <p v-if="slugError" class="error-msg">{{ slugError }}</p>
                        <p v-else class="hint">Để trống sẽ tự động tạo từ tiêu đề</p>
                    </div>

                    <div class="field-group">
                        <label>Tags</label>
                        <TagSelector v-model="formData.tags" :options="tags" />
                    </div>
                </div>

                <div class="form-grid-author-date">
                    <div class="field-group">
                        <label>Tác giả</label>
                        <input v-model="formData.author" type="text" placeholder="shtcam.vn" />
                        <p class="hint">Mặc định: shtcam.vn</p>
                    </div>

                    <div class="field-group">
                        <label>Ngày xuất bản</label>
                        <input v-model="formData.publishedAt" type="date" required />
                    </div>

                    <div class="field-group">
                        <label>Trạng thái</label>
                        <select v-model="formData.status" required>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    <div class="field-group field-checkbox">
                        <label class="checkbox-label">
                            <input v-model="formData.featured" type="checkbox" />
                            <span>Bài viết nổi bật</span>
                        </label>
                    </div>
                </div>

                <div class="field-group">
                    <label>Tóm tắt <span class="required">*</span></label>
                    <textarea v-model="formData.excerpt" maxlength="300" rows="3" placeholder="Tóm tắt ngắn gọn về bài viết (150-200 ký tự)..." required />
                    <span class="char-count">{{ formData.excerpt.length }}/300</span>
                </div>

                <div class="field-group">
                    <label>Ảnh đại diện <span class="required">*</span></label>
                    <ImageGallery v-model="formData.thumbnails" :min="1" :max="1" folder="posts/thumbnails" />
                    <p class="hint">Ảnh thumbnail hiển thị trong danh sách bài viết</p>
                </div>

                <div class="field-group">
                    <label>Nội dung bài viết</label>
                    <RichTextEditor v-model="formData.content" placeholder="Nội dung chi tiết bài viết..." />
                </div>

                <div v-if="isUploading" class="upload-progress">
                    <div class="progress-info">
                        <Icon name="mdi:cloud-upload" class="upload-icon" />
                        <span>Đang upload ảnh {{ uploadProgress.current }}/{{ uploadProgress.total }}...</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }" />
                    </div>
                </div>
            </form>

            <div class="form-actions">
                <button type="button" @click="$emit('close')" class="btn-secondary" :disabled="isUploading">
                    Hủy
                </button>
                <button type="submit" :disabled="!isValid || isUploading" class="btn-primary" @click="handleSave">
                    <Icon v-if="isUploading" name="mdi:loading" class="spin" />
                    <span>{{ isUploading ? 'Đang xử lý...' : (isNew ? 'Tạo mới' : 'Cập nhật') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TagSelector from '@/admin/components/shared/TagSelector.vue'
import ImageGallery from '@/admin/components/shared/ImageGallery.vue'
import RichTextEditor from '@/admin/components/shared/RichTextEditor.vue'
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'
import { usePendingUploads } from '@/admin/composables/usePendingUploads'
import { useRichTextImages } from '@/admin/composables/useRichTextImages'
import { useDeleteQueue } from '@/admin/composables/useDeleteQueue'
import { CollectionService } from '@/admin/services/collection.service'
import type { Firestore } from 'firebase/firestore'

interface PostData {
    id?: string
    title: string
    slug: string
    category: string
    tags: string[]
    excerpt: string
    thumbnails: { url: string; alt: string; title?: string; width?: number; height?: number }[]
    thumbnail?: { url: string; alt: string; title?: string; width?: number; height?: number }
    content: string
    author: string
    publishedAt: string
    featured: boolean
    status: string
}

const props = defineProps<{
    isOpen: boolean
    isNew: boolean
    initialData?: Partial<PostData>
}>()

const emit = defineEmits<{
    save: [data: PostData]
    close: []
}>()

const formData = ref<PostData>({
    title: '',
    slug: '',
    category: '',
    tags: [],
    excerpt: '',
    thumbnails: [],
    content: '',
    author: 'shtcam.vn',
    publishedAt: new Date().toISOString().split('T')[0] || '',
    featured: false,
    status: 'draft',
})

const { config, loadConfig } = useCollectionConfig('collections/posts')
const { hasPending, clearAll, uploadAllPending } = usePendingUploads()
const { uploadPendingImages, clearPendingImages } = useRichTextImages()
const { addToDeleteQueue, processDeleteQueue, clearQueue } = useDeleteQueue()
const { $db } = useNuxtApp()

const categories = computed(() => config.value.categories.map(c => c.name))
const tags = computed(() => {
    const productConfig = useCollectionConfig('collections/products')
    return productConfig.config.value.tags.map(t => t.name)
})

const isUploading = ref(false)
const uploadProgress = ref({ current: 0, total: 0 })
const slugError = ref('')
const isCheckingSlug = ref(false)
const manualSlugEdit = ref(false)

onMounted(async () => {
    await loadConfig()
})

watch(
    () => props.isOpen,
    async newVal => {
        if (newVal) {
            await loadConfig()
            clearAll()
            clearPendingImages()
            clearQueue()
            slugError.value = ''
            manualSlugEdit.value = false
        }
    },
)

const isValid = computed(() => {
    return (
        formData.value.title.length > 0 &&
        formData.value.category !== '' &&
        formData.value.excerpt.length > 0 &&
        !slugError.value
    )
})

watch(
    () => props.initialData,
    newData => {
        if (newData) {
            const thumbnailsData = newData.thumbnail ? [newData.thumbnail] : (newData.thumbnails || [])
            formData.value = {
                id: newData.id,
                title: newData.title || '',
                slug: newData.slug || '',
                category: newData.category || '',
                tags: newData.tags || [],
                excerpt: newData.excerpt || '',
                thumbnails: thumbnailsData,
                content: newData.content || '',
                author: newData.author || 'shtcam.vn',
                publishedAt: newData.publishedAt || new Date().toISOString().split('T')[0] || '',
                featured: newData.featured || false,
                status: newData.status || 'draft',
            }
            manualSlugEdit.value = !!newData.slug
        } else {
            formData.value = {
                title: '',
                slug: '',
                category: categories.value[0] || '',
                tags: [],
                excerpt: '',
                thumbnails: [],
                content: '',
                author: 'shtcam.vn',
                publishedAt: new Date().toISOString().split('T')[0] || '',
                featured: false,
                status: 'draft',
            }
        }
    },
    { immediate: true },
)

let nameWatchTimeout: any
watch(
    () => formData.value.title,
    newTitle => {
        if (!manualSlugEdit.value && props.isNew) {
            const newSlug = generateSlug(newTitle)
            if (newSlug !== formData.value.slug) {
                formData.value.slug = newSlug
                clearTimeout(nameWatchTimeout)
                nameWatchTimeout = setTimeout(() => {
                    validateSlug(formData.value.slug)
                }, 500)
            }
        }
    },
)

const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

const validateSlug = async (slug: string) => {
    if (!slug) {
        slugError.value = ''
        return
    }

    isCheckingSlug.value = true
    try {
        const isDuplicate = await CollectionService.checkSlug($db as Firestore, 'collections/posts/items', slug, props.isNew ? undefined : formData.value.id)

        if (isDuplicate) {
            slugError.value = 'Slug này đã tồn tại, vui lòng chọn slug khác'
        } else {
            slugError.value = ''
        }
    } catch (e) {
        console.error('[PostEditor] Slug check failed', e)
    } finally {
        isCheckingSlug.value = false
    }
}

let slugCheckTimeout: any
const onSlugFocus = () => {
    manualSlugEdit.value = true
}

const onSlugInput = () => {
    manualSlugEdit.value = true
    clearTimeout(slugCheckTimeout)
    slugCheckTimeout = setTimeout(() => {
        validateSlug(formData.value.slug)
    }, 500)
}

const handleSave = async () => {
    if (!isValid.value) return

    await validateSlug(formData.value.slug)
    if (slugError.value) return

    isUploading.value = true
    uploadProgress.value = { current: 0, total: 1 }

    try {
        let processedContent = formData.value.content

        if (!props.isNew && props.initialData?.content) {
            const oldContentUrls = extractCloudinaryUrls(props.initialData.content)
            const newContentUrls = extractCloudinaryUrls(formData.value.content)
            oldContentUrls.forEach(url => {
                if (!newContentUrls.includes(url)) {
                    addToDeleteQueue(url)
                }
            })
        }

        processedContent = await uploadPendingImages(formData.value.content, 'posts/content')

        const finalData = {
            ...formData.value,
            content: processedContent,
            author: formData.value.author || 'shtcam.vn',
            thumbnail: formData.value.thumbnails[0] || undefined,
        }

        emit('save', finalData)

        await processDeleteQueue()

        clearAll()
    } catch (error) {
        console.error('[PostEditor] Upload failed:', error)
        alert('Không thể upload ảnh. Vui lòng thử lại.')
    } finally {
        isUploading.value = false
        uploadProgress.value = { current: 0, total: 0 }
    }
}

function extractCloudinaryUrls(html: string): string[] {
    const urls: string[] = []
    const regex = /https:\/\/res\.cloudinary\.com\/[^"\s]+/g
    const matches = html.match(regex)
    if (matches) {
        urls.push(...matches)
    }
    return urls
}
</script>

<style scoped>
@import '../../../styles/components/collection/product-editor.css';

.form-grid-author-date {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
}

.field-checkbox {
    display: flex;
    align-items: center;
    padding-top: 20px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 500;
}

.checkbox-label input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.char-count {
    display: block;
    text-align: right;
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
}
</style>
