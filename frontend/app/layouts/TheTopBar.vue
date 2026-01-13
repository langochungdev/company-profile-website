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
.top-bar {
    background-color: #111111;
    font-size: 0.875rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 1rem;
    padding-left: 1rem;
}

.top-bar__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.address-wrapper {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.75rem;
    min-width: 0;
    flex: 1 1 0%;
}

.icon {
    width: 1rem;
    height: 1rem;
}

.icon--sm {
    width: 0.75rem;
    height: 0.75rem;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.contact-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: rgba(255, 255, 255, 0.8);
    transition: color 0.15s;
    text-decoration: none;
}

.contact-link:hover {
    color: #DC2626;
}

.email-link {
    display: none;
}

.phone-link {
    font-size: 0.75rem;
    flex-shrink: 0;
}

.nowrap {
    white-space: nowrap;
}

/* Responsive Styles */
@media (min-width: 640px) {
    .container {
        max-width: 640px;
    }
}

@media (min-width: 768px) {
    .container {
        max-width: 768px;
    }
}

@media (min-width: 1024px) {
    .container {
        max-width: 1024px;
    }

    .top-bar {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .top-bar__content {
        justify-content: flex-end;
        gap: 1.5rem;
    }

    .address-wrapper {
        gap: 0.5rem;
        font-size: 0.875rem;
        flex: 0 1 auto;
    }

    .icon {
        width: 1rem;
        height: 1rem;
    }

    .icon--sm {
        width: 1rem;
        height: 1rem;
    }

    .email-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .phone-link {
        font-size: 0.875rem;
        gap: 0.5rem;
    }
}

@media (min-width: 1280px) {
    .container {
        max-width: 1280px;
    }
}

@media (min-width: 1536px) {
    .container {
        max-width: 1536px;
    }
}

/* Animations */
@keyframes blink-red {
    0%,
    100% {
        color: #ef4444;
    }

    50% {
        color: #fca5a5;
        filter: brightness(1.5);
    }
}

.phone-blink {
    animation: blink-red 1.5s ease-in-out infinite;
}

.phone-blink:hover {
    animation-play-state: paused;
}

.top-bar {
    background-color: #111111;
    font-size: 0.875rem;
    height: 32px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
}

.container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 1rem;
    padding-left: 1rem;
}

.top-bar__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.address-wrapper {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.75rem;
    min-width: 0;
    flex: 1 1 0%;
}

.icon {
    width: 1rem;
    height: 1rem;
}

.icon--sm {
    width: 0.75rem;
    height: 0.75rem;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.contact-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: rgba(255, 255, 255, 0.8);
    transition: color 0.15s;
    text-decoration: none;
}

.contact-link:hover {
    color: #DC2626;
}

.email-link {
    display: none;
}

.phone-link {
    font-size: 0.75rem;
    flex-shrink: 0;
}

.nowrap {
    white-space: nowrap;
}

/* Responsive Styles */
@media (min-width: 640px) {
    .container {
        max-width: 640px;
    }
}

@media (min-width: 768px) {
    .container {
        max-width: 768px;
    }
}

@media (min-width: 1024px) {
    .container {
        max-width: 1024px;
    }

    .top-bar {
        height: 40px;
    }

    .top-bar__content {
        justify-content: flex-end;
        gap: 1.5rem;
    }

    .address-wrapper {
        gap: 0.5rem;
        font-size: 0.875rem;
        flex: 0 1 auto;
    }

    .icon {
        width: 1rem;
        height: 1rem;
    }

    .icon--sm {
        width: 1rem;
        height: 1rem;
    }

    .email-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .phone-link {
        font-size: 0.875rem;
        gap: 0.5rem;
    }
}

@media (min-width: 1280px) {
    .container {
        max-width: 1280px;
    }
}

@media (min-width: 1536px) {
    .container {
        max-width: 1536px;
    }
}
</style>
