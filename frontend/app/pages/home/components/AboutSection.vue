<template>
    <section class="py-24 bg-gray-50">
        <div class="container">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <!-- Image Side -->
                <div class="relative">
                    <div class="relative z-10">
                        <img src="https://toptechh.netlify.app/images/about-thumb.png" alt="About Us" class="rounded-2xl w-full" />
                        <!-- Experience Badge -->
                        <div class="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-xl">
                            <span class="text-5xl font-bold">22+</span>
                            <p class="text-sm font-medium mt-1">Years Of<br />Experiences</p>
                        </div>
                    </div>
                    <!-- Decorative Shape -->
                    <div class="absolute -top-6 -left-6 w-full h-full border-2 border-primary rounded-2xl"></div>
                </div>

                <!-- Content Side -->
                <div class="space-y-6">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-[2px] bg-primary"></div>
                        <span class="section-subtitle">IT Support For Business</span>
                    </div>

                    <h2 class="section-title">
                        Ensuring Your Success Trusted
                        <span class="text-primary">IT Services</span> Source
                    </h2>

                    <p class="text-gray-600 leading-relaxed">
                        Monotonectally synergize granular markets and front markets. Collaboratively
                        visualize strategic infomediaries after multimedia based models. Synergistically
                        task state of the art infrastructures for
                    </p>

                    <!-- Feature Grid -->
                    <div class="grid grid-cols-2 gap-4 pt-4">
                        <div v-for="(item, index) in aboutFeatures" :key="index" class="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
                            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon :name="item.icon" class="w-6 h-6 text-primary" />
                            </div>
                            <span class="text-sm font-semibold text-secondary">{{ item.text }}</span>
                        </div>
                    </div>

                    <NuxtLink to="/about" class="btn-secondary mt-6">
                        Discover More
                        <Icon name="mdi:arrow-right" class="w-5 h-5" />
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const aboutFeatures = [
    { icon: 'mdi:currency-usd', text: '100% Money Back Gaurentee' },
    { icon: 'mdi:account-group', text: 'Expert & Dedicated Team Members' },
    { icon: 'mdi:headset', text: '24/7 Free Technical Supports' },
    { icon: 'mdi:thumb-up', text: '100% Customers Satisfaction' }
]
</script>
