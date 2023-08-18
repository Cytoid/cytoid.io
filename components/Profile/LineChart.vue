<script setup lang="ts">
import { setWeek, setWeekYear } from 'date-fns'

const props = withDefaults(defineProps<{
  data: ChartData[]
  mode: 'activity' | 'rating' | 'accuracy'
}>(), {
  mode: 'activity',
})

const chartType = computed(() => {
  return props.mode === 'activity' ? 'bar' : 'line'
})

const key = computed(() => {
  switch (props.mode) {
    case 'activity':
      return 'count'
    case 'rating':
      return 'cumulativeRating'
    case 'accuracy':
      return 'cumulativeAccuracy'
  }
  return 'count'
})

const series = computed(() => ([{
  name: 'num',
  data: props.data.map(a => [setWeek(setWeekYear(new Date(), a.year), a.week), a[key.value]]),
}]))

const height = computed(() => {
  return 192
})

const options = computed(() => ({
  chart: {
    type: chartType.value,
    height: height.value,
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
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  markers: {
    size: 0,
  },
  tooltip: {
    enabled: false,
  },
  series: series.value,
  xaxis: {
    type: 'datetime',
    tickAmount: 6,
  },
  yaxis: {
    labels: {
      formatter: (val: number) => {
        if (props.mode === 'activity') {
          return val.toFixed(0)
        }
        else if (props.mode === 'rating') {
          return val.toFixed(2)
        }
        return `${(val * 100).toFixed(2)}%`
      },
    },
  },
  colors: ['#FFFFFF'],
  grid: {
    show: false,
  },
}))

interface ChartData {
  count: number
  cumulativeAccuracy: number
  cumulativeRating: number
  week: number
  year: number
}
</script>

<template>
  <ClientOnly>
    <apexchart
      v-if="data.length > 0"
      :options="options"
      :series="series"
      :height="height"
      width="100%"
    />

    <template #fallback>
      Loading...
    </template>
  </ClientOnly>
</template>
