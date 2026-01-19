<template>
    <section class="services-section">
        <div class="container services-container">
            <div class="services-header">
                <div>
                    <div class="services-badge">
                        <span class="badge-dot">
                            <span class="dot-ping" />
                            <span class="dot-core" />
                        </span>
                        Lĩnh Vực Hoạt Động
                    </div>
                    <h2 class="services-title whitespace-nowrap">
                        Các Hạng Mục<span class="text-primary"> Thi Công</span>
                    </h2>
                </div>
                <div class="services-cta">
                    <NuxtLink to="/product" class="cta-button">
                        <span class="cta-text">XEM TẤT CẢ GIẢI PHÁP</span>
                        <Icon name="mdi:arrow-right" class="cta-icon" />
                    </NuxtLink>
                </div>
            </div>

            <div class="mobile-scroll">
                <NuxtLink v-for="(service, index) in services" :key="'m-' + index" :to="service.link" class="mobile-card" :class="{ 'active': activeIndex === index }" @click="activeIndex = index">
                    <img :src="service.image" :alt="service.title" class="mobile-card-bg" />
                    <div class="mobile-card-overlay"></div>
                    <div class="mobile-card-content">
                        <Icon :name="service.icon" class="mobile-card-icon" />
                        <span class="mobile-card-title">{{ service.title }}</span>
                    </div>
                    <div class="mobile-card-expanded">
                        <p class="mobile-card-desc">{{ service.description }}</p>
                        <div class="mobile-card-btn">
                            <span>Xem chi tiết</span>
                            <Icon name="mdi:arrow-right" class="mobile-btn-icon" />
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div class="services-grid">
                <NuxtLink v-for="(service, index) in services" :key="index" :to="service.link" :class="['service-card', getGridClass(index)]">
                    <img :src="service.image" :alt="service.title" loading="lazy" class="service-image" />
                    <div class="service-gradient"></div>
                    <div class="service-content">
                        <div class="service-info">
                            <h3 class="service-name" :class="{ 'name-large': index === 0 }">
                                {{ service.title }}
                            </h3>
                            <p class="service-desc">
                                {{ service.description }}
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const activeIndex = ref(0)
const services = [
    {
        title: 'Lorem Ipsum Dolor',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        icon: 'mdi:face-recognition',
        image: 'https://placehold.co/600x400/webp?text=600x400',
        link: '/product/camera-ai-sht-pro'
    },
    {
        title: 'Consectetur Adipiscing',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.',
        icon: 'mdi:lan',
        image: 'https://placehold.co/600x400/webp?text=600x400',
        link: '/product/switch-poe-24-port'
    },
    {
        title: 'Sed Eiusmod Tempor',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.',
        icon: 'mdi:wifi',
        image: 'https://placehold.co/600x400/webp?text=600x400',
        link: '/product/wifi-6-enterprise'
    },
    {
        title: 'Ut Labore Dolore',
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum sed ut.',
        icon: 'mdi:server',
        image: 'https://placehold.co/600x400/webp?text=600x400',
        link: '/product/router-load-balance'
    },
    {
        title: 'Magna Aliqua Enim',
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.',
        icon: 'mdi:fingerprint',
        image: 'https://placehold.co/600x400/webp?text=600x400',
        link: '/product/may-cham-cong-faceid'
    },
    {
        title: 'Quis Autem Vel',
        description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit sed quia non numquam.',
        icon: 'mdi:alarm-light',
        image: 'https://placehold.co/600x400/webp?text=600x400',
        link: '/product/bao-chay-dia-chi-4-loop'
    },
    {
        title: 'Eius Modi Tempora',
        description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi.',
        icon: 'mdi:phone-voip',
        image: 'https://placehold.co/600x400/webp?text=600x400',
        link: '/product'
    },
    {
        title: 'Incidunt Labore',
        description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum.',
        icon: 'mdi:speaker',
        image: 'https://placehold.co/600x400/webp?text=600x400',
        link: '/product'
    }
]

function getGridClass(index: number) {
    const classes = ['card-0', 'card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6', 'card-7']
    return classes[index] || ''
}
</script>

<style scoped>
@import "@/styles/home/services-section/desktop.css";
@import "@/styles/home/services-section/mobile.css";
</style>
