<template>
    <section class="bg-gradient-to-b from-gray-50 to-secondary overflow-hidden py-6" aria-label="Chứng nhận và đối tác">
        <div class="container h-full flex flex-col gap-6">
            <div class="bg-gray-50 rounded-2xl p-6 flex-1 flex flex-col">
                <div class="flex flex-col lg:flex-row items-center gap-6 mb-4">
                    <div class="lg:w-1/4 text-center lg:text-left flex-shrink-0">
                        <h2 class="text-2xl font-bold text-secondary">
                            Giấy Chứng Nhận & <span class="text-primary">Chứng Chỉ</span>
                        </h2>
                        <p class="text-gray-600 text-sm mt-2">Uy tín & Chất lượng được công nhận</p>
                    </div>
                    <div class="lg:w-3/4 overflow-hidden flex-1">
                        <div class="certificates-scroll" @mouseenter="pauseAnimation = true" @mouseleave="pauseAnimation = false">
                            <div class="certificates-track" :class="{ paused: pauseAnimation }">
                                <div v-for="i in 10" :key="'cert-' + i" class="flex-shrink-0 mx-3">
                                    <div class="bg-white rounded-xl shadow-lg p-3 hover:shadow-2xl transition-all duration-300">
                                        <img src="/images/chungnhan.jpg" :alt="'Giấy chứng nhận SHT ' + i" loading="lazy" class="h-32 w-auto object-contain rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-r from-secondary via-secondary-light to-secondary rounded-2xl p-6 flex-shrink-0">
                <div class="flex flex-col lg:flex-row items-center gap-6">
                    <div class="lg:w-1/4 text-center lg:text-left flex-shrink-0">
                        <h2 class="text-2xl font-bold text-white">
                            Đối Tác <span class="text-primary">Tin Cậy</span>
                        </h2>
                        <p class="text-gray-400 text-sm mt-2">Hợp tác cùng các thương hiệu hàng đầu</p>
                    </div>
                    <div class="lg:w-3/4 overflow-hidden flex-1">
                        <div class="partners-scroll" @mouseenter="pausePartners = true" @mouseleave="pausePartners = false">
                            <div class="partners-track" :class="{ paused: pausePartners }">
                                <img v-for="i in 10" :key="'partner-' + i" :src="`/images/doitac.jpg`" :alt="'Đối tác SHT ' + i" loading="lazy" class="h-16 w-auto object-contain mx-10 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const pauseAnimation = ref(false)
const pausePartners = ref(false)
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
