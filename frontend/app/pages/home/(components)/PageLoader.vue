<!-- Component preloader hiển thị khi trang web đang load -->
<template>
    <Teleport to="body">
        <Transition name="page-loader">
            <div v-if="isLoading" class="page-loader">
                <div class="loader-container">
                    <div class="loader-circle-bg"></div>
                    <div class="loader-circle-spin"></div>
                    <div class="logo-wrapper">
                        <img src="/images/logo.png" alt="SHT Logo" class="logo-img" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const isLoading = ref(true)

onMounted(() => {
    Promise.all([
        new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve()
            } else {
                window.addEventListener('load', resolve)
            }
        }),
        new Promise(resolve => setTimeout(resolve, 800))
    ]).then(() => {
        setTimeout(() => {
            isLoading.value = false
        }, 300)
    })
})
</script>

<style scoped>
.page-loader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loader-container {
    position: relative;
    width: 10rem;
    height: 10rem;
}

.loader-circle-bg {
    position: absolute;
    inset: 0;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
}

.loader-circle-spin {
    position: absolute;
    inset: 0;
    border: 4px solid transparent;
    border-top-color: #DC2626;
    border-radius: 9999px;
    animation: spin 1s linear infinite;
}

.logo-wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-img {
    width: 6rem;
    height: 6rem;
    object-fit: contain;
}

/* Transitions */
.page-loader-enter-active {
    transition: opacity 0.3s ease;
}

.page-loader-leave-active {
    transition: opacity 0.5s ease;
}

.page-loader-enter-from,
.page-loader-leave-to {
    opacity: 0;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
