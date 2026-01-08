<template>
    <section class="py-24 bg-secondary relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div class="container relative z-10">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <!-- Content -->
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-[2px] bg-primary"></div>
                        <span class="text-primary font-semibold uppercase tracking-wider text-sm">Watch Now</span>
                    </div>
                    <h2 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                        Our Best Working Process System
                        <span class="text-primary">with Team Expert Leaders</span>
                    </h2>

                    <!-- Video Placeholder -->
                    <div class="relative aspect-video rounded-2xl overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop" alt="Team Working" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-secondary/50 flex items-center justify-center">
                            <button class="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                <Icon name="mdi:play" class="w-10 h-10 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contact Info Cards -->
                <div class="space-y-6">
                    <div v-for="(item, index) in contactItems" :key="index" class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4 hover:bg-white/20 transition-colors">
                        <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                            <Icon :name="item.icon" class="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p class="text-gray-300 text-sm">{{ item.label }}</p>
                            <h4 class="text-xl font-bold text-white">{{ item.value }}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const contactItems = [
    {
        icon: 'mdi:phone',
        label: 'Call Us Anytime',
        value: '+123 (4567) 890'
    },
    {
        icon: 'mdi:email',
        label: 'Send E-Mail',
        value: 'info@gmail.com'
    },
    {
        icon: 'mdi:clock-outline',
        label: 'Opening Hours',
        value: 'Mon - Fri (8.00 - 5.00)'
    }
]
</script>
