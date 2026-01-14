<template>
    <section class="about-header">
        <div class="container">
            <div class="header-content">
                <span class="sub-title">Về Chúng Tôi</span>
                <h1 class="header-title">Đồng Hành Cùng <span class="highlight">SHT Security</span></h1>
                <p class="header-desc">
                    Với hơn 10 năm kinh nghiệm trong lĩnh vực an ninh và hạ tầng mạng,
                    chúng tôi tự hào là đối tác tin cậy của hàng nghìn doanh nghiệp.
                </p>

                <div class="header-breadcrumb">
                    <NuxtLink to="/" class="breadcrumb-link">
                        <Icon name="mdi:home" class="home-icon" />
                        Trang chủ
                    </NuxtLink>
                    <Icon name="mdi:chevron-right" class="separator" />
                    <span class="breadcrumb-current">Giới thiệu</span>
                </div>
            </div>
        </div>

        <div class="header-bg-shape"></div>
    </section>
</template>

<script setup>
</script>

<style scoped>
@import "../styles/about-header/desktop.css";
@import "../styles/about-header/mobile.css";
</style>
