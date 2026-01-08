<template>
    <section class="relative bg-secondary min-h-screen flex items-center overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div class="container relative z-10 pt-24">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <!-- Content -->
                <div class="space-y-6">
                    <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                        <Icon name="mdi:star" class="w-4 h-4 text-accent" />
                        <span class="text-white text-sm font-medium">IT SOLUTION AGENCY IN USA</span>
                    </div>

                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        BUSINESS INNOVATION
                        <span class="text-primary">WITH IT EXPERT</span>
                    </h1>

                    <p class="text-gray-300 text-lg max-w-xl">
                        Professionally optimize interdependent intellectual interoperable connect best practices.
                        Progressively fabricate done
                    </p>

                    <div class="flex flex-wrap gap-4 pt-4">
                        <NuxtLink to="/contact" class="btn-primary">
                            Let's Talk
                            <Icon name="mdi:arrow-right" class="w-5 h-5" />
                        </NuxtLink>
                        <NuxtLink to="/about" class="btn-outline">
                            Read More
                        </NuxtLink>
                    </div>
                </div>

                <!-- Hero Image -->
                <div class="relative">
                    <div class="relative z-10">
                        <img src="https://toptechh.netlify.app/images/hero-thumb.png" alt="IT Expert" class="w-full max-w-lg mx-auto" />
                    </div>
                    <!-- Decorative Shape -->
                    <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <Icon name="mdi:chevron-down" class="w-8 h-8 text-white/50" />
        </div>
    </section>
</template>
