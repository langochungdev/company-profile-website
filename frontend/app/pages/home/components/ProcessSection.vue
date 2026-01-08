<template>
    <section class="py-24 bg-white">
        <div class="container">
            <!-- Section Header -->
            <div class="text-center max-w-2xl mx-auto mb-16">
                <div class="flex items-center justify-center gap-2 mb-4">
                    <div class="w-8 h-[2px] bg-primary"></div>
                    <span class="section-subtitle">Working Process</span>
                    <div class="w-8 h-[2px] bg-primary"></div>
                </div>
                <h2 class="section-title">
                    We Follow the Easy
                    <span class="text-primary">Working Steps</span>
                </h2>
            </div>

            <!-- Process Steps -->
            <div class="grid md:grid-cols-3 gap-8 relative">
                <!-- Connection Line -->
                <div class="hidden md:block absolute top-24 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-primary via-accent to-primary"></div>

                <div v-for="(step, index) in steps" :key="index" class="relative text-center group">
                    <!-- Icon -->
                    <div class="relative inline-block mb-6">
                        <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary transition-colors duration-300">
                            <img :src="step.image" :alt="step.title" class="w-20 h-20 object-contain" />
                        </div>
                        <!-- Step Number -->
                        <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:bg-secondary transition-colors">
                            {{ String(index + 1).padStart(2, '0') }}
                        </div>
                    </div>

                    <!-- Content -->
                    <h3 class="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                        {{ step.title }}
                    </h3>
                    <p class="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                        {{ step.description }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const steps = [
    {
        title: 'Start A Project',
        description: 'Proactively drive maintainable value next mission-critical infrastructures done the new business to planning',
        image: 'https://toptechh.netlify.app/images/process-1.png'
    },
    {
        title: 'Project Analysis',
        description: 'Proactively drive maintainable value next mission-critical infrastructures done the new business to planning',
        image: 'https://toptechh.netlify.app/images/process-2.png'
    },
    {
        title: 'Deliver to Success',
        description: 'Proactively drive maintainable value next mission-critical infrastructures done the new business to planning',
        image: 'https://toptechh.netlify.app/images/process-3.png'
    }
]
</script>
