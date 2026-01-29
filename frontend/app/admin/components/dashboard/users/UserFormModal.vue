<!-- Chức năng: Modal thêm/sửa user (chỉ superadmin) - Tạo user đầy đủ với password -->
<template>
    <div class="user-modal-overlay" @click.self="$emit('close')">
        <div class="user-modal">
            <div class="modal-header">
                <h2 class="modal-title">{{ isEdit ? 'Chỉnh sửa User' : 'Thêm User mới' }}</h2>
                <button class="modal-close" @click="$emit('close')">
                    <Icon name="mdi:close" />
                </button>
            </div>

            <form class="modal-form" @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label class="form-label">Username *</label>
                    <input v-model="form.username" type="text" class="form-input" :class="{ 'input-error': usernameError }" placeholder="admin" required @blur="checkUsernameAvailability" />
                    <p v-if="checkingUsername" class="field-hint">
                        <Icon name="mdi:loading" class="spin" /> Đang kiểm tra...
                    </p>
                    <p v-else-if="usernameError" class="field-error">{{ usernameError }}</p>
                    <p v-else-if="usernameChecked && !usernameError && form.username" class="field-success">
                        <Icon name="mdi:check" /> Username khả dụng
                    </p>
                </div>

                <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input v-model="form.email" type="email" class="form-input" placeholder="user@example.com" :disabled="isEdit" required />
                </div>

                <div v-if="!isEdit" class="form-group">
                    <label class="form-label">Mật khẩu * <span class="hint">(Tối thiểu 6 ký tự)</span></label>
                    <div class="input-wrapper">
                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required />
                        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                            <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                        </button>
                    </div>
                    <p v-if="form.password && form.password.length < 6" class="field-error">Mật khẩu phải có ít nhất 6 ký tự</p>
                </div>

                <p v-if="error" class="error-text">{{ error }}</p>

                <div class="modal-actions">
                    <button type="button" class="modal-btn cancel" @click="$emit('close')">Hủy</button>
                    <button type="submit" class="modal-btn submit" :disabled="loading || !isValid || !!usernameError || checkingUsername">
                        {{ loading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Thêm user' }}
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
    user?: AdminUser | null
    loading?: boolean
    error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
    user: null,
    loading: false,
    error: null
})

const emit = defineEmits<{
    close: []
    submit: [data: { email: string; username: string; password?: string }]
}>()

const form = ref({
    email: '',
    username: '',
    password: ''
})

const showPassword = ref(false)
const checkingUsername = ref(false)
const usernameChecked = ref(false)
const usernameError = ref<string | null>(null)
const originalUsername = ref<string | null>(null)

const isEdit = computed(() => !!props.user)

const isValid = computed(() => {
    if (!form.value.email.trim() || !form.value.username.trim()) return false
    if (!isEdit.value && form.value.password.length < 6) return false
    return true
})

watch(
    () => props.user,
    (user) => {
        if (user) {
            form.value.email = user.email
            form.value.username = user.username || ''
            form.value.password = ''
            originalUsername.value = user.username || null
        } else {
            form.value.email = ''
            form.value.username = ''
            form.value.password = ''
            originalUsername.value = null
        }
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

const checkUsernameAvailability = async () => {
    const username = form.value.username.trim()
    if (!username) return

    if (isEdit.value && username === originalUsername.value) {
        usernameError.value = null
        usernameChecked.value = true
        return
    }

    checkingUsername.value = true
    usernameError.value = null

    try {
        const response = await $fetch<{ available: boolean }>('/api/admin/check-username', {
            method: 'POST',
            body: {
                username,
                excludeUid: props.user?.uid
            }
        })

        if (!response.available) {
            usernameError.value = 'Username đã tồn tại'
        }
        usernameChecked.value = true
    } catch (err: any) {

        usernameError.value = 'Không thể kiểm tra username'
    } finally {
        checkingUsername.value = false
    }
}

const handleSubmit = async () => {
    if (!isValid.value) return

    if (!usernameChecked.value) {
        await checkUsernameAvailability()
    }

    if (usernameError.value) return

    emit('submit', {
        email: form.value.email.trim(),
        username: form.value.username.trim(),
        password: isEdit.value ? undefined : form.value.password
    })
}
</script>

<style scoped>
@import "./styles/users.css";

.input-error {
    border-color: #ef4444 !important;
}

.field-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
}

.field-error {
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
}

.field-success {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #22c55e;
    margin-top: 4px;
}

.hint {
    font-weight: 400;
    font-size: 12px;
    color: #94a3b8;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-wrapper .form-input {
    padding-right: 42px;
}

.toggle-password {
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

.toggle-password:hover {
    background: #f1f5f9;
    color: #334155;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
