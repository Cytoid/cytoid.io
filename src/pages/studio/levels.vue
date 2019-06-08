<template lang="pug">
a-list(
  itemLayout="vertical"
  :data-source="levels"
  :loading="levels_loading"
  @change="handleTableChange"
)
  upload-level(slot="header")
  a-list-item(slot="renderItem" slot-scope="item, index" key="item.id")
    img(slot="extra" width="128" height="80" :src="item.bundle.background")
    a-list-item-meta(
      description="Test desc"
      :title="item.title"
    )
    template(slot="actions")
      span
        font-awesome-icon(icon="heart").icon
        | {{item.rating || 'Unknown' }}
</template>

<script>
import UploadLevel from '@/components/studio/UploadLevel'
export default {
  components: {
    UploadLevel,
  },
  data() {
    return {
      levels: [],
      levels_pagination: {
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `${total} levels (${range})`,
        current: 1,
      },
      levels_loading: false,
    }
  },
  mounted() {
    this.fetchLevels()
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.levels_pagination = pagination
      this.fetchLevels()
    },
    fetchLevels() {
      this.levels_loading = true
      this.$axios.get(`/levels`, { params: {
        uploader: this.$auth.user.id,
        page: this.levels_pagination.current - 1,
        limit: this.levels_pagination.pageSize,
        sort: 'creation_date',
        order: 'desc'
      } })
        .then((res) => {
          this.levels_pagination.total = parseInt(res.headers['x-total-entries'], 10)
          this.levels_loading = false
          this.levels = res.data
        })
    }
  }
}
</script>

<style scoped>
.ant-list-item-extra img {
  width: 128px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
.icon {
  margin-right: 0.5rem;
}
</style>
