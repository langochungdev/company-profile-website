<!-- Component hiển thị thông tin liên hệ nhanh ở đầu trang -->
<template>
    <div class="bg-secondary text-sm py-1 lg:py-2 border-b border-white/10">
        <div class="container">
            <div class="flex items-center justify-between lg:justify-end gap-3 lg:gap-6">
                <div class="flex items-center gap-1 lg:gap-2 text-white/80 text-xs lg:text-sm min-w-0 flex-1 lg:flex-initial">
                    <Icon name="mdi:map-marker" class="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                    <span class="truncate">123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <a href="mailto:info@sht.vn" class="hidden lg:flex items-center gap-2 text-white/80 hover:text-primary transition-colors">
                    <Icon name="mdi:email" class="w-4 h-4" />
                    <span>info@sht.vn</span>
                </a>
                <a href="tel:0901234567" class="phone-blink flex items-center gap-1 lg:gap-2 text-xs lg:text-sm flex-shrink-0">
                    <Icon name="mdi:phone" class="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                    <span class="whitespace-nowrap">0901 234 567</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes blink-red {

    0%,
    100% {
        color: #ef4444;
    }

    50% {
        color: #fca5a5;
        filter: brightness(1.5);
    }
}

.phone-blink {
    animation: blink-red 1.5s ease-in-out infinite;
}

.phone-blink:hover {
    animation-play-state: paused;
}
</style>
