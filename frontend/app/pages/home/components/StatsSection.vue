<template>
    <section class="py-16 bg-primary">
        <div class="container">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div v-for="(stat, index) in stats" :key="index" class="text-center">
                    <div class="text-5xl md:text-6xl font-bold text-white mb-2">
                        {{ stat.value }}<span class="text-accent">{{ stat.suffix }}</span>
                    </div>
                    <p class="text-white/80 font-medium uppercase tracking-wider text-sm">
                        {{ stat.label }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const stats = [
    { value: '10', suffix: 'K+', label: 'Happy Customers' },
    { value: '20', suffix: 'K+', label: 'Works Completed' },
    { value: '99', suffix: '', label: 'Expert Members' },
    { value: '100', suffix: '%', label: 'Satisfaction Rates' }
]
</script>
