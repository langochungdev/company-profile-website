<template>
    <NuxtLayout name="main">
        <!-- Hero Section -->
        <HeroSection />

        <!-- Features Section -->
        <FeaturesSection />

        <!-- About Section -->
        <AboutSection />

        <!-- Services Section -->
        <ServicesSection />

        <!-- Team Section -->
        <TeamSection />

        <!-- Stats Section -->
        <StatsSection />

        <!-- Portfolio Section -->
        <PortfolioSection />

        <!-- Process Section -->
        <ProcessSection />

        <!-- Testimonial Section -->
        <TestimonialSection />

        <!-- Contact CTA Section -->
        <ContactCtaSection />

        <!-- Pricing Section -->
        <PricingSection />

        <!-- Blog Section -->
        <BlogSection />

        <!-- Brand Section -->
        <BrandSection />
    </NuxtLayout>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import TeamSection from './components/TeamSection.vue'
import StatsSection from './components/StatsSection.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import ProcessSection from './components/ProcessSection.vue'
import TestimonialSection from './components/TestimonialSection.vue'
import ContactCtaSection from './components/ContactCtaSection.vue'
import PricingSection from './components/PricingSection.vue'
import BlogSection from './components/BlogSection.vue'
import BrandSection from './components/BrandSection.vue'

useSeoMeta({
    title: 'seo tiêu đề',
    description: 'demo'
})
</script>
