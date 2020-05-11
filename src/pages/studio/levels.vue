<template lang="pug">
  div
    visibility-modal(ref="visibilityModal" @change="sendVisibilityReq")
    delete-modal(ref="deleteModal" @change="deleteLevel")
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-bottom: 16px;")
      p Upload
    upload-level
    captcha(invisible badge="bottomleft")
    div(style="color: rgba(255, 255, 255, 0.7); font-weight: bold; margin-top: 16px; margin-bottom: 16px")
      p Manage
    .box
      b-table(
        :data="levels"
        :loading="levels_loading"
      )
        template(slot="empty")
          section.section
            .content.has-text-centered
              font-awesome-icon(icon="empty-set" size="6x")
              h4.is-size-4(style="margin-top: 3rem;") Nothing Here
        template(slot-scope="props")
          b-table-column(label="Level")
            .media
              .media-left
                nuxt-link.image.is-studio-table-thumbnail(:to="{name: 'levels-id', params: { id: props.row.uid }}")
                  img(:src="props.row.cover.thumbnail")
              .media-content
                .content
                  h4(v-text="props.row.title")
                  p.is-size-7.has-text-grey ID: {{ props.row.uid }}
                ul.action-buttons
                  li: a(:href="downloadURL(props.row)")
                    font-awesome-icon(:icon="['fas', 'download']" fixed-width)
                  li: nuxt-link(:to="{name: 'levels-id-manage', params: { id: props.row.uid }}")
                    font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
                  li: a(@click="$refs.deleteModal.show(props.row)")
                    font-awesome-icon(:icon="['fas', 'trash']" fixed-width)
          b-table-column(label="Visibility")
            b-dropdown
              button.button(slot="trigger")
                | {{ props.row.state }}
                b-icon(icon="caret-down")
              b-dropdown-item(value="PUBLIC") Public
              b-dropdown-item(value="PRIVATE") Private
              b-dropdown-item(value="UNLISTED") Unlisted
          b-table-column(label="Downloads") {{ props.row.downloads }}
          b-table-column(label="Plays") {{ props.row.plays }}
          b-table-column(label="Rating")
            .content(style="white-space: nowrap;")
              font-awesome-icon(:icon="['fas', 'star']" style="margin-right: 0.5rem;")
              | {{ props.row.rating ? (Math.floor(props.row.rating * 0.5 * 100) / 100).toFixed(2) : 'N/A' }}
          b-table-column(label="Date") {{ $dateFormatCalendar(props.row.creationDate) }}
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
    return {
      levels: [],
      levels_pagination: {
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `${total} levels (${range.join('-')})`,
        current: 1,
      },
      levels_loading: false,
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

<style lang="scss">
.is-studio-table-thumbnail {
  transition: 0.2s $hoverEasing;
  width: 128px;
  height: 72px;
  &:hover {
   filter: brightness(50%);
  }
  border-radius: $radius;
}
</style>
