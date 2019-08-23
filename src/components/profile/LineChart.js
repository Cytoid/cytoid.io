import { Line } from 'vue-chartjs'
import Chart from 'chart.js'
import { format, parse } from 'date-fns'

export default {
  extends: Line,
  props: {
    data: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: 'activity'
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  computed: {
    options() {
      return {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: this.mode === 'activity',
              precision: this.mode === 'accuracy' ? 2 : (this.mode === 'activity' ? 0 : 1),
              callback: (value, index, values) => {
                if (this.mode === 'accuracy') return Math.round(value * 100) + '%'
                if (this.mode === 'rating') return value + ' rt'
                return value
              }
            }
          }],
          xAxes: [{
            type: 'time',
            offset: this.mode === 'activity',
            distribution: 'linear',
            bounds: 'ticks',
            time: {
              unit: 'year',
              displayFormats: {
                year: 'MMM YYYY'
              },
              parser: 'GGGG-W', // Two digits week year, plus two digits week number
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 3,
              source: 'data',
            },
          }]
        },
        tooltips: {
          callbacks: {
            title: (tooltipItems, data) => {
              const date = parse(tooltipItems[0].label, 'Y-w', new Date())
              return format(date, 'YYYY wo', {
                useAdditionalWeekYearTokens: true,
                locale: this.$dateLocale
              }) + ' ' + this.$t('week')
            },
            label: (tooltipItem, data) => {
              switch (this.mode) {
                case 'activity':
                  return tooltipItem.yLabel + ' ranked plays'
                case 'rating':
                  return tooltipItem.yLabel.toFixed(2) + ' rt'
                case 'accuracy':
                  return (tooltipItem.yLabel * 100).toFixed(2) + '%'
              }
              return tooltipItem.yLabel
            }
          }
        }
      }
    },
    chartData() {
      const keys = {
        activity: 'count',
        rating: 'accu_rating',
        accuracy: 'accu_accuracy',
      }
      const key = keys[this.mode]
      return {
        labels: this.data.map(a => a.week),
        datasets: [
          {
            label: this.mode,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            fontColor: 'white',
            data: this.data.map(a => ({ y: a[key], t: a.year + '-' + a.week })),
          }
        ],
      }
    }
  },
  watch: {
    mode() {
      this.renderChart(this.chartData, this.options)
    }
  },
  methods: {
    renderChart(data, options) {
      if (this.$data._chart) this.$data._chart.destroy()
      this.$data._chart = new Chart(
        this.$refs.canvas.getContext('2d'), {
          type: this.mode === 'activity' ? 'bar' : 'line', // The only line changed
          data: data,
          options: options,
          plugins: this.$data._plugins
        }
      )
    }
  }
}
