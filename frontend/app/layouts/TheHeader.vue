<!-- Chức năng: Header chính với navigation và dropdown menu sản phẩm -->
<template>
    <div>
        <TheTopBar class="top-bar" />
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
import TheTopBar from './TheTopBar.vue'

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
    top: 25px;
}

@media (min-width: 1024px) {
    .header-visible {
        top: 36px;
    }
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

.logo {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.logo-img {
    height: 4rem;
    width: auto;
}

.nav-desktop {
    display: none;
    align-items: center;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .nav-desktop {
        display: flex;
    }
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

@media (min-width: 1024px) {
    .cta-desktop {
        display: flex;
    }
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

.cta-mobile {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
    display: flex;
}

.menu-toggle {
    display: block;
    color: #ffffff;
    padding: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
}

@media (min-width: 1024px) {
    .menu-toggle {
        display: none;
    }
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

@media (min-width: 1024px) {
    .mobile-menu {
        display: none;
    }
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
</style>

<style scoped>
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
    top: 25px;
}

@media (min-width: 1024px) {
    .header-visible {
        top: 36px;
    }
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

.logo {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.logo-img {
    height: 4rem;
    width: auto;
}

.nav-desktop {
    display: none;
    align-items: center;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .nav-desktop {
        display: flex;
    }
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

@media (min-width: 1024px) {
    .cta-desktop {
        display: flex;
    }
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

.cta-mobile {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
}

.menu-toggle {
    display: block;
    color: #ffffff;
    padding: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
}

@media (min-width: 1024px) {
    .menu-toggle {
        display: none;
    }
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

@media (min-width: 1024px) {
    .mobile-menu {
        display: none;
    }
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
</style>
