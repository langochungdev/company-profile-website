<!-- Router wrapper cho admin panel - Giữ route /admin -->
<template>
    <AdminPanel />
</template>

<script setup lang="ts">
import AdminPanel from "@/admin/index.vue";

definePageMeta({ layout: false });
</script>
