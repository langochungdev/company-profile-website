<template>
    <section class="py-24 bg-white">
        <div class="container">
            <div class="grid lg:grid-cols-2 gap-12 items-start">
                <!-- FAQ Section -->
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-[2px] bg-primary"></div>
                        <span class="section-subtitle">Pricing Plans</span>
                    </div>
                    <h2 class="section-title mb-8">
                        Our Best Affordable Pricing Plan
                        <span class="text-primary">Choose Your Plans</span>
                    </h2>

                    <!-- FAQ Items -->
                    <div class="space-y-4">
                        <div v-for="(faq, index) in faqs" :key="index" class="border border-gray-200 rounded-xl overflow-hidden">
                            <button @click="toggleFaq(index)" class="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors">
                                <span class="font-semibold text-secondary">{{ faq.question }}</span>
                                <Icon :name="activeFaq === index ? 'mdi:minus' : 'mdi:plus'" class="w-5 h-5 text-primary flex-shrink-0" />
                            </button>
                            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                                <div v-if="activeFaq === index" class="px-5 pb-5">
                                    <p class="text-gray-600">{{ faq.answer }}</p>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>

                <!-- Pricing Cards -->
                <div class="grid sm:grid-cols-2 gap-6">
                    <div v-for="(plan, index) in pricingPlans" :key="index" class="relative bg-white rounded-2xl shadow-xl p-8 border-2 transition-all hover:border-primary" :class="plan.popular ? 'border-primary' : 'border-transparent'">
                        <!-- Popular Badge -->
                        <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Popular
                        </div>

                        <div class="text-center mb-6">
                            <span class="text-gray-500 text-sm font-medium">{{ plan.type }}</span>
                            <div class="flex items-start justify-center gap-1 mt-2">
                                <span class="text-2xl font-bold text-secondary">$</span>
                                <span class="text-5xl font-bold text-secondary">{{ plan.price }}</span>
                                <span class="text-xl font-bold text-secondary">.99</span>
                            </div>
                            <p class="text-gray-500 text-sm mt-1">{{ plan.duration }}</p>
                        </div>

                        <div class="flex items-center gap-3 bg-primary/10 rounded-lg p-4 mb-6">
                            <Icon name="mdi:check-circle" class="w-6 h-6 text-primary" />
                            <div>
                                <h4 class="font-bold text-secondary">{{ plan.trial }}</h4>
                                <p class="text-gray-500 text-sm">{{ plan.description }}</p>
                            </div>
                        </div>

                        <button class="btn-primary w-full justify-center">
                            Purchase
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const activeFaq = ref(0)

const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? -1 : index
}

const faqs = [
    {
        question: 'How to increase products sales 2024?',
        answer: 'Credibly conceptualize multifunctional human capital after that awesome revenue superior scenarios. Collaboratively myocardinate flexible social marketing working technologies and robust services available'
    },
    {
        question: 'What kinds of web traffics?',
        answer: 'Credibly conceptualize multifunctional human capital after that awesome revenue superior scenarios. Collaboratively myocardinate flexible social marketing working technologies and robust services available'
    },
    {
        question: 'How to generate organic audience?',
        answer: 'Credibly conceptualize multifunctional human capital after that awesome revenue superior scenarios. Collaboratively myocardinate flexible social marketing working technologies and robust services available'
    },
    {
        question: 'Do you have any custom services?',
        answer: 'Credibly conceptualize multifunctional human capital after that awesome revenue superior scenarios. Collaboratively myocardinate flexible social marketing working technologies and robust services available'
    }
]

const pricingPlans = [
    {
        type: 'Business',
        price: '19',
        duration: 'FOR 1 MONTH',
        trial: '09 Days For Free',
        description: 'Multifunctional human capital after awesome superior scenarios my coordinate',
        popular: false
    },
    {
        type: 'Popular',
        price: '99',
        duration: 'FOR 1 YEAR',
        trial: '19 Days For Free',
        description: 'Multifunctional human capital after awesome superior scenarios my coordinate',
        popular: true
    }
]
</script>
