<!-- Component hiển thị thông tin liên hệ nhanh ở đầu trang -->
<template>
    <div class="top-bar">
        <div class="container">
            <div class="top-bar__content">
                <div class="address-wrapper">
                    <Icon name="mdi:map-marker" class="icon icon--sm flex-shrink-0" />
                    <span class="text-truncate">123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <a href="mailto:info@sht.vn" class="contact-link email-link">
                    <Icon name="mdi:email" class="icon" />
                    <span>info@sht.vn</span>
                </a>
                <a href="tel:0901234567" class="contact-link phone-link phone-blink">
                    <Icon name="mdi:phone" class="icon icon--sm flex-shrink-0" />
                    <span class="nowrap">0901 234 567</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../styles/top-bar/desktop.css";
@import "../styles/top-bar/mobile.css";
</style>
