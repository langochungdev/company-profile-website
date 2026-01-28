<template>
    <div :class="{ 'edit-mode': editMode }">
        <a :href="zaloUrl" target="_blank" rel="noopener noreferrer" class="zalo-button" aria-label="Chat qua Zalo" data-field-link="phoneNumber">
            <span class="zalo-ping"></span>
            <img :src="zaloIcon" alt="Zalo" class="zalo-icon" data-field="imageUrl" data-field-type="image" />
        </a>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ZaloButtonData {
    phoneNumber?: string
    imageUrl?: string
}

const props = defineProps<{
    data?: ZaloButtonData | null
    editMode?: boolean
}>()

const zaloUrl = computed(() => {
    const phone = props.data?.phoneNumber || '0373763354'
    return `https://zalo.me/${phone.replace(/\s/g, '')}`
})

const zaloIcon = computed(() => props.data?.imageUrl || '/images/zalo-icon.webp')
</script>

<style scoped>
.edit-mode .zalo-button {
    position: relative !important;
    bottom: auto !important;
    right: auto !important;
    margin: 20px auto !important;
}

.zalo-button {
    position: fixed;
    bottom: 5.5rem;
    right: 1.5rem;
    z-index: 50;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    background: linear-gradient(to bottom right, #60a5fa, #2563eb);
}

.zalo-button:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transform: scale(1.1);
    background: linear-gradient(to bottom right, #3b82f6, #1d4ed8);
}

.zalo-ping {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #60a5fa;
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    opacity: 0.75;
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.zalo-icon {
    width: 3rem;
    height: 3rem;
    position: relative;
    z-index: 10;
}
</style>
