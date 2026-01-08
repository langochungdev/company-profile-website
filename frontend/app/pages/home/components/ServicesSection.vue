<template>
    <section class="py-24 bg-white">
        <div class="container">
            <!-- Section Header -->
            <div class="text-center max-w-2xl mx-auto mb-16">
                <div class="flex items-center justify-center gap-2 mb-4">
                    <div class="w-8 h-[2px] bg-primary"></div>
                    <span class="section-subtitle">Dedicated Team</span>
                    <div class="w-8 h-[2px] bg-primary"></div>
                </div>
                <h2 class="section-title">
                    Ensuring Your Success Trusted
                    <span class="text-primary">IT Services</span> Source
                </h2>
            </div>

            <!-- Services Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(service, index) in services" :key="index" class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <!-- Service Number -->
                    <div class="absolute top-4 left-4 z-10">
                        <span class="text-5xl font-bold text-white/20 group-hover:text-primary/30 transition-colors">
                            {{ String(index + 1).padStart(2, '0') }}
                        </span>
                    </div>

                    <!-- Image -->
                    <div class="relative h-48 overflow-hidden">
                        <img :src="service.image" :alt="service.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                    </div>

                    <!-- Content -->
                    <div class="p-6 relative -mt-8">
                        <div class="bg-white rounded-xl p-6 shadow-lg">
                            <h3 class="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                                {{ service.title }}
                            </h3>
                            <p class="text-gray-600 text-sm mb-4">{{ service.description }}</p>
                            <NuxtLink to="/services" class="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                                Read More
                                <Icon name="mdi:arrow-right" class="w-4 h-4" />
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const services = [
    {
        title: 'Graphic Design',
        description: 'Monotonectally synergize grants to business visualize strategic infomediaries',
        image: 'https://toptechh.netlify.app/images/service-1.png'
    },
    {
        title: 'Cloud Solutions',
        description: 'Monotonectally synergize grants to business visualize strategic infomediaries',
        image: 'https://toptechh.netlify.app/images/service-2.png'
    },
    {
        title: 'WP Development',
        description: 'Monotonectally synergize grants to business visualize strategic infomediaries',
        image: 'https://toptechh.netlify.app/images/service-3.png'
    },
    {
        title: 'Digital Marketing',
        description: 'Monotonectally synergize grants to business visualize strategic infomediaries',
        image: 'https://toptechh.netlify.app/images/service-4.png'
    },
    {
        title: '3D Vector Illustration',
        description: 'Monotonectally synergize grants to business visualize strategic infomediaries',
        image: 'https://toptechh.netlify.app/images/service-5.png'
    },
    {
        title: 'Hosting Services',
        description: 'Monotonectally synergize grants to business visualize strategic infomediaries',
        image: 'https://toptechh.netlify.app/images/service-6.png'
    }
]
</script>
