<!-- Section topbar chứa thông tin liên hệ và mạng xã hội -->
<template>
    <div class="bg-secondary text-sm py-2 border-b border-white/10">
        <div class="container">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <a href="tel:+84123456789" class="flex items-center gap-2 text-white/80 hover:text-primary transition-colors">
                        <Icon name="mdi:phone" class="w-4 h-4" />
                        <span class="hidden sm:inline">+84 123 456 789</span>
                    </a>
                    <a href="mailto:contact@toptech.com" class="flex items-center gap-2 text-white/80 hover:text-primary transition-colors">
                        <Icon name="mdi:email" class="w-4 h-4" />
                        <span class="hidden md:inline">contact@toptech.com</span>
                    </a>
                    <div class="flex items-center gap-2 text-white/80">
                        <Icon name="mdi:map-marker" class="w-4 h-4" />
                        <span class="hidden lg:inline">123 Tech Street, Ho Chi Minh City</span>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank" rel="noopener noreferrer" :aria-label="social.name" class="text-white/80 hover:text-primary transition-colors">
                        <Icon :name="social.icon" class="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const socialLinks = [
    { name: 'Facebook', icon: 'mdi:facebook', url: 'https://facebook.com' },
    { name: 'Twitter', icon: 'mdi:twitter', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'mdi:linkedin', url: 'https://linkedin.com' },
    { name: 'Instagram', icon: 'mdi:instagram', url: 'https://instagram.com' },
]
</script>
