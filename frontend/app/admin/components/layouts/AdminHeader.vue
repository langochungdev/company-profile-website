<!-- Chức năng: Header với breadcrumb, tabs và nút Save global cho admin panel -->
<template>
    <header class="admin-header">
        <div class="header-left">
            <button class="mobile-menu-toggle" @click="$emit('toggle-menu')">
                <Icon name="mdi:menu" />
            </button>
            <div class="breadcrumb">
                <span class="breadcrumb-item">
                    <Icon name="mdi:home" class="breadcrumb-icon" />
                </span>
                <Icon name="mdi:chevron-right" class="breadcrumb-sep" />
                <span class="breadcrumb-item active">{{ pageName }}</span>
            </div>
        </div>

        <div v-if="tabs?.length" class="header-tabs">
            <button v-for="tab in tabs" :key="tab.key" :class="['header-tab', { active: activeTab === tab.key }]" @click="$emit('tab-change', tab.key)">
                <Icon :name="tab.icon" />
                <span class="tab-label">{{ tab.label }}</span>
                <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
            </button>
        </div>

        <div class="header-right">
            <Transition name="fade">
                <button v-if="showDiscardButton && hasChanges" class="discard-btn" @click="$emit('discard')">
                    <Icon name="mdi:undo" />
                    <span class="btn-text">Hủy</span>
                </button>
            </Transition>
            <Transition name="fade">
                <button v-if="showSaveButton" :class="['save-btn', { 'has-changes': hasChanges, disabled: isSaving }]" :disabled="!hasChanges || isSaving" @click="$emit('save')">
                    <Icon :name="isSaving ? 'mdi:loading' : 'mdi:content-save'" :class="{ spin: isSaving }" />
                    <span class="save-text">{{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
                </button>
            </Transition>

            <div v-if="user" class="user-menu">
                <button class="user-btn" @click="toggleUserMenu">
                    <div class="user-avatar">
                        <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || ''" />
                        <Icon v-else name="mdi:account" />
                    </div>
                    <span class="user-name">{{ user.displayName || user.email }}</span>
                    <Icon name="mdi:chevron-down" class="dropdown-icon" />
                </button>
                <Transition name="fade">
                    <div v-if="showUserMenu" class="user-dropdown">
                        <div class="user-info">
                            <span class="user-email">{{ user.email }}</span>
                            <span class="user-role">{{ user.role === 'superadmin' ? 'Super Admin' : 'Admin' }}</span>
                        </div>
                        <button class="logout-btn" @click="handleLogout">
                            <Icon name="mdi:logout" />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </Transition>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AdminUser } from '@/admin/types/auth.type'

interface TabItem {
    key: string
    label: string
    icon: string
    count?: number
}

defineProps<{
    pageName: string
    hasChanges?: boolean
    isSaving?: boolean
    showSaveButton?: boolean
    showDiscardButton?: boolean
    tabs?: TabItem[]
    activeTab?: string
    user?: AdminUser | null
}>()

const emit = defineEmits<{
    save: []
    discard: []
    'tab-change': [key: string]
    'toggle-menu': []
    logout: []
}>()

const showUserMenu = ref(false)

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}

const handleLogout = () => {
    showUserMenu.value = false
    emit('logout')
}
</script>

<style scoped>
@import "../../styles/components/layouts/admin-header.css";

.user-menu {
    position: relative;
    margin-left: 16px;
}

.user-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.user-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: 16px;
    color: #64748b;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-name {
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dropdown-icon {
    font-size: 16px;
    color: #64748b;
}

.user-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    min-width: 200px;
    z-index: 100;
    overflow: hidden;
}

.user-info {
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
}

.user-email {
    display: block;
    font-size: 14px;
    color: #334155;
    margin-bottom: 4px;
}

.user-role {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    color: #3b82f6;
    background: #eff6ff;
    padding: 2px 8px;
    border-radius: 10px;
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    font-size: 14px;
    color: #dc2626;
    cursor: pointer;
    transition: all 0.2s;
}

.logout-btn:hover {
    background: #fef2f2;
}

@media (max-width: 768px) {
    .user-name {
        display: none;
    }

    .dropdown-icon {
        display: none;
    }
}
</style>
