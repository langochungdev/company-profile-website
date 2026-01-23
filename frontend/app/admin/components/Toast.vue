<!-- Chức năng: Toast notification container hiển thị thông báo tự động tắt -->
<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast">
                <div v-for="toast in toasts" :key="toast.id" :class="['toast', `toast-${toast.type}`]">
                    <Icon :name="getIcon(toast.type)" class="toast-icon" />
                    <span class="toast-message">{{ toast.message }}</span>
                    <button class="toast-close" @click="remove(toast.id)">
                        <Icon name="mdi:close" />
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts, remove } = useToast()

const getIcon = (type: string) => {
    switch (type) {
        case 'success': return 'mdi:check-circle'
        case 'error': return 'mdi:alert-circle'
        case 'warning': return 'mdi:alert'
        case 'info': return 'mdi:information'
        default: return 'mdi:information'
    }
}
</script>

<style scoped>
@import "../styles/components/toast.css";
</style>
