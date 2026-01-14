<template>
    <section class="certificates-section" aria-label="Chứng nhận">
        <div class="certificates-container">
            <div class="certificates-box">
                <div class="certificates-content">
                    <div class="certificates-header">
                        <h2 class="certificates-title">
                            Giấy Chứng Nhận & <span class="text-primary">Chứng Chỉ</span>
                        </h2>
                        <p class="certificates-subtitle">Uy tín & Chất lượng được công nhận</p>
                    </div>
                    <div class="certificates-scroll-wrapper">
                        <div class="certificates-scroll" @mouseenter="pauseAnimation = true" @mouseleave="pauseAnimation = false">
                            <div class="certificates-track" :class="{ paused: pauseAnimation }">
                                <template v-for="set in 2" :key="'cert-set-' + set">
                                    <div v-for="i in 10" :key="'cert-' + set + '-' + i" class="certificate-item">
                                        <div class="certificate-card" @click="openPopup('/images/chungnhan.jpg')">
                                            <img src="/images/chungnhan.jpg" :alt="'Giấy chứng nhận SHT ' + i" loading="lazy" class="certificate-img" />
                                        </div>
                                    </div>
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
                    <div v-if="showPopup" class="popup-overlay" @click="closePopup">
                        <div class="popup-content">
                            <img :src="selectedImage" alt="Giấy chứng nhận" class="popup-img" />
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </ClientOnly>
    </section>
</template>

<script setup>
const pauseAnimation = ref(false)
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
@import "../styles/cert-section/desktop.css";
@import "../styles/cert-section/mobile.css";
</style>
