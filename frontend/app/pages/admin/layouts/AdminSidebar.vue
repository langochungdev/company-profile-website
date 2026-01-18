<!-- Chức năng: Sidebar navigation cho admin panel -->
<template>
    <aside :class="['admin-sidebar', { 'sidebar-collapsed': isCollapsed }]">
        <div class="sidebar-header">
            <div v-if="!isCollapsed" class="sidebar-logo">
                <Icon name="mdi:shield-lock" class="logo-icon" />
                <span class="logo-text">Admin Panel</span>
            </div>
            <button class="sidebar-toggle" @click="$emit('toggle')">
                <Icon :name="isCollapsed ? 'mdi:menu' : 'mdi:close'" />
            </button>
        </div>

        <nav class="sidebar-nav">
            <button v-for="page in pages" :key="page.key" :class="['nav-item', { active: activePage === page.key }]" @click="$emit('switch', page.key)">
                <Icon :name="page.icon" class="nav-icon" />
                <span v-if="!isCollapsed" class="nav-text">{{ page.name }}</span>
            </button>
        </nav>

        <div class="sidebar-footer">
            <button v-if="!isCollapsed" class="logout-btn">
                <Icon name="mdi:logout" class="nav-icon" />
                <span>Đăng xuất</span>
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
defineProps<{
    pages: Array<{ key: string; name: string; icon: string; type?: string }>
    activePage: string
    isCollapsed: boolean
}>()

defineEmits<{
    toggle: []
    switch: [pageKey: string]
}>()
</script>

<style scoped>
.admin-sidebar {
    width: 250px;
    height: 100vh;
    background: #1e293b;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    transition: width 0.3s ease;
}

.sidebar-collapsed {
    width: 60px;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #334155;
}

.sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-icon {
    width: 28px;
    height: 28px;
    color: #3b82f6;
}

.logo-text {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
}

.sidebar-toggle {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
}

.sidebar-toggle:hover {
    background: #334155;
    color: #ffffff;
}

.sidebar-toggle svg {
    width: 20px;
    height: 20px;
}

.sidebar-nav {
    flex: 1;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: left;
}

.nav-item:hover {
    background: #334155;
    color: #ffffff;
}

.nav-item.active {
    background: #3b82f6;
    color: #ffffff;
}

.nav-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.nav-text {
    font-size: 14px;
    font-weight: 500;
}

.sidebar-footer {
    padding: 16px;
    border-top: 1px solid #334155;
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
}

.logout-btn:hover {
    background: #7f1d1d;
    color: #fecaca;
}

.sidebar-collapsed .sidebar-header {
    justify-content: center;
    padding: 16px 8px;
}

.sidebar-collapsed .nav-item {
    justify-content: center;
    padding: 12px;
}

.sidebar-collapsed .logout-btn {
    justify-content: center;
    padding: 12px;
}

@media (max-width: 768px) {
    .admin-sidebar {
        transform: translateX(-100%);
    }

    .admin-sidebar:not(.sidebar-collapsed) {
        transform: translateX(0);
    }
}
</style>
