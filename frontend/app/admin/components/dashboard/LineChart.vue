<template>
    <div class="line-chart-wrapper">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{
    labels: string[]
    data: number[]
    label?: string
}>()

const chartData = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            label: props.label || 'Lượt truy cập',
            data: props.data,
            borderColor: 'hsl(195, 100%, 55%)',
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx
                const gradient = ctx.createLinearGradient(0, 0, 0, 350)
                gradient.addColorStop(0, 'hsla(195, 100%, 55%, 0.4)')
                gradient.addColorStop(0.5, 'hsla(200, 95%, 50%, 0.2)')
                gradient.addColorStop(1, 'hsla(210, 90%, 45%, 0.05)')
                return gradient
            },
            fill: true,
            tension: 0.42,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointBackgroundColor: 'hsl(195, 100%, 55%)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointHoverBackgroundColor: 'hsl(180, 100%, 60%)',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 4,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowBlur: 12,
            shadowColor: 'rgba(0, 150, 255, 0.3)'
        }
    ]
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index' as const,
        intersect: false
    },
    animation: {
        duration: 1200,
        easing: 'easeInOutQuart' as const
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(10, 15, 30, 0.95)',
            padding: 16,
            borderColor: 'hsl(195, 100%, 55%)',
            borderWidth: 2,
            titleColor: 'hsl(195, 100%, 70%)',
            titleFont: {
                size: 14,
                weight: 'bold' as const
            },
            bodyColor: '#fff',
            bodyFont: {
                size: 13
            },
            displayColors: false,
            cornerRadius: 12,
            caretSize: 8,
            caretPadding: 12,
            callbacks: {
                title: (context: any) => {
                    return `📅 ${context[0].label}`
                },
                label: (context: any) => {
                    const value = context.parsed.y.toLocaleString('vi-VN')
                    return ` 📊 ${value} lượt xem`
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(100, 150, 255, 0.08)',
                drawBorder: false,
                lineWidth: 1
            },
            ticks: {
                color: 'rgba(200, 220, 255, 0.7)',
                font: {
                    size: 12,
                    weight: 'normal' as const
                },
                padding: 8
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(100, 150, 255, 0.08)',
                drawBorder: false,
                lineWidth: 1
            },
            ticks: {
                color: 'rgba(200, 220, 255, 0.7)',
                font: {
                    size: 12,
                    weight: 'normal' as const
                },
                padding: 8,
                callback: (value: any) => {
                    if (value >= 1000) {
                        return (value / 1000).toFixed(1) + 'k'
                    }
                    return value.toLocaleString('vi-VN')
                }
            }
        }
    }
}
</script>

<style scoped>
@import "./styles/line-chart.css";
</style>
