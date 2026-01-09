<template>
    <div>
        <TheTopBar class="fixed top-0 left-0 right-0 z-50" />
        <header :class="['fixed left-0 right-0 z-40 transition-all duration-300', scrolled ? 'bg-secondary shadow-lg' : 'bg-secondary/20 backdrop-blur-sm', navVisible ? 'top-[25px] lg:top-[36px]' : '-top-[80px]']">
            <div class="container">
                <div class="flex items-center justify-between py-2.5">
                    <!-- Logo -->
                    <div class="flex items-center cursor-pointer" aria-label="Trang chủ SHT Security">
                        <img src="./img/logo.png" alt="SHT Security Logo" class="h-16 w-auto" />
                    </div>

                    <!-- Desktop Navigation -->
                    <nav class="hidden lg:flex items-center gap-6" aria-label="Main navigation">
                        <span class="text-white hover:text-primary transition-colors font-medium cursor-pointer">
                            Trang Chủ
                        </span>
                        <span class="text-white hover:text-primary transition-colors font-medium cursor-pointer">
                            Giới Thiệu
                        </span>

                        <!-- Products Dropdown -->
                        <div class="relative" ref="dropdownRef">
                            <button @click="toggleDropdown" class="text-white hover:text-primary transition-colors font-medium flex items-center gap-1" :aria-expanded="isDropdownOpen">
                                Sản Phẩm
                                <Icon name="mdi:chevron-down" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isDropdownOpen }" />
                            </button>
                            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                                <div v-if="isDropdownOpen" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50">
                                    <div v-for="product in products" :key="product.path" class="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer" @click="isDropdownOpen = false">
                                        <Icon :name="product.icon" class="w-5 h-5 text-primary" />
                                        <span class="text-sm font-medium">{{ product.name }}</span>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <span class="text-white hover:text-primary transition-colors font-medium cursor-pointer">
                            Dịch Vụ
                        </span>
                        <span class="text-white hover:text-primary transition-colors font-medium cursor-pointer">
                            Bài Đăng
                        </span>
                        <span class="text-white hover:text-primary transition-colors font-medium cursor-pointer">
                            Liên Hệ
                        </span>
                    </nav>

                    <!-- CTA Button -->
                    <div class="hidden lg:flex items-center gap-4">
                        <button class="btn-primary">
                            Báo Giá
                        </button>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden text-white p-2" aria-label="Menu">
                        <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6" />
                    </button>
                </div>

                <!-- Mobile Menu -->
                <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                    <div v-if="isMenuOpen" class="lg:hidden bg-secondary-light rounded-lg p-4 mb-4">
                        <nav class="flex flex-col gap-2">
                            <span class="text-white hover:text-primary transition-colors font-medium py-2 cursor-pointer" @click="isMenuOpen = false">
                                Trang Chủ
                            </span>
                            <span class="text-white hover:text-primary transition-colors font-medium py-2 cursor-pointer" @click="isMenuOpen = false">
                                Giới Thiệu
                            </span>

                            <!-- Mobile Products Accordion -->
                            <div>
                                <button @click="isMobileProductsOpen = !isMobileProductsOpen" class="w-full text-white hover:text-primary transition-colors font-medium py-2 flex items-center justify-between">
                                    Sản Phẩm
                                    <Icon name="mdi:chevron-down" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isMobileProductsOpen }" />
                                </button>
                                <div v-if="isMobileProductsOpen" class="pl-4 space-y-1">
                                    <div v-for="product in products" :key="product.path" class="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors py-2 text-sm cursor-pointer" @click="isMenuOpen = false">
                                        <Icon :name="product.icon" class="w-4 h-4" />
                                        {{ product.name }}
                                    </div>
                                </div>
                            </div>

                            <span class="text-white hover:text-primary transition-colors font-medium py-2 cursor-pointer" @click="isMenuOpen = false">
                                Dịch Vụ
                            </span>
                            <span class="text-white hover:text-primary transition-colors font-medium py-2 cursor-pointer" @click="isMenuOpen = false">
                                Bài Đăng
                            </span>
                            <span class="text-white hover:text-primary transition-colors font-medium py-2 cursor-pointer" @click="isMenuOpen = false">
                                Liên Hệ
                            </span>
                            <button class="btn-primary w-full justify-center mt-2" @click="isMenuOpen = false">
                                Báo Giá
                            </button>
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
