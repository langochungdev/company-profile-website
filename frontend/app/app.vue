<template>
    <NuxtLayout>
        <NuxtRouteAnnouncer />
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
import { usePageTracking } from '@/admin/composables/usePageTracking'

usePageTracking()
</script>
