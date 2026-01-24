<template>
    <div v-if="isOpen" class="product-editor-modal">
        <div class="modal-overlay" @click="$emit('close')" />

        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm' }}</h2>
                <button type="button" class="btn-close" @click="$emit('close')">
                    <Icon name="mdi:close" />
                </button>
            </div>

            <form @submit.prevent="handleSave" class="modal-body">
                <div class="field-group">
                    <label>
                        Tên sản phẩm <span class="required">*</span>
                    </label>
                    <input v-model="formData.name" type="text" maxlength="100" placeholder="Nhập tên sản phẩm..." required />
                    <span class="char-count">{{ formData.name.length }}/100</span>
                </div>

                <div class="field-group">
                    <label>Slug URL</label>
                    <div class="slug-input-wrapper">
                        <input v-model="formData.slug" type="text" placeholder="tu-dong-tao-tu-ten" :class="{ 'error': slugError }" @input="onSlugInput" @focus="onSlugFocus" />
                        <span v-if="isCheckingSlug" class="slug-spinner">
                            <Icon name="mdi:loading" class="spin" />
                        </span>
                    </div>
                    <p v-if="slugError" class="error-msg">{{ slugError }}</p>
                    <p v-else class="hint">Để trống sẽ tự động tạo từ tên</p>
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
                    <label>
                        Tags (Nhóm sản phẩm)
                    </label>
                    <TagSelector v-model="formData.tags" :options="tags" />
                </div>

                <div class="field-group">
                    <label>Giá (VNĐ)</label>
                    <input v-model.number="formData.price" type="number" min="0" placeholder="0" />
                    <p class="hint">Để trống nếu liên hệ</p>
                </div>

                <div class="field-group">
                    <label>Tóm tắt</label>
                    <textarea v-model="formData.description" rows="4" maxlength="500" placeholder="Mô tả ngắn gọn về sản phẩm..." />
                    <span class="char-count">{{ formData.description.length }}/500</span>
                </div>

                <div class="field-group">
                    <label>
                        Danh sách ảnh <span class="required">*</span>
                    </label>
                    <ImageGallery v-model="formData.images" :min="1" :max="10" />
                    <p class="hint">Ảnh đầu tiên sẽ làm ảnh chính hiển thị ở danh sách</p>
                </div>

                <div class="field-group">
                    <label>Bài viết chi tiết</label>
                    <RichTextEditor v-model="formData.content" placeholder="Nội dung chi tiết sản phẩm..." />
                </div>

                <div v-if="isUploading" class="upload-progress">
                    <div class="progress-info">
                        <Icon name="mdi:cloud-upload" class="upload-icon" />
                        <span>Đang upload ảnh {{ uploadProgress.current }}/{{ uploadProgress.total }}...</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }"></div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" @click="$emit('close')" class="btn-secondary" :disabled="isUploading">
                        Hủy
                    </button>
                    <button type="submit" :disabled="!isValid || isUploading" class="btn-primary">
                        <Icon v-if="isUploading" name="mdi:loading" class="spin" />
                        <span>{{ isUploading ? 'Đang xử lý...' : (isNew ? 'Tạo mới' : 'Cập nhật') }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import TagSelector from '@/admin/components/shared/TagSelector.vue'
import ImageGallery from '@/admin/components/shared/ImageGallery.vue'
import RichTextEditor from '@/admin/components/shared/RichTextEditor.vue'
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'
import { usePendingUploads } from '@/admin/composables/usePendingUploads'
import { CollectionService } from '@/admin/services/collection.service'
import type { Firestore } from 'firebase/firestore'

interface ProductData {
    id?: string
    name: string
    slug: string
    category: string
    tags: string[]
    price: number
    description: string
    images: { url: string; alt: string; width?: number; height?: number }[]
    content: string
}

const props = defineProps<{
    isOpen: boolean
    isNew: boolean
    initialData?: Partial<ProductData>
}>()

const emit = defineEmits<{
    save: [data: ProductData]
    close: []
}>()

const formData = ref<ProductData>({
    name: '',
    slug: '',
    category: '',
    tags: [],
    price: 0,
    description: '',
    images: [],
    content: '',
})

const { config, loadConfig } = useCollectionConfig('collections/products/items')
const { hasPending, clearAll, uploadAllPending, pendingUploads } = usePendingUploads();
const { $db } = useNuxtApp();

const categories = computed(() => config.value.categories.map(c => c.name))
const tags = computed(() => config.value.tags.map(t => t.name))

const isUploading = ref(false);
const uploadProgress = ref({ current: 0, total: 0 });
const slugError = ref('');
const isCheckingSlug = ref(false);
const manualSlugEdit = ref(false);

onMounted(async () => {
    await loadConfig()
})

watch(() => props.isOpen, async (newVal) => {
    if (newVal) {
        await loadConfig()
        clearAll()
        slugError.value = ''
        manualSlugEdit.value = false
    }
})

const isValid = computed(() => {
    return formData.value.name.length > 0
        && formData.value.category !== ''
        && formData.value.images.length > 0
        && !slugError.value
})

watch(() => props.initialData, (newData) => {
    if (newData) {
        formData.value = {
            name: '',
            slug: '',
            category: '',
            tags: [],
            price: 0,
            description: '',
            images: [],
            content: '',
            ...newData
        }
        manualSlugEdit.value = !!newData.slug;
    } else {
        formData.value = {
            name: '',
            slug: '',
            category: '',
            tags: [],
            price: 0,
            description: '',
            images: [],
            content: '',
        }
    }
}, { immediate: true })

let nameWatchTimeout: any;
watch(() => formData.value.name, (newName) => {
    if (!manualSlugEdit.value && props.isNew) {
        const newSlug = generateSlug(newName);
        if (newSlug !== formData.value.slug) {
            formData.value.slug = newSlug;
            clearTimeout(nameWatchTimeout);
            nameWatchTimeout = setTimeout(() => {
                validateSlug(formData.value.slug);
            }, 500);
        }
    }
})

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
        slugError.value = '';
        return;
    }

    isCheckingSlug.value = true;
    try {
        const isDuplicate = await CollectionService.checkSlug(
            $db as Firestore,
            'collections/products/items',
            slug,
            props.isNew ? undefined : formData.value.id
        );

        if (isDuplicate) {
            slugError.value = 'Slug này đã tồn tại, vui lòng chọn slug khác';
        } else {
            slugError.value = '';
        }
    } catch (e) {
        console.error('Slug check failed', e);
    } finally {
        isCheckingSlug.value = false;
    }
}

// Debounce slug check when user manually types slug
let slugCheckTimeout: any;
const onSlugFocus = () => {
    manualSlugEdit.value = true;
}

const onSlugInput = () => {
    manualSlugEdit.value = true;
    clearTimeout(slugCheckTimeout);
    slugCheckTimeout = setTimeout(() => {
        validateSlug(formData.value.slug);
    }, 500);
}

const handleSave = async () => {
    if (!isValid.value) return;

    // Double check slug before saving
    await validateSlug(formData.value.slug);
    if (slugError.value) return;

    if (!hasPending.value) {
        emit('save', { ...formData.value })
        return;
    }

    isUploading.value = true;
    uploadProgress.value = { current: 0, total: pendingUploads.value.length };

    try {
        const results = await uploadAllPending((current, total) => {
            uploadProgress.value = { current, total };
        });

        // Replace pending images with uploaded URLs
        const processedImages = formData.value.images.map(img => {
            const pendingImg = img as any;
            if (pendingImg.pending && pendingImg.fieldPath) {
                const result = results.get(pendingImg.fieldPath);
                if (result) {
                    return {
                        url: result.secure_url,
                        alt: img.alt,
                        width: result.width,
                        height: result.height
                    };
                }
            }
            return img;
        });

        const finalData = {
            ...formData.value,
            images: processedImages
        };

        // Clean up old images if needed (optional implementation: check deleted images)
        // For now we assume ImageGallery handles removal interactions by just removing from array

        emit('save', finalData);
        clearAll();
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Không thể upload ảnh. Vui lòng thử lại.");
    } finally {
        isUploading.value = false;
        uploadProgress.value = { current: 0, total: 0 };
    }
}
</script>

<style scoped>
@import "../../../styles/components/collection/product-editor.css";
</style>
