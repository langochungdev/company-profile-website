<!-- Chức năng: Header chính với navigation và dropdown menu sản phẩm -->
<template>
    <div>
        <TopBar class="top-bar" />
        <header :class="['header', scrolled ? 'header-scrolled' : 'header-transparent', navVisible ? 'header-visible' : 'header-hidden']">
            <div class="header-container">
                <div class="header-content">
                    <div class="logo" aria-label="Trang chủ SHT Security">
                        <img src="/images/logo.png" alt="SHT Security Logo" class="logo-img" />
                    </div>

                    <nav class="nav-desktop" aria-label="Main navigation">
                        <span class="nav-link">Trang Chủ</span>
                        <span class="nav-link">Giới Thiệu</span>

                        <div class="dropdown" ref="dropdownRef">
                            <button @click="toggleDropdown" class="dropdown-trigger" :aria-expanded="isDropdownOpen">
                                Sản Phẩm
                                <Icon name="mdi:chevron-down" class="dropdown-icon" :class="{ 'dropdown-icon-open': isDropdownOpen }" />
                            </button>
                            <Transition enter-active-class="dropdown-enter-active" enter-from-class="dropdown-enter-from" enter-to-class="dropdown-enter-to" leave-active-class="dropdown-leave-active" leave-from-class="dropdown-leave-from" leave-to-class="dropdown-leave-to">
                                <div v-if="isDropdownOpen" class="dropdown-menu">
                                    <div v-for="product in products" :key="product.path" class="dropdown-item" @click="isDropdownOpen = false">
                                        <Icon :name="product.icon" class="dropdown-item-icon" />
                                        <span class="dropdown-item-text">{{ product.name }}</span>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <span class="nav-link">Dịch Vụ</span>
                        <span class="nav-link">Bài Đăng</span>
                        <span class="nav-link">Liên Hệ</span>
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
                            <span class="mobile-nav-link" @click="isMenuOpen = false">Trang Chủ</span>
                            <span class="mobile-nav-link" @click="isMenuOpen = false">Giới Thiệu</span>

                            <div>
                                <button @click="isMobileProductsOpen = !isMobileProductsOpen" class="mobile-accordion-trigger">
                                    Sản Phẩm
                                    <Icon name="mdi:chevron-down" class="mobile-accordion-icon" :class="{ 'mobile-accordion-icon-open': isMobileProductsOpen }" />
                                </button>
                                <div v-if="isMobileProductsOpen" class="mobile-accordion-content">
                                    <div v-for="product in products" :key="product.path" class="mobile-product-item" @click="isMenuOpen = false">
                                        <Icon :name="product.icon" class="mobile-product-icon" />
                                        {{ product.name }}
                                    </div>
                                </div>
                            </div>

                            <span class="mobile-nav-link" @click="isMenuOpen = false">Dịch Vụ</span>
                            <span class="mobile-nav-link" @click="isMenuOpen = false">Bài Đăng</span>
                            <span class="mobile-nav-link" @click="isMenuOpen = false">Liên Hệ</span>
                            <button class="cta-btn cta-mobile" @click="isMenuOpen = false">Báo Giá</button>
                        </nav>
                    </div>
                </Transition>
            </div>
        </header>
    </div>
</template>

<script setup>
import TopBar from './TopBar.vue'

const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const isMobileProductsOpen = ref(false)
const scrolled = ref(false)
const navVisible = ref(true)
const lastScrollY = ref(0)
const dropdownRef = ref(null)

const products = [
    { name: 'Camera An Ninh - AI', path: '/san-pham/camera-an-ninh', icon: 'mdi:cctv' },
    { name: 'Hạ Tầng Mạng', path: '/san-pham/ha-tang-mang', icon: 'mdi:lan' },
    { name: 'WiFi & Firewall', path: '/san-pham/wifi-firewall', icon: 'mdi:wifi' },
    { name: 'Tủ Rack & Hạ Tầng', path: '/san-pham/tu-rack', icon: 'mdi:server' },
    { name: 'Access Control', path: '/san-pham/access-control', icon: 'mdi:fingerprint' },
    { name: 'Báo Động - Báo Cháy', path: '/san-pham/bao-dong-bao-chay', icon: 'mdi:alarm-light' },
    { name: 'Tổng Đài IP PBX', path: '/san-pham/tong-dai-ip', icon: 'mdi:phone-voip' },
    { name: 'Âm Thanh - Loa PA', path: '/san-pham/am-thanh-loa', icon: 'mdi:speaker' }
]

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false
    }
}

const handleScroll = () => {
    const currentScrollY = window.scrollY
    scrolled.value = currentScrollY > 50

    isDropdownOpen.value = false
    isMenuOpen.value = false
    isMobileProductsOpen.value = false

    if (currentScrollY < lastScrollY.value || currentScrollY < 100) {
        navVisible.value = true
    } else {
        navVisible.value = false
    }
    lastScrollY.value = currentScrollY
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import "../styles/header/desktop.css";
@import "../styles/header/mobile.css";
</style>
