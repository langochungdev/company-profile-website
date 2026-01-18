<template>
    <section class="contact-form-section">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-info">
                    <h2 class="info-title">Thông Tin <span class="highlight">Liên Hệ</span></h2>
                    <p class="info-desc">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ qua các kênh dưới đây.</p>

                    <div class="info-list">
                        <div v-for="item in contactInfo" :key="item.label" class="info-item">
                            <div class="info-icon-wrap">
                                <Icon :name="item.icon" class="info-icon" />
                            </div>
                            <div class="info-content">
                                <span class="info-label">{{ item.label }}</span>
                                <span class="info-value">{{ item.value }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="social-links">
                        <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" rel="noopener noreferrer" class="social-link" :aria-label="social.name">
                            <Icon :name="social.icon" />
                        </a>
                    </div>
                </div>

                <div class="form-wrapper">
                    <h3 class="form-title">Gửi Yêu Cầu Tư Vấn</h3>
                    <form @submit.prevent="handleSubmit" class="contact-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="name">Họ và tên *</label>
                                <input type="text" id="name" v-model="form.name" placeholder="Nguyễn Văn A" required />
                            </div>
                            <div class="form-group">
                                <label for="phone">Số điện thoại *</label>
                                <input type="tel" id="phone" v-model="form.phone" placeholder="0901 234 567" required />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" v-model="form.email" placeholder="email@example.com" />
                        </div>
                        <div class="form-group">
                            <label for="service">Dịch vụ quan tâm</label>
                            <select id="service" v-model="form.service">
                                <option value="">Chọn dịch vụ</option>
                                <option value="camera">Camera An Ninh AI</option>
                                <option value="network">Hạ Tầng Mạng</option>
                                <option value="wifi">WiFi & Firewall</option>
                                <option value="access">Access Control</option>
                                <option value="fire">Báo Cháy</option>
                                <option value="pbx">Tổng Đài IP</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">Nội dung yêu cầu *</label>
                            <textarea id="message" v-model="form.message" rows="4" placeholder="Mô tả chi tiết nhu cầu của bạn..." required></textarea>
                        </div>
                        <button type="submit" class="submit-btn" :disabled="isSubmitting">
                            <span v-if="!isSubmitting">Gửi Yêu Cầu</span>
                            <span v-else>Đang gửi...</span>
                            <Icon name="mdi:send" />
                        </button>
                    </form>
                </div>
            </div>

            <div class="map-section">
                <h3 class="map-title">Vị Trí Văn Phòng</h3>
                <div class="map-wrapper">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69765841533417!3d10.778789792319392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1704796800000" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ SHT Security"></iframe>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const form = ref({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
})

const isSubmitting = ref(false)

const contactInfo = [
    { label: 'Hotline', value: '0901 234 567', icon: 'mdi:phone' },
    { label: 'Email', value: 'info@sht.vn', icon: 'mdi:email' },
    { label: 'Địa chỉ', value: '123 Đường ABC, Quận 1, TP.HCM', icon: 'mdi:map-marker' },
    { label: 'Giờ làm việc', value: 'T2 - T7: 8:00 - 18:00', icon: 'mdi:clock-outline' }
]

const socials = [
    { name: 'Facebook', icon: 'mdi:facebook', url: 'https://facebook.com/SHT.security' },
    { name: 'TikTok', icon: 'mdi:music-note', url: 'https://tiktok.com/@sht.security' },
    { name: 'YouTube', icon: 'mdi:youtube', url: 'https://youtube.com/@SHTsecurity' },
    { name: 'Zalo', icon: 'mdi:chat', url: 'https://zalo.me/0901234567' }
]

const handleSubmit = () => {
    isSubmitting.value = true
    setTimeout(() => {
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.')
        form.value = { name: '', phone: '', email: '', service: '', message: '' }
        isSubmitting.value = false
    }, 1500)
}
</script>

<style scoped>
@import "@/styles/contact/contact-form/desktop.css";
@import "@/styles/contact/contact-form/mobile.css";
</style>
