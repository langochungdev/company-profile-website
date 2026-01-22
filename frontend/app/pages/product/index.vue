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
import { productDetailConfig } from './product.cms'

useAutoSeo(productDetailConfig)
</script>
