<template>
    <div class="main-layout min-h-screen overflow-x-hidden">
        <TheHeader />

        <slot />

        <TheFooter />

        <a href="https://zalo.me/0373763354" target="_blank" rel="noopener noreferrer" class="fixed bottom-[5.5rem] right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700" aria-label="Chat qua Zalo">
            <span class="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
            <img src="/images/zalo-icon.webp" alt="Zalo" class="w-12 h-12 relative z-10" />
        </a>
    </div>
</template>

<script setup>
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
import Lenis from '@studio-freight/lenis'

onMounted(() => {
    const lenis = new Lenis({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
})
</script>

<style scoped>
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
</style>
