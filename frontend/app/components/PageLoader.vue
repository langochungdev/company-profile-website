<!-- Component preloader hiển thị khi trang web đang load -->
<template>
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-100" enter-to-class="opacity-100" leave-active-class="transition duration-500" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isLoading" class="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
            <div class="relative">
                <div class="text-center mb-8">
                    <div class="text-5xl font-bold text-white mb-2">
                        <span class="text-primary">Top</span>tech
                    </div>
                    <p class="text-white/60 text-sm">Loading amazing experience...</p>
                </div>

                <div class="relative w-32 h-32 mx-auto">
                    <div class="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                    <div class="absolute inset-2 border-4 border-transparent border-t-white rounded-full animate-spin-slow"></div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
const isLoading = ref(true)

onMounted(() => {
    Promise.all([
        new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve()
            } else {
                window.addEventListener('load', resolve)
            }
        }),
        new Promise(resolve => setTimeout(resolve, 800))
    ]).then(() => {
        setTimeout(() => {
            isLoading.value = false
        }, 300)
    })
})
</script>

<style scoped>
@keyframes spin-slow {
    to {
        transform: rotate(-360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 2s linear infinite;
}
</style>
