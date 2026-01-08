<template>
    <section class="py-24 bg-secondary overflow-hidden">
        <div class="container">
            <!-- Section Header -->
            <div class="text-center max-w-2xl mx-auto mb-16">
                <div class="flex items-center justify-center gap-2 mb-4">
                    <div class="w-8 h-[2px] bg-primary"></div>
                    <span class="text-primary font-semibold uppercase tracking-wider text-sm">IT Support For Business</span>
                    <div class="w-8 h-[2px] bg-primary"></div>
                </div>
                <h2 class="text-4xl md:text-5xl font-bold text-white leading-tight">
                    Ensuring Your Success Trusted
                    <span class="text-primary">IT Services</span> Source
                </h2>
            </div>

            <!-- Portfolio Slider -->
            <div class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
                <div v-for="(project, index) in projects" :key="index" class="group relative flex-shrink-0 w-80 md:w-96 snap-center">
                    <div class="relative rounded-2xl overflow-hidden">
                        <img :src="project.image" :alt="project.title" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                        <!-- Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div class="absolute bottom-0 left-0 right-0 p-6">
                                <span class="text-5xl font-bold text-white/20">{{ String(index + 1).padStart(2, '0') }}</span>
                                <h3 class="text-xl font-bold text-white mt-2">{{ project.title }}</h3>
                                <NuxtLink to="/projects" class="inline-flex items-center gap-2 text-primary font-semibold mt-2 hover:gap-3 transition-all">
                                    View Project
                                    <Icon name="mdi:arrow-right" class="w-4 h-4" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const projects = [
    {
        title: 'Business Growth with Toptech Agency',
        image: 'https://toptechh.netlify.app/images/portfolio-1.png'
    },
    {
        title: 'Business Growth with Toptech Agency',
        image: 'https://toptechh.netlify.app/images/portfolio-2.png'
    },
    {
        title: 'Business Growth with Toptech Agency',
        image: 'https://toptechh.netlify.app/images/portfolio-3.png'
    },
    {
        title: 'Business Growth with Toptech Agency',
        image: 'https://toptechh.netlify.app/images/portfolio-1.png'
    }
]
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
