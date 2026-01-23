<!-- Chức năng: Popup quản lý Categories và Tags cho collection -->
<template>
    <Teleport to="body">
        <div v-if="isOpen" class="config-manager-overlay" @mousedown.self="$emit('close')">
            <div class="config-manager-container">
                <div class="config-manager-header">
                    <h2 class="config-title">
                        <Icon :name="activeTab === 'categories' ? 'mdi:folder-multiple' : 'mdi:tag-multiple'" />
                        <span>{{ activeTab === 'categories' ? 'Quản lý danh mục' : 'Quản lý tags' }}</span>
                    </h2>
                    <button class="close-btn" @click="$emit('close')">
                        <Icon name="mdi:close" />
                    </button>
                </div>

                <div class="config-manager-tabs">
                    <button class="tab-btn" :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">
                        <Icon name="mdi:folder" />
                        <span>Danh mục</span>
                        <span class="tab-count">{{ config.categories.length }}</span>
                    </button>
                    <button class="tab-btn" :class="{ active: activeTab === 'tags' }" @click="activeTab = 'tags'">
                        <Icon name="mdi:tag" />
                        <span>Tags</span>
                        <span class="tab-count">{{ config.tags.length }}</span>
                    </button>
                </div>

                <div class="config-manager-body">
                    <div v-if="loading" class="loading-state">
                        <Icon name="mdi:loading" class="spin" />
                        <span>Đang tải...</span>
                    </div>

                    <template v-else>
                        <div class="items-list">
                            <div v-if="currentItems.length === 0" class="empty-state">
                                <Icon :name="activeTab === 'categories' ? 'mdi:folder-plus' : 'mdi:tag-plus'" class="empty-icon" />
                                <p>Chưa có {{ activeTab === 'categories' ? 'danh mục' : 'tag' }} nào</p>
                            </div>

                            <div v-for="item in currentItems" :key="item.id" class="config-item">
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
                            <input v-model="newItemName" type="text" class="add-input" :placeholder="activeTab === 'categories' ? 'Tên danh mục mới...' : 'Tên tag mới...'" @keyup.enter="handleAdd" />
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
import type { ConfigItem } from "@/admin/services/config.service";

const props = defineProps<{
    isOpen: boolean;
    collectionPath: string;
    initialTab?: "categories" | "tags";
}>();

defineEmits<{
    close: [];
}>();

const activeTab = ref<"categories" | "tags">(props.initialTab || "categories");
const newItemName = ref("");
const editingId = ref<string | null>(null);
const editingName = ref("");

const { config, loading, loadConfig, addCategory, updateCategory, deleteCategory, addTag, updateTag, deleteTag } = useCollectionConfig(props.collectionPath);

const currentItems = computed(() => {
    return activeTab.value === "categories" ? config.value.categories : config.value.tags;
});

watch(
    () => props.isOpen,
    async (isOpen) => {
        if (isOpen) {
            await loadConfig();
            if (props.initialTab) {
                activeTab.value = props.initialTab;
            }
        }
    },
    { immediate: true }
);

const handleAdd = async () => {
    const name = newItemName.value.trim();
    if (!name) return;

    try {
        if (activeTab.value === "categories") {
            await addCategory(name);
        } else {
            await addTag(name);
        }
        newItemName.value = "";
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

    try {
        if (activeTab.value === "categories") {
            await updateCategory(editingId.value, editingName.value.trim());
        } else {
            await updateTag(editingId.value, editingName.value.trim());
        }
        cancelEdit();
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
        if (activeTab.value === "categories") {
            await deleteCategory(item.id);
        } else {
            await deleteTag(item.id);
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Có lỗi xảy ra khi xóa!");
    }
};
</script>

<style scoped>
@import "../../styles/components/collection/config-manager.css";
</style>
