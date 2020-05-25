<template lang="pug">
  div
    .section
      .heading Rating Analysis
      .box
        b-table(
          :data="isRecentRecords ? recentRecords : bestRecords"
          narrowed
          striped
          :mobile-cards="false"
          paginated
          :per-page="10"
        )
          template(slot-scope="props")
            b-table-column(label="Level")
              nuxt-link(:to="{ name: 'levels-id', params: {id: props.row.chart.level.uid } }")
                p(v-text="props.row.chart.level.title")
                small(v-text="props.row.chart.level.uid")
            b-table-column(label="Date") {{ $dateFormatCalendar(props.row.date) }}
            b-table-column(label="Accuracy" numeric) {{props.row.accuracy.toFixed(2) }}
            b-table-column(label="Difficulty" numeric subheading="Average:") {{props.row.chart.difficulty }}
            b-table-column(label="Record Rating" numeric :subheading="(isRecentRecords ? recentRecordsAverage : bestRecordsAverage).toFixed(2)" )
              font-awesome-icon(v-if="props.row.used" icon="check-circle" style="margin-right: 0.5rem;")
              | {{ props.row.rating.toFixed(2) }}
          template(slot="footer")
            .media(style="margin-top: 1rem; margin-bottom: 1rem;")
              .media-left
                .tabs.is-small.is-toggle: ul
                  li(
                    :class="{ 'is-active': isRecentRecords === false }"
                    @click="isRecentRecords = false"
                  ): a Best Records
                  li(
                    :class="{ 'is-active': isRecentRecords === true }"
                    @click="isRecentRecords = true"
                  ): a Recent Records
              .media-content.has-text-right Overall Average: {{totalAverage.toFixed(2)}}
</template>

<script>
import gql from 'graphql-tag'
import { handleErrorBlock } from '@/plugins/antd'
const query = gql`query StudioAnalytics($id: ID) {
  profile(id: $id) {
    id
    recentRecords(limit: 30) {
      ...RecordFragment
    }
    bestRecords(limit: 30) {
      ...RecordFragment
    }
  }
}

fragment RecordFragment on UserRecord {
  id
  date
  chart {
    id
    difficulty
    level {
      uid
      title
    }
  }
  accuracy
  rating
}`
export default {
  name: 'StudioAnalytics',
  data() {
    return {
      isRecentRecords: false,
      bestRecords: [],
      recentRecords: [],
      bestRecordsAverage: 0,
      recentRecordsAverage: 0,
      totalAverage: 0,
    }
  },
  async asyncData({ params, error, app, store }) {
    const data = await app.apolloProvider.defaultClient.query({
      query,
      variables: {
        id: store.state.user.id,
      }
    }).then(({ data }) => data.profile)
      .catch(err => handleErrorBlock(err, error))
    const sortedRecents = data.recentRecords?.concat().sort((a, b) => b.rating - a.rating).slice(0, 10)
    for (const item of sortedRecents) {
      item.used = true
    }
    const bestRecordsSum = data.bestRecords.reduce((a, item) => a + item.rating, 0)
    const recentRecordsSum = sortedRecents.reduce((a, item) => a + item.rating, 0)
    data.bestRecordsAverage = bestRecordsSum / 30
    data.recentRecordsAverage = recentRecordsSum / 10
    data.totalAverage = (bestRecordsSum + recentRecordsSum) / 40
    return data
  }
}
</script>
