<template>
    <section class="py-24 bg-gray-50">
        <div class="container">
            <!-- Section Header -->
            <div class="text-center max-w-2xl mx-auto mb-16">
                <div class="flex items-center justify-center gap-2 mb-4">
                    <div class="w-8 h-[2px] bg-primary"></div>
                    <span class="section-subtitle">Testimonial</span>
                    <div class="w-8 h-[2px] bg-primary"></div>
                </div>
                <h2 class="section-title">
                    Customer's Awesome Feedback
                    <span class="text-primary">About Our Services</span>
                </h2>
            </div>

            <!-- Testimonials Slider -->
            <div class="relative">
                <div class="overflow-hidden">
                    <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                        <div v-for="(testimonial, index) in testimonials" :key="index" class="w-full flex-shrink-0 px-4">
                            <div class="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
                                <div class="flex flex-col md:flex-row gap-6 items-center">
                                    <!-- Avatar -->
                                    <div class="flex-shrink-0">
                                        <img :src="testimonial.avatar" :alt="testimonial.name" class="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
                                    </div>

                                    <!-- Content -->
                                    <div class="flex-1 text-center md:text-left">
                                        <!-- Quote -->
                                        <p class="text-gray-600 leading-relaxed mb-4 italic">
                                            "{{ testimonial.quote }}"
                                        </p>

                                        <!-- Rating -->
                                        <div class="flex justify-center md:justify-start gap-1 mb-3">
                                            <Icon v-for="i in 5" :key="i" name="mdi:star" class="w-5 h-5 text-yellow-400" />
                                        </div>

                                        <!-- Author -->
                                        <h4 class="font-bold text-secondary">{{ testimonial.name }}</h4>
                                        <p class="text-gray-500 text-sm">{{ testimonial.role }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Dots -->
                <div class="flex justify-center gap-2 mt-8">
                    <button v-for="(_, index) in testimonials" :key="index" @click="currentSlide = index" class="w-3 h-3 rounded-full transition-colors" :class="currentSlide === index ? 'bg-primary' : 'bg-gray-300'"></button>
                </div>

                <!-- Navigation Arrows -->
                <button @click="prevSlide" class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Icon name="mdi:chevron-left" class="w-6 h-6" />
                </button>
                <button @click="nextSlide" class="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Icon name="mdi:chevron-right" class="w-6 h-6" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
const currentSlide = ref(0)

const testimonials = [
    {
        name: 'Anjelina Watson',
        role: 'Web Developer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        quote: 'Completely extend leveraged customer service rather than performance based imperatives. Magnetic relationships rather than leveraged e-markets. Rapidiously transform timely niches technology. Enthusiastically e-enable global e-markets for cooperative e-business.'
    },
    {
        name: 'John Smith',
        role: 'Business Manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        quote: 'Authoritatively deliver highly efficient expertise. Completely extend leveraged customer service rather than performance based imperatives. Magnetic relationships rather than leveraged e-markets.'
    },
    {
        name: 'Sarah Johnson',
        role: 'Product Designer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        quote: 'Rapidiously transform timely niches technology. Enthusiastically e-enable global e-markets for cooperative e-business. Authoritatively deliver highly efficient expertise.'
    }
]

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % testimonials.length
}

const prevSlide = () => {
    currentSlide.value = currentSlide.value === 0 ? testimonials.length - 1 : currentSlide.value - 1
}

// Auto slide
let interval
onMounted(() => {
    interval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
    if (interval) clearInterval(interval)
})
</script>
