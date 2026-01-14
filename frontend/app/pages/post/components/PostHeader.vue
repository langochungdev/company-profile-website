<template>
    <section class="post-header">
        <div class="container">
            <div class="header-content">
                <span class="sub-title">SHT Security Blog</span>
                <h1 class="header-title">Tin Tức & <span class="highlight">Sự Kiện</span></h1>
                <p class="header-desc">
                    Cập nhật những xu hướng công nghệ mới nhất, giải pháp an ninh và
                    hạ tầng mạng chuyên nghiệp.
                </p>

                <div class="header-breadcrumb">
                    <NuxtLink to="/" class="breadcrumb-link">
                        <Icon name="mdi:home" class="home-icon" />
                        Trang chủ
                    </NuxtLink>
                    <Icon name="mdi:chevron-right" class="separator" />
                    <span class="breadcrumb-current">Tin tức</span>
                </div>
            </div>
        </div>

        <!-- Decorative elements -->
        <div class="header-bg-shape"></div>
    </section>
</template>

<script setup>

</script>

<style scoped>
@import "../styles/post-header/desktop.css";
@import "../styles/post-header/mobile.css";
</style>
