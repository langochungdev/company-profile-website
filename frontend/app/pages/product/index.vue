<template>
    <NuxtLayout name="main">
        <main>
            <ProductList />
        </main>
    </NuxtLayout>
</template>

<script setup>
import ProductList from './(components)/ProductList.vue'
import { useAutoSeo } from '@/admin/composables/useAutoSeo'
import { productConfig } from '@/admin/config/cms/collections'

useAutoSeo(productConfig)
</script>
