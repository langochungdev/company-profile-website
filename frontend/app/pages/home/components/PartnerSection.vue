<!-- Chức năng: Hiển thị logo đối tác với hiệu ứng cuộn ngang -->
<template>
    <section class="partners-section" aria-label="Đối tác">
        <div class="partners-container">
            <div class="partners-box">
                <div class="partners-content">
                    <div class="partners-header">
                        <h2 class="partners-title">
                            Đối Tác <span class="text-primary">Tin Cậy</span>
                        </h2>
                        <p class="partners-subtitle">Hợp tác cùng các thương hiệu hàng đầu</p>
                    </div>
                    <div class="partners-scroll-wrapper">
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
    </section>
</template>

<script setup>
const pausePartners = ref(false)
</script>

<style scoped>
.partners-section {
    overflow: hidden;
    padding: 1.5rem 0;
}

.partners-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.partners-box {
    background: linear-gradient(to right, #111111, #1F1F1F, #111111);
    border-radius: 1rem;
    padding: 1.5rem;
}

.partners-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .partners-content {
        flex-direction: row;
        align-items: flex-start;
    }
}

.partners-header {
    width: 100%;
    text-align: center;
    flex-shrink: 0;
}

@media (min-width: 1024px) {
    .partners-header {
        width: 25%;
        text-align: left;
    }
}

.partners-title {
    font-weight: 700;
    color: #ffffff;
    line-height: 1.25;
    white-space: nowrap;
    font-size: clamp(1.125rem, 3.5vw, 1.5rem);
}

.text-primary {
    color: #DC2626;
}

.partners-subtitle {
    color: #9ca3af;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.partners-scroll-wrapper {
    width: 100%;
    overflow: hidden;
    flex: 1;
}

@media (min-width: 1024px) {
    .partners-scroll-wrapper {
        width: 75%;
    }
}

.partners-scroll {
    overflow: hidden;
    width: 100%;
}

.partners-track {
    display: flex;
    width: max-content;
    animation: scroll-left 25s linear infinite;
}

.paused {
    animation-play-state: paused;
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

@keyframes scroll-left {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}
</style>
