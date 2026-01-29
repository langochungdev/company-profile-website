<!-- Chức năng: View quản lý Users (chỉ hiển thị cho superadmin) -->
<template>
    <div class="users-wrapper">


        <div v-if="!isSuperAdmin" class="no-access">
            <Icon name="mdi:lock" />
            <h3>Không có quyền truy cập</h3>
            <p>Chỉ Super Admin mới có thể quản lý tài khoản người dùng.</p>
        </div>

        <template v-else>
            <div class="users-header">
                <h2 class="users-title">Quản lý tài khoản</h2>
                <div class="users-header-actions">
                    <button class="change-password-btn" @click="openChangePasswordModal">
                        <Icon name="mdi:key-change" />
                        <span>Đổi mật khẩu</span>
                    </button>
                    <button class="add-user-btn" @click="openAddModal">
                        <Icon name="mdi:account-plus" />
                        <span>Thêm user</span>
                    </button>
                </div>
            </div>

            <UserList :users="users" :loading="loading" @delete="handleDelete" @set-password="openPasswordModal" />

            <UserFormModal v-if="showModal" :user="selectedUser" :loading="formLoading" :error="formError || error" @close="closeModal" @submit="handleSubmit" />

            <SetPasswordModal v-if="showPasswordModal" :user="selectedPasswordUser!" :loading="passwordLoading" :error="passwordError" @close="closePasswordModal" @submit="handleSetPassword" />

            <ChangePasswordModal v-if="showChangePasswordModal" :email="user?.email || ''" :loading="changePasswordLoading" :error="changePasswordError" @close="closeChangePasswordModal" @submit="handleChangePassword" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { signInWithCustomToken } from 'firebase/auth'
import { useAuth } from '@/admin/composables/useAuth'
import { useUserManagement } from '@/admin/composables/useUserManagement'
import UserList from './UserList.vue'
import UserFormModal from './UserFormModal.vue'
import SetPasswordModal from './SetPasswordModal.vue'
import ChangePasswordModal from './ChangePasswordModal.vue'
import type { AdminUser } from '@/admin/types/auth.type'

const { $auth } = useNuxtApp()
const { isSuperAdmin, user, signOut } = useAuth()
const { users, loading, error, loadUsers, addUser, updateUser, deleteUser, toggleUserStatus } = useUserManagement()

const showModal = ref(false)
const selectedUser = ref<AdminUser | null>(null)
const formLoading = ref(false)
const formError = ref<string | null>(null)

const showPasswordModal = ref(false)
const selectedPasswordUser = ref<AdminUser | null>(null)
const passwordLoading = ref(false)
const passwordError = ref<string | null>(null)

const showChangePasswordModal = ref(false)
const changePasswordLoading = ref(false)
const changePasswordError = ref<string | null>(null)

const impersonatingUser = ref<{ email: string; displayName?: string } | null>(null)
const originalUserEmail = ref<string | null>(null)

onMounted(() => {
    if (isSuperAdmin.value) {
        loadUsers()
    }
})

const openAddModal = () => {
    selectedUser.value = null
    formError.value = null
    showModal.value = true
}



const closeModal = () => {
    showModal.value = false
    selectedUser.value = null
}

const handleSubmit = async (data: { email: string; username: string; password?: string }) => {
    formLoading.value = true

    try {
        if (selectedUser.value) {
            // Edit logic removed
        } else {
            if (!data.password) {
                formError.value = 'Mật khẩu là bắt buộc'
                formLoading.value = false
                return
            }

            const response = await $fetch<{ success: boolean; user: any }>('/api/admin/create-user', {
                method: 'POST',
                body: {
                    email: data.email,
                    username: data.username,
                    password: data.password
                }
            })

            if (response.success) {
                await loadUsers()
            }
        }

        closeModal()
    } catch (err: any) {

        formError.value = err.data?.message || err.message || 'Không thể thực hiện'
    } finally {
        formLoading.value = false
    }
}



const handleDelete = async (uid: string) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa tài khoản này? Hành động này không thể hoàn tác.')
    if (!confirmed) return

    await deleteUser(uid)
}

const openPasswordModal = (user: AdminUser) => {
    selectedPasswordUser.value = user
    passwordError.value = null
    showPasswordModal.value = true
}

const closePasswordModal = () => {
    showPasswordModal.value = false
    selectedPasswordUser.value = null
    passwordError.value = null
}

const handleSetPassword = async (data: { password: string; username?: string }) => {
    if (!selectedPasswordUser.value) return

    passwordLoading.value = true
    passwordError.value = null

    try {
        await $fetch('/api/admin/set-password', {
            method: 'POST',
            body: {
                email: selectedPasswordUser.value.email,
                password: data.password,
                username: data.username
            }
        })

        if (data.username) {
            await updateUser(selectedPasswordUser.value.uid, {
                username: data.username,
                hasPassword: true
            })
        } else {
            await updateUser(selectedPasswordUser.value.uid, {
                hasPassword: true
            })
        }

        await loadUsers()
        closePasswordModal()
    } catch (err: any) {

        passwordError.value = err.data?.message || err.message || 'Không thể thiết lập password'
    } finally {
        passwordLoading.value = false
    }
}

const handleImpersonate = async (targetUser: AdminUser) => {
    const confirmed = window.confirm(`Bạn sẽ đăng nhập với tư cách "${targetUser.displayName || targetUser.email}". Tiếp tục?`)
    if (!confirmed) return

    try {
        const response = await $fetch<{ token: string; user: any }>('/api/admin/impersonate', {
            method: 'POST',
            body: { targetUid: targetUser.uid }
        })

        sessionStorage.setItem('originalUserEmail', user.value?.email || '')
        sessionStorage.setItem('impersonating', JSON.stringify({
            email: targetUser.email,
            displayName: targetUser.displayName
        }))

        await signInWithCustomToken($auth, response.token)

        window.location.reload()
    } catch (err: any) {

        alert(err.data?.message || 'Không thể impersonate user')
    }
}

const exitImpersonate = async () => {
    sessionStorage.removeItem('impersonating')
    sessionStorage.removeItem('originalUserEmail')
    await signOut()
    window.location.href = '/admin/auth'
}

const openChangePasswordModal = () => {
    changePasswordError.value = null
    showChangePasswordModal.value = true
}

const closeChangePasswordModal = () => {
    showChangePasswordModal.value = false
    changePasswordError.value = null
}

const handleChangePassword = async (data: { oldPassword: string; newPassword: string }) => {
    if (!user.value?.email) return

    changePasswordLoading.value = true
    changePasswordError.value = null

    try {
        await $fetch('/api/admin/change-password', {
            method: 'POST',
            body: {
                email: user.value.email,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            }
        })

        alert('Đổi mật khẩu thành công!')
        closeChangePasswordModal()
    } catch (err: any) {

        changePasswordError.value = err.data?.message || err.message || 'Không thể đổi mật khẩu'
    } finally {
        changePasswordLoading.value = false
    }
}
</script>

<style scoped>
@import "./styles/users.css";

.impersonate-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 1px solid #fcd34d;
    border-radius: 12px;
    color: #92400e;
    font-size: 14px;
}

.impersonate-banner .iconify {
    font-size: 20px;
}

.exit-impersonate-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    margin-left: auto;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.exit-impersonate-btn:hover {
    background: #b91c1c;
}

.users-header-actions {
    display: flex;
    gap: 12px;
}

.change-password-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #f8fafc;
    color: #475569;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.change-password-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
}
</style>
