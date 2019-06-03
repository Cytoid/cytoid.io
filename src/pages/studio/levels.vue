<template lang="pug">
  div
    a-table(
      :columns="columns"
      :row-key="level => level.id"
      :data-source="levels"
      :pagination="levels_pagination"
      :loading="levels_loading"
      :scroll="{ x: 800 }"
      @change="handleTableChange"
    )
      template(slot="metadata" slot-scope="text, record")
        div(style="display: flex; flex-direction: row;")
          img(:src="record.bundle.background" style="width: 128px; height: 80px; object-fit: cover; border-radius: 4px;")
          div(style="margin-left: 8px") {{ record.title }}
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
export default {
  data() {
    const columns = [
      {
        title: 'Level',
        scopedSlots: {
          customRender: 'metadata'
        }
      },
      {
        title: 'Visibility',
        dataIndex: 'unlisted',
        scopedSlots: {
          customRender: 'unlisted'
        }
      },
      {
        title: 'Date',
        dataIndex: 'creation_date',
        scopedSlots: {
          customRender: 'creation_date'
        }
      },
      {
        title: 'Downloads',
        dataIndex: 'downloads',
        scopedSlots: {
          customRender: 'downloads'
        }
      },
      {
        title: 'Plays',
        dataIndex: 'plays',
        scopedSlots: {
          customRender: 'plays'
        }
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        scopedSlots: {
          customRender: 'rating'
        }
      }
    ]
    return {
      levels: [],
      levels_pagination: {},
      levels_loading: false,
      columns
    }
  },
  mounted() {
    this.fetchLevels()
  },
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
