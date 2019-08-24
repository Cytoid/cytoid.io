import { setWeek, setWeekYear } from 'date-fns'

export default {
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
    this.ApexCharts = import('apexcharts')
      .then(imported => imported.default)
    this.renderChart()
  },
  render(h) {
    return h('div')
  },
  watch: {
    mode() {
      this.renderChart()
    }
  },
  methods: {
    async renderChart() {
      if (this.data.length === 0) {
        return
      }
      const key = {
        activity: 'count',
        rating: 'accu_rating',
        accuracy: 'accu_accuracy',
      }[this.mode]
      const chartType = this.mode === 'activity' ? 'bar' : 'line'
      const ApexCharts = await this.ApexCharts
      const options = {
        chart: {
          type: chartType,
          height: 192,
          toolbar: {
            show: false,
          },
          selection: {
            enabled: false,
          },
          zoom: {
            enabled: false,
          },
          animations: {
            enabled: false,
          },
          fontFamily: 'Nunito',
          foreColor: '#FFFFFF',
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        series: [{
          name: 'num',
          data: this.data.map(a => [setWeek(setWeekYear(new Date(), a.year), a.week), a[key]])
        }],
        xaxis: {
          type: 'datetime',
          tickAmount: 6,
        },
        yaxis: {
          decimalsInFloat: this.mode === 'activity' ? 0 : 2,
        },
        colors: ['#FFFFFF'],
      }
      /*
            if (this.chart) {
        await this.chart.updateOptions(options)
      } else {
        this.chart = new ApexCharts(this.$el, options)
        await this.chart.render()
      }
       */
      if (this.chart) {
        await this.chart.destroy()
      }
      this.chart = new ApexCharts(this.$el, options)
      await this.chart.render()
    }
  }
}
