import { Line } from 'vue-chartjs'
import Chart from 'chart.js'

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
              beginAtZero: true
            }
          }],
          xAxes: [{
            type: 'time',
            offset: this.mode === 'activity',
            distribution: 'linear',
            bounds: 'ticks',
            time: {
              unit: 'week',
              displayFormats: {
                week: 'W'
              },
              parser: 'GGGG-W', // Two digits week year, plus two digits week number
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
              source: 'data',
            }
          }, {
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
