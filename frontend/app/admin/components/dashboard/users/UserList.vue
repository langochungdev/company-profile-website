<!-- Chức năng: Danh sách users trong bảng -->
<template>
    <div class="users-table">
        <div v-if="loading" class="loading-state">
            <Icon name="mdi:loading" class="spin" />
            <span>Đang tải...</span>
        </div>

        <div v-else-if="users.length === 0" class="empty-state">
            <Icon name="mdi:account-group" />
            <p>Chưa có user nào được thêm</p>
        </div>

        <table v-else>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Username</th>
                    <th>Vai trò</th>

                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.uid">
                    <td>
                        <div class="user-info">
                            <div class="user-avatar">
                                <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || ''" />
                                <Icon v-else name="mdi:account" />
                            </div>
                            <div>
                                <div class="user-name">{{ user.displayName || 'Chưa cập nhật' }}</div>
                                <div class="user-email">{{ user.email }}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span v-if="user.username" class="username-badge">@{{ user.username }}</span>
                        <span v-else class="text-muted">—</span>
                    </td>
                    <td>
                        <span :class="['role-badge', user.role]">
                            <Icon :name="user.role === 'superadmin' ? 'mdi:crown' : 'mdi:shield-account'" />
                            {{ user.role === 'superadmin' ? 'Super Admin' : 'Admin' }}
                        </span>
                    </td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                    <td>
                        <div v-if="user.role !== 'superadmin'" class="actions-cell">
                            <button class="action-btn password" title="Set Password" @click="$emit('set-password', user)">
                                <Icon name="mdi:key" />
                            </button>
                            <button class="action-btn delete" title="Xóa" @click="$emit('delete', user.uid)">
                                <Icon name="mdi:delete" />
                            </button>
                        </div>
                        <span v-else class="role-badge superadmin">
                            <Icon name="mdi:shield-check" /> Bảo vệ
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import type { AdminUser } from '@/admin/types/auth.type'

defineProps<{
    users: AdminUser[]
    loading: boolean
}>()

defineEmits<{
    delete: [uid: string]
    'set-password': [user: AdminUser]
}>()

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}
</script>

<style scoped>
@import "./styles/users.css";
</style>
