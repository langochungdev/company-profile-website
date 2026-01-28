<!-- Chức năng: Header chính với navigation và dropdown menu -->
<template>
    <div :class="{ 'edit-mode': editMode }">
        <TopBar v-if="!editMode" class="top-bar" :data="data?.topBar" :edit-mode="editMode" />
        <header :class="['header', isHeaderTransparent ? 'header-transparent' : 'header-scrolled', navVisible ? 'header-visible' : 'header-hidden']">
            <div class="header-container">
                <div class="header-content">
                    <div class="header-left">
                        <NuxtLink to="/" class="logo" aria-label="Trang chủ SHT Security">
                            <img :src="displayLogo" alt="SHT Security Logo" class="logo-img" data-field="logoUrl" data-field-type="image" />
                        </NuxtLink>
                    </div>

                    <nav class="nav-desktop" aria-label="Main navigation">
                        <NuxtLink v-for="(item, index) in displayNavigation" :key="item.path" :to="item.path" :class="['nav-link', isActive(item.path) && 'nav-link-active']" :data-field="`navigation.${index}.label`">{{ item.label }}</NuxtLink>
                    </nav>

                    <div class="cta-desktop">
                        <button class="cta-btn" data-field="ctaText">{{ displayCtaText }}</button>
                    </div>

                    <button @click="isMenuOpen = !isMenuOpen" class="menu-toggle" aria-label="Menu">
                        <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="menu-icon" />
                    </button>
                </div>

                <Transition enter-active-class="mobile-menu-enter-active" enter-from-class="mobile-menu-enter-from" enter-to-class="mobile-menu-enter-to" leave-active-class="mobile-menu-leave-active" leave-from-class="mobile-menu-leave-from" leave-to-class="mobile-menu-leave-to">
                    <div v-if="isMenuOpen" class="mobile-menu">
                        <nav class="mobile-nav">
                            <NuxtLink v-for="(item, index) in displayNavigation" :key="item.path" :to="item.path" :class="['mobile-nav-link', isActive(item.path) && 'mobile-nav-link-active']" @click="isMenuOpen = false" :data-field="`navigation.${index}.label`">{{ item.label }}</NuxtLink>
                            <button class="cta-btn cta-mobile" @click="isMenuOpen = false">{{ displayCtaText }}</button>
                        </nav>
                    </div>
                </Transition>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import TopBar from './TopBar.vue'

interface NavItem {
    label: string
    path: string
}

interface TopBarData {
    address?: string
    email?: string
    phone?: string
}

interface HeaderData {
    logoUrl?: string
    ctaText?: string
    navigation?: NavItem[]
    topBar?: TopBarData
}

const props = defineProps<{
    data?: HeaderData | null
    editMode?: boolean
}>()

const defaultNavigation: NavItem[] = [
    { label: 'Trang Chủ', path: '/' },
    { label: 'Sản Phẩm', path: '/product' },
    { label: 'Dịch Vụ', path: '/service' },
    { label: 'Tin Tức', path: '/post' },
    { label: 'Giới Thiệu', path: '/about-us' },
    { label: 'Liên Hệ', path: '/contact' }
]

const displayNavigation = computed(() => {
    const edited = props.data?.navigation
    if (!edited || edited.length === 0) return defaultNavigation
    return defaultNavigation.map((base, index) => ({ ...base, ...(edited[index] || {}) }))
})

const displayLogo = computed(() => props.data?.logoUrl || '/images/logo.png')
const displayCtaText = computed(() => props.data?.ctaText || 'Báo Giá')

const route = useRoute()
const isMenuOpen = ref(false)
const scrolled = ref(false)
const navVisible = ref(true)
const lastScrollY = ref(0)

const isHeaderTransparent = computed(() => {
    const isHome = route.path === '/' || route.path === '/home'
    return isHome && !scrolled.value
})

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/' || route.path === '/home'
    }
    return route.path.startsWith(path)
}

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
:root {
    --header-offset: 120px;
}

.edit-mode .top-bar {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    z-index: auto !important;
}

.edit-mode .header {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
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

.nav-link-active {
    color: #DC2626;
    position: relative;
}

.nav-link-active::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    right: 0;
    height: 2px;
    background: #DC2626;
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


    .mobile-nav-link-active {
        color: #DC2626;
        font-weight: 600;
    }

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
}
</style>
