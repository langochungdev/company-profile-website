<!-- Chức năng: Trang đăng nhập Admin với Username/Password (hoặc đăng ký Super Admin lần đầu) -->
<template>
    <div class="login-wrapper">
        <div class="login-card">
            <div class="login-header">
                <div class="login-logo">
                    <Icon name="mdi:shield-lock" />
                </div>
                <h1 class="login-title">Admin CMS</h1>
                <p class="login-subtitle">{{ isRegisterMode ? 'Tạo tài khoản Super Admin đầu tiên' : 'Đăng nhập để quản lý nội dung website' }}</p>
            </div>

            <div class="login-content">
                <div v-if="checkingUsers" class="loading-check">
                    <Icon name="mdi:loading" class="spin" />
                    <span>Đang kiểm tra...</span>
                </div>

                <template v-else>
                    <div v-if="error" class="error-message">
                        <Icon name="mdi:alert-circle" />
                        <span>{{ error }}</span>
                    </div>

                    <div v-if="successMessage" class="success-message">
                        <Icon name="mdi:check-circle" />
                        <span>{{ successMessage }}</span>
                    </div>

                    <form v-if="isRegisterMode" class="password-form" @submit.prevent="handleRegister">
                        <div class="form-group">
                            <label class="form-label">Username *</label>
                            <div class="input-wrapper">
                                <Icon name="mdi:account" />
                                <input v-model="registerForm.username" type="text" class="form-input" placeholder="admin" required :disabled="loading" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Email *</label>
                            <div class="input-wrapper">
                                <Icon name="mdi:email" />
                                <input v-model="registerForm.email" type="email" class="form-input" placeholder="admin@example.com" required :disabled="loading" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Mật khẩu * <span class="hint">(Tối thiểu 6 ký tự)</span></label>
                            <div class="input-wrapper">
                                <Icon name="mdi:lock" />
                                <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required :disabled="loading" />
                                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                                    <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                                </button>
                            </div>
                        </div>

                        <button type="submit" class="submit-btn" :disabled="loading || !canRegister">
                            <Icon v-if="loading" name="mdi:loading" class="spin" />
                            <Icon v-else name="mdi:account-plus" />
                            <span>{{ loading ? 'Đang tạo...' : 'Tạo tài khoản Super Admin' }}</span>
                        </button>
                    </form>

                    <form v-else class="password-form" @submit.prevent="handlePasswordLogin">
                        <div class="form-group">
                            <label class="form-label">Username hoặc Email</label>
                            <div class="input-wrapper">
                                <Icon name="mdi:account" />
                                <input v-model="credentials.usernameOrEmail" type="text" class="form-input" placeholder="admin hoặc admin@example.com" required :disabled="loading" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Mật khẩu</label>
                            <div class="input-wrapper">
                                <Icon name="mdi:lock" />
                                <input v-model="credentials.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required :disabled="loading" />
                                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                                    <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                                </button>
                            </div>
                        </div>

                        <button type="submit" class="submit-btn" :disabled="loading || !canSubmit">
                            <Icon v-if="loading" name="mdi:loading" class="spin" />
                            <Icon v-else name="mdi:login" />
                            <span>{{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
                        </button>
                    </form>
                </template>
            </div>

            <div class="login-footer">
                <p v-if="!isRegisterMode">Chưa có tài khoản? Liên hệ Super Admin để được cấp quyền.</p>
                <p v-else>Đây là lần thiết lập đầu tiên. Tạo tài khoản Super Admin để bắt đầu.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/admin/composables/useAuth'

const { loading, error, signInWithPassword } = useAuth()

const checkingUsers = ref(true)
const isRegisterMode = ref(false)
const showPassword = ref(false)
const successMessage = ref<string | null>(null)
const localLoading = ref(false)
const localError = ref<string | null>(null)

const credentials = ref({
    usernameOrEmail: '',
    password: ''
})

const registerForm = ref({
    username: '',
    email: '',
    password: ''
})

const canSubmit = computed(() => {
    return credentials.value.usernameOrEmail.trim() && credentials.value.password.trim()
})

const canRegister = computed(() => {
    return registerForm.value.username.trim() && registerForm.value.email.trim() && registerForm.value.password.length >= 6
})

onMounted(async () => {
    await checkHasUsers()
})

const checkHasUsers = async () => {
    checkingUsers.value = true
    try {
        const response = await $fetch<{ hasUsers: boolean }>('/api/admin/check-has-users')
        isRegisterMode.value = !response.hasUsers
    } catch (err) {

        isRegisterMode.value = false
    } finally {
        checkingUsers.value = false
    }
}

const handleRegister = async () => {
    if (!canRegister.value) return

    localLoading.value = true
    localError.value = null
    successMessage.value = null

    try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/admin/register-first-admin', {
            method: 'POST',
            body: {
                email: registerForm.value.email.trim(),
                password: registerForm.value.password,
                username: registerForm.value.username.trim()
            }
        })

        successMessage.value = response.message
        isRegisterMode.value = false

        credentials.value.usernameOrEmail = registerForm.value.email
        credentials.value.password = registerForm.value.password
    } catch (err: any) {

        localError.value = err.data?.message || err.message || 'Không thể tạo tài khoản'
    } finally {
        localLoading.value = false
    }
}

const handlePasswordLogin = async () => {
    if (!canSubmit.value) return
    successMessage.value = null
    await signInWithPassword(credentials.value.usernameOrEmail.trim(), credentials.value.password)
}
</script>

<style scoped>
@import "./styles/login.css";

.loading-check {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 40px;
    color: #64748b;
}

.success-message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    margin-bottom: 16px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    color: #166534;
    font-size: 14px;
}

.success-message .iconify {
    font-size: 18px;
    flex-shrink: 0;
}

.hint {
    font-weight: 400;
    font-size: 12px;
    color: #94a3b8;
}
</style>
