<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'ChartBar',
  props: {
    data: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: 'Bar Chart'
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

      const months = Object.keys(props.data).sort()
      const incomeData = months.map(month => props.data[month]?.income || 0)
      const expenseData = months.map(month => props.data[month]?.expenses || 0)

      chartInstance = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: months.map(month => {
            const date = new Date(month + '-01')
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
          }),
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: '#28a745',
              borderColor: '#1e7e34',
              borderWidth: 1
            },
            {
              label: 'Expenses',
              data: expenseData,
              backgroundColor: '#dc3545',
              borderColor: '#c82333',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: props.title
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '$' + value.toLocaleString()
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
  height: 400px;
  width: 100%;
}
</style>
