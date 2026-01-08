<template>
    <section class="py-24 bg-gray-50">
        <div class="container">
            <!-- Section Header -->
            <div class="text-center max-w-2xl mx-auto mb-16">
                <div class="flex items-center justify-center gap-2 mb-4">
                    <div class="w-8 h-[2px] bg-primary"></div>
                    <span class="section-subtitle">Latest Blog</span>
                    <div class="w-8 h-[2px] bg-primary"></div>
                </div>
                <h2 class="section-title">
                    Latest Insights From
                    <span class="text-primary">Our Blog</span>
                </h2>
            </div>

            <!-- Blog Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="(post, index) in blogPosts" :key="index" class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <!-- Image -->
                    <div class="relative h-52 overflow-hidden">
                        <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {{ post.category }}
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6">
                        <!-- Meta -->
                        <div class="flex items-center gap-4 text-gray-500 text-sm mb-4">
                            <span class="flex items-center gap-1">
                                <Icon name="mdi:calendar" class="w-4 h-4" />
                                {{ post.date }}
                            </span>
                            <span class="flex items-center gap-1">
                                <Icon name="mdi:account" class="w-4 h-4" />
                                {{ post.author }}
                            </span>
                        </div>

                        <!-- Title -->
                        <h3 class="text-lg font-bold text-secondary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {{ post.title }}
                        </h3>

                        <!-- Read More -->
                        <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                            Read More
                            <Icon name="mdi:arrow-right" class="w-4 h-4" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const blogPosts = [
    {
        title: 'Most Popular Chrome Extension for Business Promot',
        image: 'https://toptechh.netlify.app/images/blog1.png',
        date: '24 Mar, 2024',
        author: 'Admin',
        category: 'Tech'
    },
    {
        title: 'How to Secure your Facebook Business Account',
        image: 'https://toptechh.netlify.app/images/blog2.png',
        date: '24 Mar, 2024',
        author: 'Admin',
        category: 'Security'
    },
    {
        title: 'Better Context Menus With Safe Triangles',
        image: 'https://toptechh.netlify.app/images/blog3.png',
        date: '24 Mar, 2024',
        author: 'Admin',
        category: 'Design'
    }
]
</script>
