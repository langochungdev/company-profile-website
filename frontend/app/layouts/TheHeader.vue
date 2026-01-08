<template>
    <header :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-black shadow-lg' : 'bg-transparent']">
        <TheTopBar />
        <div class="container">
            <div class="flex items-center justify-between py-4">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center">
                    <div class="text-2xl font-bold text-white">
                        <span class="text-primary">Top</span>tech
                    </div>
                </NuxtLink>

                <!-- Desktop Navigation -->
                <nav class="hidden lg:flex items-center gap-8">
                    <NuxtLink v-for="item in navItems" :key="item.name" :to="item.path" class="text-white hover:text-primary transition-colors font-medium">
                        {{ item.name }}
                    </NuxtLink>
                </nav>

                <!-- CTA Button -->
                <div class="hidden lg:flex items-center gap-4">
                    <a href="tel:+1234567890" class="text-white hover:text-primary transition-colors">
                        <Icon name="mdi:phone" class="w-5 h-5" />
                    </a>
                    <button class="btn-primary">
                        Get A Quote
                    </button>
                </div>

                <!-- Mobile Menu Button -->
                <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden text-white p-2">
                    <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6" />
                </button>
            </div>

            <!-- Mobile Menu -->
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                <div v-if="isMenuOpen" class="lg:hidden bg-secondary rounded-lg p-4 mb-4">
                    <nav class="flex flex-col gap-4">
                        <NuxtLink v-for="item in navItems" :key="item.name" :to="item.path" class="text-white hover:text-primary transition-colors font-medium" @click="isMenuOpen = false">
                            {{ item.name }}
                        </NuxtLink>
                        <button class="btn-primary w-full justify-center">
                            Get A Quote
                        </button>
                    </nav>
                </div>
            </Transition>
        </div>
    </header>
</template>

<script setup>
import TheTopBar from './TheTopBar.vue'

const isMenuOpen = ref(false)
const scrolled = ref(false)

const handleScroll = () => {
    scrolled.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Pages', path: '/pages' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
]
</script>
