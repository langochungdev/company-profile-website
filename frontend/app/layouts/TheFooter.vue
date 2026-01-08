<template>
    <footer class="bg-secondary pt-20 pb-8">
        <div class="container">
            <!-- Main Footer Content -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
                <!-- Logo & Description -->
                <div class="lg:col-span-1">
                    <NuxtLink to="/" class="inline-block mb-6">
                        <div class="text-3xl font-bold text-white">
                            <span class="text-primary">Top</span>tech
                        </div>
                    </NuxtLink>
                    <p class="text-gray-400 leading-relaxed mb-6">
                        Monotonectally synergize granular top visualize strategic infomediaries afters task state of the art infrastructures digital agency in north
                    </p>
                    <NuxtLink to="/about" class="btn-primary">
                        Discover More
                    </NuxtLink>
                </div>

                <!-- Company Links -->
                <div>
                    <h4 class="text-white font-bold text-xl mb-6">Company</h4>
                    <ul class="space-y-3">
                        <li v-for="link in companyLinks" :key="link.name">
                            <NuxtLink :to="link.path" class="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                                <Icon name="mdi:chevron-right" class="w-4 h-4" />
                                {{ link.name }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Services Links -->
                <div>
                    <h4 class="text-white font-bold text-xl mb-6">Our Services</h4>
                    <ul class="space-y-3">
                        <li v-for="link in serviceLinks" :key="link.name">
                            <NuxtLink :to="link.path" class="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                                <Icon name="mdi:chevron-right" class="w-4 h-4" />
                                {{ link.name }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div>
                    <h4 class="text-white font-bold text-xl mb-6">Newsletter</h4>
                    <p class="text-gray-400 mb-4">Subscribe Our Latest Newsletter</p>
                    <form @submit.prevent="subscribe" class="space-y-3">
                        <div class="relative">
                            <input v-model="email" type="email" placeholder="Enter your email" class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary" />
                        </div>
                        <button type="submit" class="btn-primary w-full justify-center">
                            Subscribe
                            <Icon name="mdi:send" class="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>

            <!-- Bottom Footer -->
            <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-gray-400 text-sm">
                    © 2024 Toptech. Designed By Dream IT Solution
                </p>

                <!-- Social Icons -->
                <div class="flex items-center gap-3">
                    <a v-for="social in socials" :key="social.name" :href="social.url" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors">
                        <Icon :name="social.icon" class="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
const email = ref('')

const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/team' },
    { name: 'Pricing Plan', path: '/pricing' },
    { name: 'Latest Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' }
]

const serviceLinks = [
    { name: 'IT Solutions', path: '/services' },
    { name: 'Cyber Security', path: '/services' },
    { name: 'Digital Marketing', path: '/services' },
    { name: 'Brand Identity', path: '/services' },
    { name: 'SEO Marketing', path: '/services' }
]

const socials = [
    { name: 'Facebook', icon: 'mdi:facebook', url: '#' },
    { name: 'Twitter', icon: 'mdi:twitter', url: '#' },
    { name: 'LinkedIn', icon: 'mdi:linkedin', url: '#' },
    { name: 'Instagram', icon: 'mdi:instagram', url: '#' }
]

const subscribe = () => {
    // Handle subscription
    console.log('Subscribe:', email.value)
    email.value = ''
}
</script>
