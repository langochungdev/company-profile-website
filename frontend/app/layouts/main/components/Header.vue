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
/* Header - Desktop styles */
:root {
    --header-offset: 120px;
}

.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
}

.header {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 40;
    transition: all 0.3s;
}

.header-scrolled {
    background: #1a1a1a;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.header-transparent {
    background: rgba(26, 26, 26, 0.2);
    backdrop-filter: blur(8px);
}

.header-visible {
    top: 32px;
}

.header-hidden {
    top: -80px;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.logo-img {
    height: 4rem;
    width: auto;
}

.inline-breadcrumb {
    display: none;
    align-items: center;
}

.breadcrumb-divider {
    color: rgba(255, 255, 255, 0.3);
    font-size: 1.25rem;
    font-weight: 300;
    margin: 0 0.5rem;
}

.breadcrumb-list {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
}

.breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.8125rem;
    transition: color 0.2s ease;
}

.breadcrumb-link:hover {
    color: #38bdf8;
}

.breadcrumb-icon {
    width: 0.875rem;
    height: 0.875rem;
}

.breadcrumb-separator {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.3);
}

.breadcrumb-separator svg {
    width: 0.75rem;
    height: 0.75rem;
}

.breadcrumb-current {
    color: #38bdf8;
    font-size: 0.8125rem;
    font-weight: 500;
}

.mobile-breadcrumb {
    display: flex;
    padding: 0.5rem 0;
}

.nav-desktop {
    display: none;
    align-items: center;
    gap: 1.5rem;
}

.nav-link {
    color: #ffffff;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s;
}

.nav-link:hover {
    color: #DC2626;
}

.dropdown {
    position: relative;
}

.dropdown-trigger {
    color: #ffffff;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 0.3s;
    background: none;
    border: none;
    cursor: pointer;
}

.dropdown-trigger:hover {
    color: #DC2626;
}

.dropdown-icon {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s;
}

.dropdown-icon-open {
    transform: rotate(180deg);
}

.dropdown-enter-active {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-0.5rem);
}

.dropdown-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.dropdown-leave-active {
    transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}

.dropdown-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    width: 16rem;
    background: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 0.5rem 0;
    z-index: 50;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #1a1a1a;
    transition: all 0.3s;
    cursor: pointer;
}

.dropdown-item:hover {
    background: #f9fafb;
    color: #DC2626;
}

.dropdown-item-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #DC2626;
}

.dropdown-item-text {
    font-size: 0.875rem;
    font-weight: 500;
}

.cta-desktop {
    display: none;
    align-items: center;
    gap: 1rem;
}

.cta-btn {
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    color: #ffffff;
    padding: 0.625rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.3s;
    border: none;
    cursor: pointer;
}

.cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
}

.menu-toggle {
    display: block;
    color: #ffffff;
    padding: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
}

.menu-icon {
    width: 1.5rem;
    height: 1.5rem;
}

.mobile-menu-enter-active {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.mobile-menu-enter-from {
    opacity: 0;
    transform: translateY(-0.5rem);
}

.mobile-menu-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.mobile-menu-leave-active {
    transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}

.mobile-menu-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.mobile-menu-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem);
}

.mobile-menu {
    display: block;
    background: rgba(38, 38, 38, 0.95);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
}

.mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.mobile-nav-link {
    color: #ffffff;
    font-weight: 500;
    padding: 0.5rem 0;
    cursor: pointer;
    transition: color 0.3s;
}

.mobile-nav-link:hover {
    color: #DC2626;
}

.mobile-accordion-trigger {
    width: 100%;
    color: #ffffff;
    font-weight: 500;
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: color 0.3s;
    background: none;
    border: none;
    cursor: pointer;
}

.mobile-accordion-trigger:hover {
    color: #DC2626;
}

.mobile-accordion-icon {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s;
}

.mobile-accordion-icon-open {
    transform: rotate(180deg);
}

.mobile-accordion-content {
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.mobile-product-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #d1d5db;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    cursor: pointer;
    transition: color 0.3s;
}

.mobile-product-item:hover {
    color: #DC2626;
}

.mobile-product-icon {
    width: 1rem;
    height: 1rem;
}

.cta-mobile {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
    display: flex;
}

@media (min-width: 1024px) {
    :root {
        --header-offset: 110px;
    }

    .header-visible {
        top: 40px;
    }

    .nav-desktop {
        display: flex;
    }

    .cta-desktop {
        display: flex;
    }

    .menu-toggle {
        display: none;
    }

    .mobile-menu {
        display: none;
    }

    .mobile-breadcrumb {
        display: none;
    }

    .inline-breadcrumb {
        display: flex;
    }
}
</style>
