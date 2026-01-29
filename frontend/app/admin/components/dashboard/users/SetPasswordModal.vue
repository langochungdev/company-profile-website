<!-- Chức năng: Modal để Super Admin set password + username cho user -->
<template>
    <div class="user-modal-overlay" @click.self="$emit('close')">
        <div class="user-modal password-modal">
            <div class="modal-header">
                <h2 class="modal-title">Thiết lập mật khẩu</h2>
                <button class="modal-close" @click="$emit('close')">
                    <Icon name="mdi:close" />
                </button>
            </div>

            <div class="user-info-banner">
                <Icon name="mdi:account-circle" />
                <div>
                    <div class="user-name">{{ user.displayName || 'Chưa cập nhật' }}</div>
                    <div class="user-email">{{ user.email }}</div>
                </div>
            </div>

            <form class="modal-form" @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label class="form-label">
                        Username
                        <span v-if="!user.username" class="label-hint">(Tùy chọn - để trống nếu chỉ login bằng email)</span>
                    </label>
                    <div class="input-wrapper">
                        <Icon name="mdi:account" />
                        <input v-model="form.username" type="text" class="form-input" placeholder="admin, manager, etc." @blur="checkUsernameAvailability" />
                    </div>
                    <p v-if="usernameError" class="field-error">{{ usernameError }}</p>
                    <p v-if="form.username && !usernameError && usernameChecked" class="field-success">
                        <Icon name="mdi:check-circle" /> Username khả dụng
                    </p>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        Mật khẩu mới *
                        <span class="label-hint">(Tối thiểu 6 ký tự)</span>
                    </label>
                    <div class="input-wrapper">
                        <Icon name="mdi:lock" />
                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required />
                        <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword">
                            <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                        </button>
                    </div>
                    <p v-if="form.password && form.password.length < 6" class="field-error">Password phải có ít nhất 6 ký tự</p>
                </div>

                <div class="form-group">
                    <label class="form-label">Xác nhận mật khẩu *</label>
                    <div class="input-wrapper">
                        <Icon name="mdi:lock-check" />
                        <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required />
                        <button type="button" class="toggle-password-btn" @click="showConfirmPassword = !showConfirmPassword">
                            <Icon :name="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                        </button>
                    </div>
                    <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="field-error">Mật khẩu không khớp</p>
                </div>

                <div v-if="error" class="error-banner">
                    <Icon name="mdi:alert-circle" />
                    <span>{{ error }}</span>
                </div>

                <div class="modal-actions">
                    <button type="button" class="modal-btn cancel" @click="$emit('close')">Hủy</button>
                    <button type="submit" class="modal-btn submit" :disabled="loading || !isValid">
                        <Icon v-if="loading" name="mdi:loading" class="spin" />
                        <span>{{ loading ? 'Đang xử lý...' : 'Thiết lập password' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { AdminUser } from '@/admin/types/auth.type'

interface Props {
    user: AdminUser
    loading?: boolean
    error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    error: null
})

const emit = defineEmits<{
    close: []
    submit: [data: { password: string; username?: string }]
}>()

const form = ref({
    username: '',
    password: '',
    confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const usernameError = ref<string | null>(null)
const usernameChecked = ref(false)

watch(
    () => props.user,
    (user) => {
        form.value.username = user.username || ''
        form.value.password = ''
        form.value.confirmPassword = ''
        usernameError.value = null
        usernameChecked.value = false
    },
    { immediate: true }
)

watch(
    () => form.value.username,
    () => {
        usernameChecked.value = false
        usernameError.value = null
    }
)

const isValid = computed(() => {
    if (!form.value.password || form.value.password.length < 6) return false
    if (form.value.password !== form.value.confirmPassword) return false
    if (form.value.username && usernameError.value) return false
    return true
})

const checkUsernameAvailability = async () => {
    const username = form.value.username.trim()

    if (!username) {
        usernameChecked.value = false
        usernameError.value = null
        return
    }

    if (username === props.user.username) {
        usernameChecked.value = true
        usernameError.value = null
        return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        usernameError.value = 'Username chỉ được chứa chữ cái, số, gạch dưới và gạch ngang'
        return
    }

    try {
        const response = await $fetch('/api/admin/check-username', {
            method: 'POST',
            body: {
                username,
                excludeUid: props.user.uid
            }
        })

        if (!response.available) {
            usernameError.value = 'Username đã tồn tại'
        } else {
            usernameError.value = null
            usernameChecked.value = true
        }
    } catch (err: any) {

        usernameError.value = 'Không thể kiểm tra username'
    }
}

const handleSubmit = () => {
    if (!isValid.value) return

    const data: { password: string; username?: string } = {
        password: form.value.password
    }

    if (form.value.username.trim()) {
        data.username = form.value.username.trim()
    }

    emit('submit', data)
}
</script>

<style scoped>
@import "./styles/users.css";

.password-modal {
    max-width: 500px;
}

.user-info-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 10px;
    margin-bottom: 24px;
}

.user-info-banner .iconify {
    font-size: 40px;
    color: #64748b;
}

.user-info-banner .user-name {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
}

.user-info-banner .user-email {
    font-size: 13px;
    color: #64748b;
}

.label-hint {
    font-size: 12px;
    font-weight: 400;
    color: #94a3b8;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-wrapper .iconify {
    position: absolute;
    left: 14px;
    font-size: 18px;
    color: #94a3b8;
    pointer-events: none;
}

.input-wrapper .form-input {
    padding-left: 42px;
    padding-right: 42px;
}

.toggle-password-btn {
    position: absolute;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #94a3b8;
    transition: all 0.2s;
}

.toggle-password-btn:hover {
    background: #f1f5f9;
    color: #334155;
}

.toggle-password-btn .iconify {
    font-size: 18px;
}

.field-error {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #dc2626;
    margin: 4px 0 0;
}

.field-success {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #16a34a;
    margin: 4px 0 0;
}

.field-success .iconify {
    font-size: 16px;
}

.error-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    font-size: 13px;
}

.error-banner .iconify {
    font-size: 18px;
    flex-shrink: 0;
}

.modal-btn.submit .spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
