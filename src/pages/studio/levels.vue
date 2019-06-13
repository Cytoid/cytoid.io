<template lang="pug">
  div
    visibility-modal(ref="visibilityModal")
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-bottom: 16px;")
      p Upload
    upload-level(slot="header")
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-top: 16px; margin-bottom: 16px")
      p Manage
    a-card(class="studio-levels-card ele2")
      a-table(
        class="studio-levels-table"
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
            nuxt-link.level-thumbnail(:to="{name: 'levels-id-manage', params: { id: record.uid }}")
              img(:src="record.bundle.background" style="width: 128px; height: 80px; object-fit: cover; border-radius: 4px;")
            div(style="margin-left: 8px")
              p(style="margin-left: 8px; padding-top: 8px; margin-bottom: 0;") {{ record.title }}
                p(style="margin-left: 8px; font-size: 10px; color: rgba(255, 255, 255, 0.3);") {{ 'ID: ' + record.uid }}
              div
                a-button(class="icon-button")
                  font-awesome-icon(:icon="['fas', 'download']" fixed-width)
                a-button(class="icon-button")
                  font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
                a-button(class="icon-button")
                  font-awesome-icon(:icon="['fas', 'trash']" fixed-width)
        template(slot="visibility" slot-scope="text, level")
          a-dropdown
            a.ant-dropdown-link
              | Public
              font-awesome-icon(:icon="['fas', 'caret-down']" fixed-width)
            a-menu(slot="overlay")
              a-menu-item(v-for="(mode, index) of ['Public', 'Unlisted', 'Private']" @click="changeVisibility(level, index)")
                font-awesome-icon(:icon="['globe', 'eye-slash', 'lock'][index]" fixed-width style="margin-right: 0.5rem;")
                | {{mode}}
        template(v-slot:creationDate="creationDate") {{ formatDate(creationDate) }}
        template(v-slot:rating="rating")
          div(style="display: flex;")
            font-awesome-icon(:icon="['fas', 'star']" fixed-width style="margin-top: 2px; margin-right: 4px;")
            span(style="white-space: nowrap;") {{ rating ? (Math.floor(rating * 0.5 * 100) / 100).toFixed(2) : 'N/A' }}
        template(v-slot:downloads="downloads") {{ downloads }}
        template(v-slot:plays="plays") {{ plays }}
</template>

<script>
import moment from 'moment'
import UploadLevel from '@/components/studio/UploadLevel'
import VisibilityModal from '@/components/studio/VisibilityModal'
export default {
  components: {
    UploadLevel,
    VisibilityModal,
  },
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
        scopedSlots: {
          customRender: 'visibility'
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
      },
      {
        title: 'Date',
        dataIndex: 'creationDate',
        scopedSlots: {
          customRender: 'creationDate'
        }
      },
    ]
    return {
      levels: [],
      levels_pagination: {
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `${total} levels (${range.join('-')})`,
        current: 1,
      },
      levels_loading: false,
      columns
    }
  },
  mounted() {
    this.fetchLevels()
  },
  methods: {
    formatDate(date) {
      return moment.utc(date).calendar()
    },
    changeVisibility(level, visibility) {
      this.$refs.visibilityModal.show(level, visibility)
    },
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

<style lang="less" scoped>
.ant-list-item-extra img {
  width: 128px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
.level-thumbnail {
  display: flex;
  align-items: center;
  transition: 0.4s @hoverEasing;
  &:hover {
    filter: brightness(50%);
  }
}
</style>

<style lang="less">
.studio-levels-card .ant-card-body {
  padding: 24px 16px;
}
.studio-levels-table .ant-table-thead > tr > th, .studio-levels-table .ant-table-tbody > tr > td {
  padding: 8px;
}
</style>
