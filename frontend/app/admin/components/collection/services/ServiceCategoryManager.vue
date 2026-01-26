<!-- Chức năng: Popup quản lý Danh mục cho Dự án (Services) -->
<template>
    <Teleport to="body">
        <div v-if="isOpen" class="config-manager-overlay" @mousedown.self="$emit('close')">
            <div class="config-manager-container">
                <div class="config-manager-header">
                    <h2 class="config-title">
                        <Icon name="mdi:folder-multiple" />
                        <span>Quản lý danh mục dự án</span>
                    </h2>
                    <button class="close-btn" @click="$emit('close')">
                        <Icon name="mdi:close" />
                    </button>
                </div>

                <div class="config-manager-body">
                    <div v-if="loading" class="loading-state">
                        <Icon name="mdi:loading" class="spin" />
                        <span>Đang tải...</span>
                    </div>

                    <template v-else>
                        <div class="items-list">
                            <div v-if="categories.length === 0" class="empty-state">
                                <Icon name="mdi:folder-plus" class="empty-icon" />
                                <p>Chưa có danh mục nào</p>
                            </div>

                            <div v-for="item in categories" :key="item.id" class="config-item">
                                <div v-if="editingId === item.id" class="item-edit-form">
                                    <input v-model="editingName" type="text" class="edit-input" @keyup.enter="saveEdit" @keyup.escape="cancelEdit" />
                                    <button class="btn-save" @click="saveEdit">
                                        <Icon name="mdi:check" />
                                    </button>
                                    <button class="btn-cancel" @click="cancelEdit">
                                        <Icon name="mdi:close" />
                                    </button>
                                </div>

                                <template v-else>
                                    <span class="item-name">{{ item.name }}</span>
                                    <div class="item-actions">
                                        <button class="btn-edit" @click="startEdit(item)">
                                            <Icon name="mdi:pencil" />
                                        </button>
                                        <button class="btn-delete" @click="handleDelete(item)">
                                            <Icon name="mdi:delete" />
                                        </button>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div class="add-form">
                            <input v-model="newItemName" type="text" class="add-input" placeholder="Tên danh mục mới..." @keyup.enter="handleAdd" />
                            <button class="btn-add" :disabled="!newItemName.trim()" @click="handleAdd">
                                <Icon name="mdi:plus" />
                                <span>Thêm</span>
                            </button>
                        </div>
                    </template>
                </div>

                <div class="config-manager-footer">
                    <button class="btn-close" @click="$emit('close')">Đóng</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useCollectionConfig } from "@/admin/composables/useCollectionConfig";

interface ConfigItem {
    id: string;
    name: string;
}

const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    close: [];
    updated: [];
}>();

const newItemName = ref("");
const editingId = ref<string | null>(null);
const editingName = ref("");

const { config, loading, loadConfig, addCategory, updateCategory, deleteCategory } = useCollectionConfig("collections/services");

const categories = computed(() => config.value.categories);

watch(
    () => props.isOpen,
    async (isOpen) => {
        if (isOpen) {
            await loadConfig();
        }
    },
    { immediate: true }
);

const handleAdd = async () => {
    const name = newItemName.value.trim();
    if (!name) return;

    const isDuplicate = categories.value.some((item) => item.name.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
        alert(`"${name}" đã tồn tại!`);
        return;
    }

    try {
        await addCategory(name);
        newItemName.value = "";
        emit("updated");
    } catch (error) {
        console.error("Add error:", error);
        alert("Có lỗi xảy ra khi thêm!");
    }
};

const startEdit = (item: ConfigItem) => {
    editingId.value = item.id;
    editingName.value = item.name;
};

const saveEdit = async () => {
    if (!editingId.value || !editingName.value.trim()) return;

    const name = editingName.value.trim();
    const isDuplicate = categories.value.some((item) => item.id !== editingId.value && item.name.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
        alert(`"${name}" đã tồn tại!`);
        return;
    }

    try {
        await updateCategory(editingId.value, name);
        cancelEdit();
        emit("updated");
    } catch (error) {
        console.error("Update error:", error);
        alert("Có lỗi xảy ra khi cập nhật!");
    }
};

const cancelEdit = () => {
    editingId.value = null;
    editingName.value = "";
};

const handleDelete = async (item: ConfigItem) => {
    if (!confirm(`Xóa "${item.name}"?`)) return;

    try {
        await deleteCategory(item.id);
        emit("updated");
    } catch (error) {
        console.error("Delete error:", error);
        alert("Có lỗi xảy ra khi xóa!");
    }
};
</script>

<style scoped>
@import "../../../styles/components/collection/config-manager.css";
</style>
