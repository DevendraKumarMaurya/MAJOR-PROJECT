<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'ChartPie',
  props: {
    data: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: 'Pie Chart'
    }
  },
  setup(props) {
    const chartRef = ref(null)
    let chartInstance = null

    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      const ctx = chartRef.value.getContext('2d')

      const labels = Object.keys(props.data)
      const values = Object.values(props.data)

      const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF'
      ]

      chartInstance = new ChartJS(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: $${value.toLocaleString()} (${percentage}%)`
                }
              }
            }
          }
        }
      })
    }

    onMounted(() => {
      if (Object.keys(props.data).length > 0) {
        createChart()
      }
    })

    watch(() => props.data, () => {
      if (Object.keys(props.data).length > 0) {
        createChart()
      }
    }, { deep: true })

    return {
      chartRef
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
