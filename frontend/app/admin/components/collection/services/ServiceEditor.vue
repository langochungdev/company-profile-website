<template>
    <div v-if="isOpen" class="service-editor-modal">
        <div class="modal-overlay" @click="$emit('close')" />

        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ isNew ? 'Thêm dự án mới' : 'Chỉnh sửa dự án' }}</h2>
                <button type="button" class="btn-close" @click="$emit('close')">
                    <Icon name="mdi:close" />
                </button>
            </div>

            <form @submit.prevent="handleSave" class="modal-body">
                <div class="form-grid-2cols">
                    <div class="field-group">
                        <label>
                            Tên dự án <span class="required">*</span>
                        </label>
                        <input v-model="formData.name" type="text" maxlength="200" placeholder="VD: Lắp đặt hệ thống Camera AI cho Văn phòng XYZ" required />
                        <span class="char-count">{{ formData.name.length }}/200</span>
                    </div>

                    <div class="field-group">
                        <label>
                            Danh mục <span class="required">*</span>
                        </label>
                        <TagSelector v-model="formData.categories" :options="categories" />
                        <p class="hint">Có thể chọn nhiều danh mục</p>
                    </div>

                    <div class="field-group">
                        <label>
                            Ngày hoàn thành <span class="required">*</span>
                        </label>
                        <input v-model="formData.completedDate" type="date" required />
                    </div>

                    <div class="field-group">
                        <label>
                            Địa điểm <span class="required">*</span>
                        </label>
                        <input v-model="formData.location" type="text" placeholder="VD: Hà Nội, Việt Nam" required />
                    </div>

                    <div class="field-group">
                        <label>Tags (từ sản phẩm)</label>
                        <TagSelector v-model="formData.tags" :options="tags" />
                        <p class="hint">Gắn tag từ danh sách sản phẩm</p>
                    </div>
                </div>

                <div class="field-group">
                    <label>Mô tả dự án</label>
                    <textarea v-model="formData.description" rows="4" maxlength="500" placeholder="Mô tả chi tiết về dự án..."></textarea>
                    <span class="char-count">{{ formData.description.length }}/500</span>
                </div>

                <div class="field-group">
                    <label>
                        Hình ảnh dự án <span class="required">*</span>
                    </label>
                    <ImageGallery v-model="formData.images" :min="4" :max="20" simple />
                    <p class="hint">Tối thiểu 4 ảnh. Ảnh đầu tiên sẽ làm ảnh đại diện.</p>
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
import ImageGallery from '@/admin/components/shared/ImageGallery.vue'
import TagSelector from '@/admin/components/shared/TagSelector.vue'
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'
import { usePendingUploads } from '@/admin/composables/usePendingUploads'

interface ServiceData {
    id?: string
    name: string
    categories: string[]
    tags: string[]
    description: string
    completedDate: string
    location: string
    images: Array<{ url: string; alt: string }>
}

interface Props {
    isOpen: boolean
    isNew: boolean
    initialData?: Partial<ServiceData>
}

const props = withDefaults(defineProps<Props>(), {
    initialData: () => ({}),
})

const emit = defineEmits<{
    close: []
    save: [data: ServiceData]
}>()

const { config: serviceConfig, loadConfig: loadServiceConfig } = useCollectionConfig('collections/services')
const { config: productConfig, loadConfig: loadProductConfig } = useCollectionConfig('collections/products')
const { hasPending, clearAll, uploadAllPending, pendingUploads } = usePendingUploads()

const formData = ref<ServiceData>({
    name: '',
    categories: [],
    tags: [],
    description: '',
    completedDate: new Date().toISOString().split('T')[0] || '',
    location: '',
    images: [],
})

const isUploading = ref(false)
const uploadProgress = ref({ current: 0, total: 0 })

const categories = computed(() => serviceConfig.value?.categories?.map(c => c.name) || [])
const tags = computed(() => productConfig.value?.tags?.map(t => t.name) || [])

const isValid = computed(() => {
    return (
        formData.value.name.trim() !== '' &&
        formData.value.categories.length > 0 &&
        formData.value.completedDate !== '' &&
        formData.value.location.trim() !== '' &&
        formData.value.images.length >= 4
    )
})

const handleSave = async () => {
    if (!isValid.value || isUploading.value) return

    isUploading.value = true
    const totalUploads = pendingUploads.value.length
    uploadProgress.value = { current: 0, total: totalUploads }

    try {
        let processedImages = formData.value.images

        if (hasPending.value) {
            const results = await uploadAllPending((current: number, total: number) => {
                uploadProgress.value = { current, total }
            })

            processedImages = formData.value.images.map(img => {
                const pendingImg = img as any
                if (pendingImg.pending && pendingImg.fieldPath) {
                    const result = results.get(pendingImg.fieldPath)
                    if (result) {
                        return {
                            url: result.secure_url,
                            alt: img.alt,
                        }
                    }
                }
                return img
            })
        }

        const saveData: ServiceData = {
            ...formData.value,
            images: processedImages,
        }

        if (!props.isNew && props.initialData?.id) {
            saveData.id = props.initialData.id
        }

        emit('save', saveData)
        clearAll()
    } catch (error) {
        console.error('[ServiceEditor] Save error:', error)
        alert('Có lỗi xảy ra khi lưu dự án!')
    } finally {
        isUploading.value = false
        uploadProgress.value = { current: 0, total: 0 }
    }
}

watch(
    () => props.isOpen,
    async (open) => {
        if (open) {
            await Promise.all([loadServiceConfig(), loadProductConfig()])
            formData.value = {
                name: props.initialData?.name || '',
                categories: props.initialData?.categories || [],
                tags: props.initialData?.tags || [],
                description: props.initialData?.description || '',
                completedDate: props.initialData?.completedDate || new Date().toISOString().split('T')[0] || '',
                location: props.initialData?.location || '',
                images: props.initialData?.images || [],
            }
        } else {
            clearAll()
        }
    },
    { immediate: true }
)

onMounted(async () => {
    await Promise.all([loadServiceConfig(), loadProductConfig()])
})
</script>

<style scoped>
.service-editor-modal {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}

.modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
}

.modal-content {
    position: relative;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 32px;
    border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
}

.btn-close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: #f1f5f9;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 20px;
    color: #64748b;
}

.btn-close:hover {
    background: #e2e8f0;
    color: #0f172a;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
}

.form-grid-2cols {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-group label {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
}

.required {
    color: #ef4444;
}

.field-group input,
.field-group select,
.field-group textarea {
    padding: 10px 14px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
}

.field-group input:focus,
.field-group select:focus,
.field-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-group textarea {
    resize: vertical;
    font-family: inherit;
}

.char-count,
.hint {
    font-size: 12px;
    color: #94a3b8;
}

.upload-progress {
    margin-top: 24px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 12px;
}

.progress-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #475569;
}

.upload-icon {
    font-size: 20px;
    color: #3b82f6;
}

.progress-bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    transition: width 0.3s ease;
}

.form-actions {
    display: flex;
    gap: 12px;
    padding: 24px 32px;
    border-top: 1px solid #e2e8f0;
    justify-content: flex-end;
}

.btn-secondary,
.btn-primary {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-secondary {
    background: #f1f5f9;
    color: #475569;
}

.btn-secondary:hover:not(:disabled) {
    background: #e2e8f0;
}

.btn-primary {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-secondary:disabled,
.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .modal-content {
        max-width: 100%;
        max-height: 100vh;
        border-radius: 0;
    }

    .form-grid-2cols {
        grid-template-columns: 1fr;
    }

    .modal-header,
    .modal-body,
    .form-actions {
        padding-left: 20px;
        padding-right: 20px;
    }
}
</style>
