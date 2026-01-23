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
                    <input v-model="formData.slug" type="text" placeholder="tu-dong-tao-tu-ten" />
                    <p class="hint">Để trống sẽ tự động tạo từ tên</p>
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
                    <textarea v-model="formData.content" rows="6" placeholder="Nội dung chi tiết sản phẩm..." />
                </div>

                <div class="form-actions">
                    <button type="button" @click="$emit('close')" class="btn-secondary">
                        Hủy
                    </button>
                    <button type="submit" :disabled="!isValid" class="btn-primary">
                        {{ isNew ? 'Tạo mới' : 'Cập nhật' }}
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
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'

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

const categories = computed(() => config.value.categories.map(c => c.name))
const tags = computed(() => config.value.tags.map(t => t.name))

onMounted(async () => {
    await loadConfig()
})

watch(() => props.isOpen, async (newVal) => {
    if (newVal) {
        await loadConfig()
    }
})

const isValid = computed(() => {
    return formData.value.name.length > 0
        && formData.value.category !== ''
        && formData.value.images.length > 0
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

watch(() => formData.value.name, (newName) => {
    if (!formData.value.slug || props.isNew) {
        formData.value.slug = newName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
})

const handleSave = () => {
    if (isValid.value) {
        emit('save', { ...formData.value })
    }
}
</script>

<style scoped>
@import "../../../styles/components/collection/product-editor.css";
</style>
