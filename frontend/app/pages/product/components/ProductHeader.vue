<template>
    <section class="product-header">
        <div class="container">
            <div class="header-content">
                <span class="sub-title">SHT Solutions</span>
                <h1 class="header-title">Sản Phẩm & <span class="highlight">Giải Pháp</span></h1>
                <p class="header-desc">
                    Hệ sinh thái thiết bị an ninh và mạng chất lượng cao, chính hãng.
                    Giải pháp tối ưu cho mọi quy mô doanh nghiệp.
                </p>

                <div class="header-breadcrumb">
                    <NuxtLink to="/" class="breadcrumb-link">
                        <Icon name="mdi:home" class="home-icon" />
                        Trang chủ
                    </NuxtLink>
                    <Icon name="mdi:chevron-right" class="separator" />
                    <span class="breadcrumb-current">Sản phẩm</span>
                </div>
            </div>
        </div>

        <div class="header-bg-shape"></div>
    </section>
</template>

<script setup>
</script>

<style scoped>
@import "../styles/product-header/desktop.css";
@import "../styles/product-header/mobile.css";
</style>
