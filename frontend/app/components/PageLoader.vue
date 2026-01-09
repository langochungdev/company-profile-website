<!-- Component preloader hiển thị khi trang web đang load -->
<template>
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-100" enter-to-class="opacity-100" leave-active-class="transition duration-500" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isLoading" class="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
            <div class="relative w-40 h-40">
                <div class="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <img src="/images/logo.png" alt="SHT Logo" class="w-24 h-24 object-contain" />
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

<style scoped></style>
