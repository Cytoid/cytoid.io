<script setup lang="ts">
const props = defineProps({
  score: {
    type: Number,
    required: true,
  },
})

const gradeList = [
  {
    cutoff: 0,
    grade: 'F',
  },
  {
    cutoff: 600000,
    grade: 'D',
  },
  {
    cutoff: 700000,
    grade: 'C',
  },
  {
    cutoff: 800000,
    grade: 'B',
  },
  {
    cutoff: 900000,
    grade: 'A',
  },
  {
    cutoff: 990000,
    grade: 'S',
  },
  {
    cutoff: 995000,
    grade: 'SS',
  },
  {
    cutoff: 999000,
    grade: 'SSS',
  },
  {
    cutoff: 1000000,
    grade: 'MAX',
  },
]

const scoreGrade = computed(() => gradeList.reduce((prev, { cutoff, grade }) => (props.score >= cutoff) ? grade : prev, 'F'))
</script>

<template>
  <div v-if="scoreGrade === 'MAX'" class="badge badge-sm badge-record-max">
    {{ scoreGrade }}
  </div>
  <div v-else-if="scoreGrade === 'SSS'" class="badge badge-sm badge-record-sss">
    {{ scoreGrade }}
  </div>
  <div v-else class="badge badge-neutral badge-sm">
    {{ scoreGrade }}
  </div>
</template>

<style>
.badge-record-max {
  @apply border-transparent bg-yellow-400 text-black
}

.badge-record-sss {
  @apply border-transparent bg-sky-400 text-black
}
</style>
