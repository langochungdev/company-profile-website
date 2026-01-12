<!-- Chức năng: Layout chính cho toàn bộ ứng dụng với header, footer và nút Zalo -->
<template>
    <div class="main-layout">
        <TheHeader />

        <slot />

        <TheFooter />

        <a href="https://zalo.me/0373763354" target="_blank" rel="noopener noreferrer" class="zalo-button" aria-label="Chat qua Zalo">
            <span class="zalo-ping"></span>
            <img src="/images/zalo-icon.webp" alt="Zalo" class="zalo-icon" />
        </a>
    </div>
</template>

<script setup>
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
</script>

<style scoped>
.main-layout {
    min-height: 100vh;
    overflow-x: hidden;
}

.main-layout::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/bg.jpg');
    background-size: 300px;
    background-repeat: repeat;
    z-index: -1;
    pointer-events: none;
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
