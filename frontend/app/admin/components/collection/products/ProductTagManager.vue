<!-- Chức năng: Popup quản lý Tags cho Products (dùng chung cho Services) -->
<template>
    <Teleport to="body">
        <div v-if="isOpen" class="config-manager-overlay" @mousedown.self="$emit('close')">
            <div class="config-manager-container">
                <div class="config-manager-header">
                    <h2 class="config-title">
                        <Icon name="mdi:tag-multiple" />
                        <span>Quản lý Tags</span>
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
                            <div v-if="tags.length === 0" class="empty-state">
                                <Icon name="mdi:tag-plus" class="empty-icon" />
                                <p>Chưa có tag nào</p>
                            </div>

                            <div v-for="item in tags" :key="item.id" class="config-item">
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
                            <input v-model="newItemName" type="text" class="add-input" placeholder="Tên tag mới..." @keyup.enter="handleAdd" />
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

const { config, loading, loadConfig, addTag, updateTag, deleteTag } = useCollectionConfig("collections/products");

const tags = computed(() => config.value.tags || []);

const editingId = ref<string | null>(null);
const editingName = ref("");
const newItemName = ref("");

const startEdit = (item: ConfigItem) => {
    editingId.value = item.id;
    editingName.value = item.name;
};

const cancelEdit = () => {
    editingId.value = null;
    editingName.value = "";
};

const saveEdit = async () => {
    if (!editingId.value || !editingName.value.trim()) return;
    await updateTag(editingId.value, editingName.value.trim());
    cancelEdit();
    emit("updated");
};

const handleAdd = async () => {
    if (!newItemName.value.trim()) return;
    await addTag(newItemName.value.trim());
    newItemName.value = "";
    emit("updated");
};

const handleDelete = async (item: ConfigItem) => {
    if (!confirm(`Xóa tag "${item.name}"?`)) return;
    await deleteTag(item.id);
    emit("updated");
};

watch(
    () => props.isOpen,
    (open) => {
        if (open) {
            loadConfig();
        }
    },
    { immediate: true }
);
</script>

<style scoped>
.config-manager-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 24px;
}

.config-manager-container {
    background: var(--admin-card-bg, #1e293b);
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--admin-border, #334155);
}

.config-manager-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--admin-border, #334155);
}

.config-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
    color: var(--admin-text, #f1f5f9);
    margin: 0;
}

.close-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--admin-text-muted, #94a3b8);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.close-btn:hover {
    background: var(--admin-hover, #334155);
    color: var(--admin-text, #f1f5f9);
}

.config-manager-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px;
    color: var(--admin-text-muted, #94a3b8);
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px;
    color: var(--admin-text-muted, #94a3b8);
}

.empty-icon {
    font-size: 48px;
    opacity: 0.5;
}

.config-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--admin-bg, #0f172a);
    border-radius: 8px;
    border: 1px solid var(--admin-border, #334155);
}

.item-name {
    color: var(--admin-text, #f1f5f9);
    font-size: 14px;
}

.item-actions {
    display: flex;
    gap: 4px;
}

.btn-edit,
.btn-delete {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--admin-text-muted, #94a3b8);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-edit:hover {
    background: var(--admin-primary, #3b82f6);
    color: white;
}

.btn-delete:hover {
    background: var(--admin-danger, #ef4444);
    color: white;
}

.item-edit-form {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.edit-input {
    flex: 1;
    padding: 8px 12px;
    background: var(--admin-bg, #0f172a);
    border: 1px solid var(--admin-primary, #3b82f6);
    border-radius: 6px;
    color: var(--admin-text, #f1f5f9);
    font-size: 14px;
    outline: none;
}

.btn-save,
.btn-cancel {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-save {
    background: var(--admin-success, #22c55e);
    color: white;
}

.btn-cancel {
    background: var(--admin-text-muted, #94a3b8);
    color: white;
}

.add-form {
    display: flex;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid var(--admin-border, #334155);
}

.add-input {
    flex: 1;
    padding: 10px 14px;
    background: var(--admin-bg, #0f172a);
    border: 1px solid var(--admin-border, #334155);
    border-radius: 8px;
    color: var(--admin-text, #f1f5f9);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}

.add-input:focus {
    border-color: var(--admin-primary, #3b82f6);
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: var(--admin-primary, #3b82f6);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-add:hover:not(:disabled) {
    background: var(--admin-primary-hover, #2563eb);
}

.btn-add:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.config-manager-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--admin-border, #334155);
    display: flex;
    justify-content: flex-end;
}

.btn-close {
    padding: 10px 20px;
    background: var(--admin-hover, #334155);
    color: var(--admin-text, #f1f5f9);
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-close:hover {
    background: var(--admin-border, #475569);
}
</style>
