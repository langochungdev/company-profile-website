<template>
    <div class="min-h-screen overflow-x-hidden">
        <TheHeader />

        <slot />

        <TheFooter />
    </div>
</template>

<script setup>
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
</script>
