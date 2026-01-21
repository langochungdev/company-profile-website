<!-- Chức năng: Header chính với navigation, dropdown menu và breadcrumb -->
<template>
    <div>
        <TopBar class="top-bar" />
        <header :class="['header', isHeaderTransparent ? 'header-transparent' : 'header-scrolled', navVisible ? 'header-visible' : 'header-hidden']">
            <div class="header-container">
                <div class="header-content">
                    <div class="header-left">
                        <NuxtLink to="/" class="logo" aria-label="Trang chủ SHT Security">
                            <img src="/images/logo.png" alt="SHT Security Logo" class="logo-img" />
                        </NuxtLink>

                        <nav v-if="showBreadcrumb" class="inline-breadcrumb" aria-label="Breadcrumb">
                            <span class="breadcrumb-divider">/</span>
                            <ol class="breadcrumb-list">
                                <template v-for="(item, index) in breadcrumbItems" :key="index">
                                    <li v-if="index > 0" class="breadcrumb-separator">
                                        <Icon name="mdi:chevron-right" />
                                    </li>
                                    <li class="breadcrumb-item">
                                        <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb-link">
                                            {{ item.label }}
                                        </NuxtLink>
                                        <span v-else class="breadcrumb-current">{{ item.label }}</span>
                                    </li>
                                </template>
                            </ol>
                        </nav>
                    </div>

                    <nav class="nav-desktop" aria-label="Main navigation">
                        <NuxtLink to="/" class="nav-link">Trang Chủ</NuxtLink>
                        <NuxtLink to="/product" class="nav-link">Sản Phẩm</NuxtLink>
                        <NuxtLink to="/service" class="nav-link">Dịch Vụ</NuxtLink>
                        <NuxtLink to="/post" class="nav-link">Tin Tức</NuxtLink>
                        <NuxtLink to="/about-us" class="nav-link">Giới Thiệu</NuxtLink>
                        <NuxtLink to="/contact" class="nav-link">Liên Hệ</NuxtLink>
                    </nav>

                    <div class="cta-desktop">
                        <button class="cta-btn">Báo Giá</button>
                    </div>

                    <button @click="isMenuOpen = !isMenuOpen" class="menu-toggle" aria-label="Menu">
                        <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="menu-icon" />
                    </button>
                </div>

                <Transition enter-active-class="mobile-menu-enter-active" enter-from-class="mobile-menu-enter-from" enter-to-class="mobile-menu-enter-to" leave-active-class="mobile-menu-leave-active" leave-from-class="mobile-menu-leave-from" leave-to-class="mobile-menu-leave-to">
                    <div v-if="isMenuOpen" class="mobile-menu">
                        <nav class="mobile-nav">
                            <NuxtLink to="/" class="mobile-nav-link" @click="isMenuOpen = false">Trang Chủ</NuxtLink>
                            <NuxtLink to="/product" class="mobile-nav-link" @click="isMenuOpen = false">Sản Phẩm</NuxtLink>
                            <NuxtLink to="/service" class="mobile-nav-link" @click="isMenuOpen = false">Dịch Vụ</NuxtLink>
                            <NuxtLink to="/post" class="mobile-nav-link" @click="isMenuOpen = false">Tin Tức</NuxtLink>
                            <NuxtLink to="/about-us" class="mobile-nav-link" @click="isMenuOpen = false">Giới Thiệu</NuxtLink>
                            <NuxtLink to="/contact" class="mobile-nav-link" @click="isMenuOpen = false">Liên Hệ</NuxtLink>
                            <button class="cta-btn cta-mobile" @click="isMenuOpen = false">Báo Giá</button>
                        </nav>
                    </div>
                </Transition>

                <nav v-if="showBreadcrumb" class="mobile-breadcrumb" aria-label="Breadcrumb">
                    <ol class="breadcrumb-list">
                        <li class="breadcrumb-item">
                            <NuxtLink to="/" class="breadcrumb-link">
                                <Icon name="mdi:home" class="breadcrumb-icon" />
                            </NuxtLink>
                        </li>
                        <template v-for="(item, index) in breadcrumbItems" :key="index">
                            <li class="breadcrumb-separator">
                                <Icon name="mdi:chevron-right" />
                            </li>
                            <li class="breadcrumb-item">
                                <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb-link">
                                    {{ item.label }}
                                </NuxtLink>
                                <span v-else class="breadcrumb-current">{{ item.label }}</span>
                            </li>
                        </template>
                    </ol>
                </nav>
            </div>
        </header>
    </div>
</template>

<script setup>
import TopBar from './TopBar.vue'

const route = useRoute()
const isMenuOpen = ref(false)
const scrolled = ref(false)
const navVisible = ref(true)
const lastScrollY = ref(0)

const products = [
    { name: 'Camera An Ninh - AI', path: '/product/camera-ai-sht-pro', icon: 'mdi:cctv' },
    { name: 'Hạ Tầng Mạng', path: '/product/switch-poe-24-port', icon: 'mdi:lan' },
    { name: 'WiFi & Firewall', path: '/product/wifi-6-enterprise', icon: 'mdi:wifi' },
    { name: 'Tủ Rack & Hạ Tầng', path: '/product/router-load-balance', icon: 'mdi:server' },
    { name: 'Access Control', path: '/product/may-cham-cong-faceid', icon: 'mdi:fingerprint' },
    { name: 'Báo Động - Báo Cháy', path: '/product/bao-chay-dia-chi-4-loop', icon: 'mdi:alarm-light' },
    { name: 'Tổng Đài IP PBX', path: '/product', icon: 'mdi:phone-voip' },
    { name: 'Âm Thanh - Loa PA', path: '/product', icon: 'mdi:speaker' }
]

const showBreadcrumb = computed(() => {
    return route.path !== '/' && route.path !== '/home'
})

const isHeaderTransparent = computed(() => {
    const isHome = route.path === '/' || route.path === '/home'
    return isHome && !scrolled.value
})

const breadcrumbItems = computed(() => {
    const path = route.path
    const items = []

    if (path.startsWith('/product')) {
        if (path === '/product') {
            items.push({ label: 'Sản phẩm' })
        } else {
            items.push({ label: 'Sản phẩm', to: '/product' })
            const slug = path.replace('/product/', '')
            const product = products.find(p => p.path.includes(slug))
            items.push({ label: product?.name || 'Chi tiết sản phẩm' })
        }
    } else if (path.startsWith('/post')) {
        if (path === '/post') {
            items.push({ label: 'Tin tức' })
        } else {
            items.push({ label: 'Tin tức', to: '/post' })
            items.push({ label: 'Bài viết' })
        }
    } else if (path === '/about-us') {
        items.push({ label: 'Giới thiệu' })
    } else if (path === '/contact') {
        items.push({ label: 'Liên hệ' })
    } else if (path === '/service') {
        items.push({ label: 'Dịch vụ' })
    } else {
        const pageName = path.replace('/', '').replace(/-/g, ' ')
        items.push({ label: pageName.charAt(0).toUpperCase() + pageName.slice(1) })
    }

    return items
})

const handleScroll = () => {
    const currentScrollY = window.scrollY
    scrolled.value = currentScrollY > 50

    isMenuOpen.value = false

    if (currentScrollY < lastScrollY.value || currentScrollY < 100) {
        navVisible.value = true
    } else {
        navVisible.value = false
    }
    lastScrollY.value = currentScrollY
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import "../styles/header/desktop.css";
@import "../styles/header/mobile.css";
</style>
