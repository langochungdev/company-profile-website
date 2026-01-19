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
                                    <img v-for="i in 10" :key="'partner-' + set + '-' + i" src="https://placehold.co/200x100/webp?text=200x100" :alt="'Đối tác SHT ' + i" loading="lazy" class="partner-logo" />
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
@import "@/styles/home/partner-section/desktop.css";
@import "@/styles/home/partner-section/mobile.css";
</style>
