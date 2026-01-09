<!-- Section topbar chứa thông tin liên hệ và mạng xã hội -->
<template>
    <div class="bg-secondary text-sm py-2 border-b border-white/10">
        <div class="container">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <a href="tel:0901234567" class="flex items-center gap-2 text-white/80 hover:text-primary transition-colors">
                        <Icon name="mdi:phone" class="w-4 h-4" />
                        <span class="hidden sm:inline">0901 234 567</span>
                    </a>
                    <a href="mailto:info@sht.vn" class="flex items-center gap-2 text-white/80 hover:text-primary transition-colors">
                        <Icon name="mdi:email" class="w-4 h-4" />
                        <span class="hidden md:inline">info@sht.vn</span>
                    </a>
                    <div class="flex items-center gap-2 text-white/80">
                        <Icon name="mdi:map-marker" class="w-4 h-4" />
                        <span class="hidden lg:inline">123 Đường ABC, Quận 1, TP.HCM</span>
                    </div>
                </div>

                <!-- <div class="flex items-center gap-3">
                    <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank" rel="noopener noreferrer" :aria-label="social.name" class="text-white/80 hover:text-primary transition-colors">
                        <Icon :name="social.icon" class="w-4 h-4" />
                    </a>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
const socialLinks = [
    { name: 'Facebook', icon: 'mdi:facebook', url: 'https://facebook.com/SHT.security' },
    { name: 'TikTok', icon: 'mdi:music-note', url: 'https://tiktok.com/@sht.security' },
    { name: 'YouTube', icon: 'mdi:youtube', url: 'https://youtube.com/@SHTsecurity' },
    { name: 'Zalo', icon: 'mdi:chat', url: 'https://zalo.me/0901234567' }
]
</script>
