<template lang="pug">
  div
    a-table(
      :columns="columns"
      :row-key="record => record.id"
      :data-source="rankings"
      :pagination="rankings_pagination"
      :loading="rankings_loading"
      :scroll="{ x: 800 }"
      :rowClassName="(record, index) => rowClass(record, index)"
      @change="handleTableChange"
    )
      template(v-slot:rank="ranking") {{ '#' + ranking }}
      template(v-slot:owner="owner")
        .ranking-player-avatar
          nuxt-link(to="/profile" style="display: flex; align-items: center;")
            a-avatar(:size="24" src="https://cytoid.io/api/avatar.php?size=64&id=tigerhix")
            span.ranking-player-avatar-name(v-text="owner.name || owner.uid")
      template(v-slot:score="score")
        div(style="display: flex; align-items: center;")
          score-badge(:value="score")
          span(style="margin-left: 4px;" v-text="score")
      template(v-slot:accuracy="accuracy") {{ (Math.floor(accuracy * 100 * 100) / 100) + '%' }}
      template(v-slot:maxcombo="maxCombo") {{ maxCombo ? (maxCombo + 'x') : 'Unknown' }}
      template(v-slot:mods="mods")
        span(v-if="mods.length === 0 || mods[0] === ''") N/A
        span(v-else)
          img(v-for="mod in mods" :key="mod" :title="modNames[mod.toLowerCase()]" :src="'/icons/' + mod.toLowerCase() + '.png'" style="height: 20px; padding-bottom: 2px; max-width: unset; margin-right: 4px;")
      template(v-slot:achieved="date" style="font-size: 12px;") {{ readableDate(date) }}
</template>

<script>
const columns = [
  {
    title: 'Level',
    dataIndex: 'metadata',
    scopedSlots: {
      customRender: 'metadata'
    }
  },
  {
    title: 'Visibility',
    dataIndex: 'unlisted',
    scopedSlots: {
      customRender: 'owner'
    }
  },
  {
    title: 'Uploaded on',
    dataIndex: 'score',
    scopedSlots: {
      customRender: 'score'
    }
  },
  {
    title: 'Acc.',
    dataIndex: 'accuracy',
    scopedSlots: {
      customRender: 'accuracy'
    }
  },
  {
    title: 'Max combo',
    dataIndex: 'details.maxCombo',
    scopedSlots: {
      customRender: 'maxcombo'
    }
  },
  {
    title: 'Perfect',
    dataIndex: 'details.perfect'
  },
  {
    title: 'Great',
    dataIndex: 'details.great'
  },
  {
    title: 'Good',
    dataIndex: 'details.good'
  },
  {
    title: 'Bad',
    dataIndex: 'details.bad'
  },
  {
    title: 'Miss',
    dataIndex: 'details.miss'
  },
  {
    title: 'Mods',
    dataIndex: 'mods',
    scopedSlots: {
      customRender: 'mods'
    }
  },
  {
    title: 'Achieved',
    dataIndex: 'date',
    scopedSlots: {
      customRender: 'achieved'
    }
  },
]
export default {
  data: () => ({
    levels: [],
    levels_pagination: {},
    levels_loading: false,
    columns
  }),
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.levels_pagination }
      pager.current = pagination.current
      this.fetchLevels({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      })
    },
    fetchLevels(params = {}) {
      this.levels_loading = true
      this.$axios.get(`/levels?uploader=neo&sort=creation_date&order=desc`, {
        params: {
          results: 10,
          ...params,
        },
      }).then((res) => {
        const pagination = { ...this.levels_pagination }
        pagination.total = res.headers['x-total-entries']
        this.levels_loading = false
        this.levels = res.data
        this.levels_pagination = pagination
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-card {
  margin-bottom: 16px;
}
</style>
