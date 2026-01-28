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
            borderColor: 'hsl(200, 90%, 50%)',
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx
                const gradient = ctx.createLinearGradient(0, 0, 0, 300)
                gradient.addColorStop(0, 'hsla(200, 90%, 50%, 0.3)')
                gradient.addColorStop(1, 'hsla(200, 90%, 50%, 0)')
                return gradient
            },
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'hsl(200, 90%, 50%)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }
    ]
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            borderColor: 'hsl(200, 90%, 50%)',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
                label: (context: any) => {
                    return ` ${context.parsed.y.toLocaleString('vi-VN')} lượt xem`
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.6)',
                font: {
                    size: 12
                }
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.6)',
                font: {
                    size: 12
                },
                callback: (value: any) => value.toLocaleString('vi-VN')
            }
        }
    }
}
</script>

<style scoped>
@import "./styles/line-chart.css";
</style>
