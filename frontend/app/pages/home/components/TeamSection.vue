<template>
    <section class="py-24 bg-gray-50">
        <div class="container">
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-[2px] bg-primary"></div>
                        <span class="section-subtitle">Dedicated Team</span>
                    </div>
                    <h2 class="section-title">
                        Meet Our Dedicated Member
                        <br /><span class="text-primary">For Any Enquery</span>
                    </h2>
                </div>
                <NuxtLink to="/team" class="btn-primary">
                    All Member
                    <Icon name="mdi:arrow-right" class="w-5 h-5" />
                </NuxtLink>
            </div>

            <!-- Team Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="(member, index) in teamMembers" :key="index" class="group">
                    <div class="relative overflow-hidden rounded-2xl bg-white shadow-lg">
                        <!-- Image -->
                        <div class="relative aspect-[3/4] overflow-hidden">
                            <img :src="member.image" :alt="member.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <!-- Overlay -->
                            <div class="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <!-- Social Icons -->
                            <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <div class="flex justify-center gap-2">
                                    <a v-for="social in socials" :key="social.name" :href="social.url" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-colors">
                                        <Icon :name="social.icon" class="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="p-5 text-center">
                            <h3 class="text-lg font-bold text-secondary group-hover:text-primary transition-colors">
                                {{ member.name }}
                            </h3>
                            <p class="text-gray-600 text-sm">{{ member.role }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const teamMembers = [
    {
        name: 'Connie Diaz',
        role: 'CEO & Founder',
        image: 'https://toptechh.netlify.app/images/team-1.png'
    },
    {
        name: 'James E. Huey',
        role: 'Co Founder',
        image: 'https://toptechh.netlify.app/images/team-2.png'
    },
    {
        name: 'Jone D. Alexon',
        role: 'IT Expert',
        image: 'https://toptechh.netlify.app/images/team-3.png'
    },
    {
        name: 'June D. Vargas',
        role: 'HR. Manager',
        image: 'https://toptechh.netlify.app/images/team-4.png'
    }
]

const socials = [
    { name: 'Facebook', icon: 'mdi:facebook', url: '#' },
    { name: 'Twitter', icon: 'mdi:twitter', url: '#' },
    { name: 'LinkedIn', icon: 'mdi:linkedin', url: '#' },
    { name: 'Instagram', icon: 'mdi:instagram', url: '#' }
]
</script>
