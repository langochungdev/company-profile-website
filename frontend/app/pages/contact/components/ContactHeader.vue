<template>
    <section class="contact-header">
        <div class="container">
            <div class="header-content">
                <span class="sub-title">Liên Hệ Với Chúng Tôi</span>
                <h1 class="header-title">Chúng Tôi Luôn <span class="highlight">Sẵn Sàng</span> Hỗ Trợ</h1>
                <p class="header-desc">
                    Hãy để lại thông tin, đội ngũ tư vấn sẽ liên hệ trong vòng 30 phút.
                    Hoặc gọi ngay Hotline để được hỗ trợ nhanh nhất.
                </p>

                <div class="header-breadcrumb">
                    <NuxtLink to="/" class="breadcrumb-link">
                        <Icon name="mdi:home" class="home-icon" />
                        Trang chủ
                    </NuxtLink>
                    <Icon name="mdi:chevron-right" class="separator" />
                    <span class="breadcrumb-current">Liên hệ</span>
                </div>
            </div>
        </div>

        <div class="header-bg-shape"></div>
    </section>
</template>

<script setup>
</script>

<style scoped>
@import "../styles/contact-header/desktop.css";
@import "../styles/contact-header/mobile.css";
</style>
