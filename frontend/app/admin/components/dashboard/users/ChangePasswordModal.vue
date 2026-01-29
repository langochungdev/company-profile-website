<!-- Chức năng: Modal để user đổi password của chính mình (cần verify password cũ) -->
<template>
    <div class="user-modal-overlay" @click.self="$emit('close')">
        <div class="user-modal password-modal">
            <div class="modal-header">
                <h2 class="modal-title">Đổi mật khẩu</h2>
                <button class="modal-close" @click="$emit('close')">
                    <Icon name="mdi:close" />
                </button>
            </div>

            <form class="modal-form" @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label class="form-label">Mật khẩu hiện tại *</label>
                    <div class="input-wrapper">
                        <Icon name="mdi:lock" />
                        <input v-model="form.oldPassword" :type="showOldPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required />
                        <button type="button" class="toggle-password-btn" @click="showOldPassword = !showOldPassword">
                            <Icon :name="showOldPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                        </button>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        Mật khẩu mới *
                        <span class="label-hint">(Tối thiểu 6 ký tự)</span>
                    </label>
                    <div class="input-wrapper">
                        <Icon name="mdi:lock-plus" />
                        <input v-model="form.newPassword" :type="showNewPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required />
                        <button type="button" class="toggle-password-btn" @click="showNewPassword = !showNewPassword">
                            <Icon :name="showNewPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                        </button>
                    </div>
                    <p v-if="form.newPassword && form.newPassword.length < 6" class="field-error">Password phải có ít nhất 6 ký tự</p>
                </div>

                <div class="form-group">
                    <label class="form-label">Xác nhận mật khẩu mới *</label>
                    <div class="input-wrapper">
                        <Icon name="mdi:lock-check" />
                        <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••" required />
                        <button type="button" class="toggle-password-btn" @click="showConfirmPassword = !showConfirmPassword">
                            <Icon :name="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                        </button>
                    </div>
                    <p v-if="form.confirmPassword && form.newPassword !== form.confirmPassword" class="field-error">Mật khẩu không khớp</p>
                </div>

                <div v-if="error" class="error-banner">
                    <Icon name="mdi:alert-circle" />
                    <span>{{ error }}</span>
                </div>

                <div class="modal-actions">
                    <button type="button" class="modal-btn cancel" @click="$emit('close')">Hủy</button>
                    <button type="submit" class="modal-btn submit" :disabled="loading || !isValid">
                        <Icon v-if="loading" name="mdi:loading" class="spin" />
                        <span>{{ loading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    email: string
    loading?: boolean
    error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    error: null
})

const emit = defineEmits<{
    close: []
    submit: [data: { oldPassword: string; newPassword: string }]
}>()

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const isValid = computed(() => {
    if (!form.value.oldPassword) return false
    if (!form.value.newPassword || form.value.newPassword.length < 6) return false
    if (form.value.newPassword !== form.value.confirmPassword) return false
    return true
})

const handleSubmit = () => {
    if (!isValid.value) return

    emit('submit', {
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword
    })
}
</script>

<style scoped>
@import "./styles/users.css";

.password-modal {
    max-width: 480px;
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
    font-size: 13px;
    color: #dc2626;
    margin: 4px 0 0;
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
