<template>
    <section class="py-20 bg-white -mt-20 relative z-20">
        <div class="container">
            <div class="grid md:grid-cols-3 gap-6">
                <div v-for="(feature, index) in features" :key="index" class="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:-translate-y-2">
                    <div class="flex items-start gap-4">
                        <div class="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                            <Icon :name="feature.icon" class="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-secondary mb-2">{{ feature.title }}</h3>
                            <p class="text-gray-600 text-sm leading-relaxed">{{ feature.description }}</p>
                            <NuxtLink to="/services" class="inline-flex items-center gap-2 text-primary font-semibold mt-4 group-hover:gap-3 transition-all">
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
const features = [
    {
        icon: 'mdi:clock-outline',
        title: '22+ Year Experience',
        description: 'Monotonically synergize grants to business visualize strategic infomediaries'
    },
    {
        icon: 'mdi:account-group',
        title: 'Dedicated Members',
        description: 'Monotonically synergize grants to business visualize strategic infomediaries'
    },
    {
        icon: 'mdi:headset',
        title: 'Valuable Supports',
        description: 'Monotonically synergize grants to business visualize strategic infomediaries'
    }
]
</script>
