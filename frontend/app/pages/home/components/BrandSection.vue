<template>
    <section class="brand-section" aria-label="Chứng nhận và đối tác">
        <div class="brand-container">
            <div class="certificates-box">
                <div class="brand-content">
                    <div class="brand-header">
                        <h2 class="brand-title">
                            Giấy Chứng Nhận & <span class="text-primary">Chứng Chỉ</span>
                        </h2>
                        <p class="brand-subtitle">Uy tín & Chất lượng được công nhận</p>
                    </div>
                    <div class="brand-scroll-wrapper">
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

            <div class="partners-box">
                <div class="brand-content">
                    <div class="brand-header">
                        <h2 class="brand-title brand-title--white">
                            Đối Tác <span class="text-primary">Tin Cậy</span>
                        </h2>
                        <p class="brand-subtitle brand-subtitle--light">Hợp tác cùng các thương hiệu hàng đầu</p>
                    </div>
                    <div class="brand-scroll-wrapper">
                        <div class="partners-scroll" @mouseenter="pausePartners = true" @mouseleave="pausePartners = false">
                            <div class="partners-track" :class="{ paused: pausePartners }">
                                <template v-for="set in 2" :key="'partner-set-' + set">
                                    <img v-for="i in 10" :key="'partner-' + set + '-' + i" :src="`/images/doitac.jpg`" :alt="'Đối tác SHT ' + i" loading="lazy" class="partner-logo" />
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
.brand-section {
    overflow: hidden;
    padding: 1.5rem 0;
}

.brand-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.certificates-box {
    background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
    border-radius: 1rem;
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.partners-box {
    background: linear-gradient(to right, #111111, #1F1F1F, #111111);
    border-radius: 1rem;
    padding: 1.5rem;
    flex-shrink: 0;
}

.brand-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .brand-content {
        flex-direction: row;
        align-items: flex-start;
    }
}

.brand-header {
    width: 100%;
    text-align: center;
    flex-shrink: 0;
}

@media (min-width: 1024px) {
    .brand-header {
        width: 25%;
        text-align: left;
    }
}

.brand-title {
    font-weight: 700;
    color: #111111;
    line-height: 1.25;
    white-space: nowrap;
    font-size: clamp(1.125rem, 3.5vw, 1.5rem);
}

.brand-title--white {
    color: #ffffff;
}

.text-primary {
    color: #DC2626;
}

.brand-subtitle {
    color: #4b5563;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.brand-subtitle--light {
    color: #9ca3af;
}

.brand-scroll-wrapper {
    width: 100%;
    overflow: hidden;
    flex: 1;
}

@media (min-width: 1024px) {
    .brand-scroll-wrapper {
        width: 75%;
    }
}

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

.partners-track {
    animation-duration: 25s;
}

.paused {
    animation-play-state: paused;
}

.certificate-item {
    flex-shrink: 0;
    margin: 0 1rem;
}

.certificate-card {
    transition: transform 0.3s ease;
    cursor: pointer;
}

.certificate-card:hover {
    transform: scale(1.05);
}

.certificate-img {
    height: 6rem;
    width: auto;
    object-fit: contain;
}

.partner-logo {
    height: 4rem;
    width: auto;
    object-fit: contain;
    margin: 0 2.5rem;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all 0.3s ease;
}

.partner-logo:hover {
    filter: grayscale(0%);
    opacity: 1;
}

.popup-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.9);
}

.popup-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-img {
    width: 75vw;
    height: auto;
    max-width: 95vw;
    max-height: 95vh;
    object-fit: contain;
}

@media (min-width: 768px) {
    .popup-img {
        width: auto;
        height: 67vh;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
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
