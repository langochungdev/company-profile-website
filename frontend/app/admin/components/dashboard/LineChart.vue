<template>
    <div class="line-chart-wrapper">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

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
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx
                const gradient = ctx.createLinearGradient(0, 0, 0, 400)
                gradient.addColorStop(0, 'rgba(56, 189, 248, 0.9)')
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0.6)')
                return gradient
            },
            borderColor: 'hsl(195, 100%, 55%)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
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
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: 'hsl(195, 100%, 75%)',
            bodyColor: '#fff',
            padding: 16,
            cornerRadius: 12,
            displayColors: false,
            callbacks: {
                title: (items: any[]) => {
                    return `📅 ${items[0].label}`
                },
                label: (context: any) => {
                    const value = context.parsed.y
                    return value > 0 ? `👁️ ${value.toLocaleString('vi-VN')} lượt xem` : 'Chưa có dữ liệu'
                }
            }
        },
        datalabels: {
            anchor: 'end' as const,
            align: 'top' as const,
            offset: -4,
            color: 'hsl(195, 100%, 65%)',
            font: {
                size: 13,
                weight: 'bold' as const
            },
            formatter: (value: number) => {
                return value > 0 ? value.toLocaleString('vi-VN') : ''
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: {
                    size: 12,
                    weight: 'normal' as const
                }
            },
            border: {
                color: 'rgba(255, 255, 255, 0.1)'
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
                    size: 11,
                    weight: 'normal' as const
                },
                callback: (value: any) => {
                    return value.toLocaleString('vi-VN')
                }
            },
            border: {
                display: false
            }
        }
    }
}
</script>

<style scoped>
@import "./styles/line-chart.css";
</style>
