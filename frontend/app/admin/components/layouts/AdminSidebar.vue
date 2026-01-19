<!-- Chức năng: Sidebar navigation cho admin panel -->
<template>
    <aside :class="['admin-sidebar', { 'sidebar-collapsed': isCollapsed, 'is-mobile-open': isMobileOpen }]">
        <div class="sidebar-header">
            <NuxtLink v-if="!isCollapsed" to="/" class="sidebar-logo">
                <div class="logo-mark">
                    <Icon name="mdi:view-dashboard" />
                </div>
                <div class="logo-content">
                    <span class="logo-text">Admin</span>
                    <span class="logo-sub">Quản lý nội dung</span>
                </div>
            </NuxtLink>
            <button class="sidebar-toggle" :title="isCollapsed ? 'Mở rộng' : 'Thu gọn'" @click="$emit('toggle')">
                <Icon :name="isCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'" />
            </button>
            <button class="mobile-close-btn" @click="$emit('toggle')">
                <Icon name="mdi:close" />
            </button>
        </div>

        <nav class="sidebar-nav">
            <div class="nav-section">
                <span v-if="!isCollapsed" class="nav-section-label">Trang</span>
                <button v-for="page in pages" :key="page.key" :class="['nav-item', { active: activePage === page.key }]" :title="isCollapsed ? page.name : ''" @click="$emit('switch', page.key)">
                    <div class="nav-icon-wrapper">
                        <Icon :name="page.icon" class="nav-icon" />
                    </div>
                    <span v-if="!isCollapsed" class="nav-text">{{ page.name }}</span>
                    <span v-if="!isCollapsed && page.type === 'collection'" class="nav-badge">
                        <Icon name="mdi:database" />
                    </span>
                </button>
            </div>
        </nav>

        <div class="sidebar-footer">
            <NuxtLink to="/" class="footer-link" :title="isCollapsed ? 'Xem trang web' : ''">
                <Icon name="mdi:open-in-new" />
                <span v-if="!isCollapsed">Xem trang web</span>
            </NuxtLink>
            <button class="logout-btn" :title="isCollapsed ? 'Đăng xuất' : ''">
                <Icon name="mdi:logout" />
                <span v-if="!isCollapsed">Đăng xuất</span>
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
defineProps<{
    pages: Array<{ key: string; name: string; icon: string; type?: string }>
    activePage: string
    isCollapsed: boolean
    isMobileOpen?: boolean
}>()

defineEmits<{
    toggle: []
    switch: [pageKey: string]
}>()
</script>

<style scoped>
@import "../../styles/components/layouts/admin-sidebar/desktop.css";
@import "../../styles/components/layouts/admin-sidebar/mobile.css";
</style>
