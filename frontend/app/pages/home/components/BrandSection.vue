<template>
    <section class="py-16 bg-white border-t border-gray-100">
        <div class="container">
            <div class="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity">
                <img v-for="(brand, index) in brands" :key="index" :src="brand" :alt="`Brand ${index + 1}`" class="h-12 object-contain grayscale hover:grayscale-0 transition-all" />
            </div>
        </div>
    </section>
</template>

<script setup>
const brands = [
    'https://toptechh.netlify.app/images/brand-1.png',
    'https://toptechh.netlify.app/images/brand-2.png',
    'https://toptechh.netlify.app/images/brand-3.png',
    'https://toptechh.netlify.app/images/brand-4.png',
    'https://toptechh.netlify.app/images/brand-5.png'
]
</script>
