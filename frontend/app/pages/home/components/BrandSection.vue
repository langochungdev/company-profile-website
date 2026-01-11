<template>
    <section class="overflow-hidden py-6" aria-label="Chứng nhận và đối tác">
        <div class="container h-full flex flex-col gap-6">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 flex-1 flex flex-col">
                <div class="flex flex-col lg:flex-row items-center gap-6 mb-4">
                    <div class="lg:w-1/4 text-center lg:text-left flex-shrink-0">
                        <h2 class="font-bold text-secondary leading-tight whitespace-nowrap" style="font-size: clamp(1.125rem, 3.5vw, 1.5rem);">
                            Giấy Chứng Nhận & <span class="text-primary">Chứng Chỉ</span>
                        </h2>
                        <p class="text-gray-600 text-sm mt-2">Uy tín & Chất lượng được công nhận</p>
                    </div>
                    <div class="lg:w-3/4 overflow-hidden flex-1">
                        <div class="certificates-scroll" @mouseenter="pauseAnimation = true" @mouseleave="pauseAnimation = false">
                            <div class="certificates-track" :class="{ paused: pauseAnimation }">
                                <template v-for="set in 2" :key="'cert-set-' + set">
                                    <div v-for="i in 10" :key="'cert-' + set + '-' + i" class="flex-shrink-0 mx-4">
                                        <div class="hover:scale-105 transition-all duration-300 cursor-pointer" @click="openPopup('/images/chungnhan.jpg')">
                                            <img src="/images/chungnhan.jpg" :alt="'Giấy chứng nhận SHT ' + i" loading="lazy" class="h-48 w-auto object-contain" />
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-r from-secondary via-secondary-light to-secondary rounded-2xl p-6 flex-shrink-0">
                <div class="flex flex-col lg:flex-row items-center gap-6">
                    <div class="lg:w-1/4 text-center lg:text-left flex-shrink-0">
                        <h2 class="font-bold text-white leading-tight whitespace-nowrap" style="font-size: clamp(1.125rem, 3.5vw, 1.5rem);">
                            Đối Tác <span class="text-primary">Tin Cậy</span>
                        </h2>
                        <p class="text-gray-400 text-sm mt-2">Hợp tác cùng các thương hiệu hàng đầu</p>
                    </div>
                    <div class="lg:w-3/4 overflow-hidden flex-1">
                        <div class="partners-scroll" @mouseenter="pausePartners = true" @mouseleave="pausePartners = false">
                            <div class="partners-track" :class="{ paused: pausePartners }">
                                <template v-for="set in 2" :key="'partner-set-' + set">
                                    <img v-for="i in 10" :key="'partner-' + set + '-' + i" :src="`/images/doitac.jpg`" :alt="'Đối tác SHT ' + i" loading="lazy" class="h-16 w-auto object-contain mx-10 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300" />
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ClientOnly>
            <Teleport to="body">
                <Transition name="fade">
                    <div v-if="showPopup" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" @click="closePopup">
                        <div class="w-full h-full flex items-center justify-center">
                            <img :src="selectedImage" alt="Giấy chứng nhận" class="w-[75vw] md:w-auto md:h-[67vh] max-w-[95vw] max-h-[95vh] object-contain" />
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </ClientOnly>
    </section>
</template>

<script setup>
const pauseAnimation = ref(false)
const pausePartners = ref(false)
const showPopup = ref(false)
const selectedImage = ref('')

const openPopup = (imageSrc) => {
    selectedImage.value = imageSrc
    showPopup.value = true
    document.body.style.overflow = 'hidden'
}

const closePopup = () => {
    showPopup.value = false
    document.body.style.overflow = ''
}

onUnmounted(() => {
    document.body.style.overflow = ''
})
</script>

<style scoped>
.certificates-scroll,
.partners-scroll {
    overflow: hidden;
    width: 100%;
}

.certificates-track,
.partners-track {
    display: flex;
    width: max-content;
    animation: scroll-left 40s linear infinite;
}


.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.partners-track {
    animation-duration: 25s;
}

.paused {
    animation-play-state: paused;
}

@keyframes scroll-left {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}
</style>
