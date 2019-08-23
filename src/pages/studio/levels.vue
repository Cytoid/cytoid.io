<template lang="pug">
  div
    visibility-modal(ref="visibilityModal" @change="sendVisibilityReq")
    delete-modal(ref="deleteModal" @change="deleteLevel")
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-bottom: 16px;")
      p Upload
    upload-level(slot="header" accept=".cytoidlevel")
      template(slot="text") Click or drag a Cytoid level to this area
      template(slot="hint")
        | Don't know how to create one? Read our
        a(href="https://github.com/Cytoid/Cytoid/wiki/a.-Creating-a-level" @click.stop)  wiki
        | !
    captcha(invisible badge="bottomleft")
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-top: 16px; margin-bottom: 16px")
      p Manage
    a-card.studio-levels-card.ele2
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
        template(slot="metadata" slot-scope="text, level")
          div(style="display: flex; flex-direction: row;")
            nuxt-link.level-thumbnail(:to="{name: 'levels-id', params: { id: level.uid }}")
              img(
                :src="$img(level.bundle.background, { width: 128, height: 80, fitMode: 'crop', cropMode: 'entropy' })"
                style="width: 128px; height: 80px; object-fit: cover; border-radius: 4px;"
              )
            div(style="margin-left: 8px")
              p(style="margin-left: 8px; padding-top: 8px; margin-bottom: 0;") {{ level.title }}
                p(style="margin-left: 8px; font-size: 10px; color: rgba(255, 255, 255, 0.3);") {{ 'ID: ' + level.uid }}
              div
                a(:href="downloadURL(level)")
                  a-button.icon-button
                    font-awesome-icon(:icon="['fas', 'download']" fixed-width)
                nuxt-link(:to="{name: 'levels-id-manage', params: { id: level.uid }}")
                  a-button.icon-button
                    font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
                a-button.icon-button(@click="$refs.deleteModal.show(level)")
                  font-awesome-icon(:icon="['fas', 'trash']" fixed-width)
        template(slot="visibility" slot-scope="text, level")
          visibility-select(:value="level.published" @change="changeVisibility(level, $event)")
        template(v-slot:creationDate="creationDate") {{$dateFormatCalendar(creationDate)}}
        template(v-slot:rating="rating")
          div(style="display: flex;")
            font-awesome-icon(:icon="['fas', 'star']" fixed-width style="margin-top: 2px; margin-right: 4px;")
            span(style="white-space: nowrap;") {{ rating ? (Math.floor(rating * 0.5 * 100) / 100).toFixed(2) : 'N/A' }}
        template(v-slot:downloads="downloads") {{ downloads }}
        template(v-slot:plays="plays") {{ plays }}
</template>

<script>
import UploadLevel from '@/components/studio/UploadLevel'
import VisibilityModal from '@/components/studio/VisibilityModal'
import DeleteModal from '@/components/studio/DeleteModal'
import VisibilitySelect from '@/components/studio/VisibilitySelect'
export default {
  components: {
    UploadLevel,
    VisibilityModal,
    VisibilitySelect,
    DeleteModal,
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
    downloadURL(level) {
      return process.env.apiURL + '/levels/' + level.uid + '/package'
    },
    changeVisibility(level, visibility) {
      this.$refs.visibilityModal.show(level, visibility)
    },
    deleteLevel(level) {
      this.$refs.deleteModal.loading = true
      this.$axios.delete('/levels/' + level.uid)
        .then(() => {
          this.$message.success(level.title + ' Deleted!')
          this.$refs.deleteModal.modalVisible = false
          const index = this.levels.indexOf(level)
          if (index !== -1) {
            this.levels.splice(index, 1)
          }
          global.window.gtag('event', 'delete', {
            event_category: 'levels',
            value: level.uid,
          })
        })
        .catch(this.handleErrorToast)
        .then(() => {
          this.$refs.deleteModal.loading = false
        })
    },
    sendVisibilityReq([level, val]) {
      this.$refs.visibilityModal.loading = true
      this.$axios
        .patch('/levels/' + level.uid, { published: val })
        .then(() => {
          level.published = val
          this.$refs.visibilityModal.modalVisible = false
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.$refs.visibilityModal.loading = false
        })
    },
    handleTableChange(pagination, filters, sorter) {
      this.levels_pagination = pagination
      this.fetchLevels()
    },
    fetchLevels() {
      this.levels_loading = true
      this.$axios.get('/levels', {
        params: {
          owner: this.$store.state.user.id,
          page: this.levels_pagination.current - 1,
          limit: this.levels_pagination.pageSize,
          sort: 'creation_date',
          order: 'desc'
        }
      })
        .then((res) => {
          this.levels_pagination.total = parseInt(res.headers['x-total-entries'], 10)
          this.levels_loading = false
          this.levels = res.data
          window.scrollTo(0, 0)
        })
    },
    visibility(level) {
      const published = level.published
      if (published === true) {
        return 2
      } else if (published === false) {
        return 0
      } else {
        return 1
      }
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
  transition: 0.2s @hoverEasing;
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
