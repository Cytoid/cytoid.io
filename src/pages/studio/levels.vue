<template lang="pug">
  div
    .section
      .heading Upload
      upload-level
    .section
      .heading Manage
      .box
        b-table(
          :mobile-cards="false"
          scrollable
          paginated
          backend-pagination
          :total="levels_pagination.total"
          :per-page="levels_pagination.pageSize"
          :current-page="levels_pagination.current + 1"
          :data="levels"
          :loading="levels_loading"
          @page-change="handlePageChange"
        )
          template(slot="empty")
            empty-placeholder
          template
            b-table-column(v-slot="props" label="Level")
              .media
                .media-left
                  nuxt-link.image.is-studio-table-thumbnail(:to="{name: 'levels-id', params: { id: props.row.uid }}")
                    img(:src="props.row.bundle && props.row.bundle.backgroundImage && props.row.bundle.backgroundImage.thumbnail")
                .media-content
                  h4(v-text="props.row.title")
                  p.is-size-7 ID: {{ props.row.uid }}
                  ul.action-buttons
                    li: nuxt-link(:to="{name: 'levels-id-manage', params: { id: props.row.uid }}")
                      font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
                    li: a(@click="openDeleteModal(props.row)")
                      font-awesome-icon(:icon="['fas', 'trash']" fixed-width)
            b-table-column(v-slot="props" label="Visibility")
              visibility-select(:value="props.row.state" @change="openChangeVisibilityModal(props.row, $event)")
            b-table-column(v-slot="props" label="Downloads") {{ props.row.downloadCount }}
            b-table-column(v-slot="props" label="Plays") {{ props.row.playCount }}
            b-table-column(v-slot="props" label="Rating")
              .content(style="white-space: nowrap;")
                font-awesome-icon(:icon="['fas', 'star']" style="margin-right: 0.5rem;")
                template(v-if="props.row.avgRating && props.row.ratingCount")
                  | {{ (Math.floor(props.row.avgRating * 0.5 * 100) / 100).toFixed(2) }} ({{props.row.ratingCount}})
                template(v-else) N/A
            b-table-column(v-slot="props" label="Date") {{ $dateFormatCalendar(props.row.creationDate) }}
</template>

<script>
import gql from 'graphql-tag'
import UploadLevel from '@/components/studio/UploadLevel'
import VisibilityModal from '@/components/studio/VisibilityModal'
import DeleteModal from '@/components/studio/DeleteModal'
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import VisibilitySelect from '@/components/studio/VisibilitySelect'
export default {
  components: {
    VisibilitySelect,
    UploadLevel,
    EmptyPlaceholder,
  },
  data () {
    return {
      levels: [],
      levels_pagination: {
        pageSize: 10,
        total: 0,
        current: 0,
      },
      levels_loading: false,
    }
  },
  mounted () {
    this.fetchLevels()
  },
  methods: {
    openDeleteModal (level) {
      this.deleteModal = this.$buefy.modal.open({
        parent: this,
        props: { level },
        events: {
          submit: this.deleteLevel
        },
        component: DeleteModal,
        hasModalCard: true,
        trapFocus: true,
        onCancel: () => {
          this.deleteModal = null
        }
      })
    },
    openChangeVisibilityModal (level, visibility) {
      this.visibilityModal = this.$buefy.modal.open({
        parent: this,
        props: { level, value: visibility },
        events: {
          submit: this.setLevelVisibility
        },
        component: VisibilityModal,
        hasModalCard: true,
        trapFocus: true,
        onCancel: () => {
          this.visibilityModal = null
        }
      })
    },
    deleteLevel (modal) {
      const level = modal.level
      modal.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation DeleteLevel($id: ID!) {
          deleteLevel(id: $id)
        }`,
        variables: {
          id: level.id,
        }
      })
        .then(() => {
          this.deleteModal.close()
          this.deleteModal = null
          this.$buefy.toast.open({
            message: level.title + ' Deleted!',
            type: 'is-warning',
          })
          const index = this.levels.indexOf(level)
          if (index !== -1) {
            this.levels.splice(index, 1)
          }
        })
        .catch(this.handleErrorToast)
        .then(() => {
          modal.loading = false
        })
    },
    setLevelVisibility (modal) {
      const level = modal.level
      modal.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation UpdateLevel($id: ID!, $input: UpdateLevelInput!) {
          updateLevel(id: $id, input: $input)
        }`,
        variables: {
          id: level.id,
          input: {
            state: modal.value
          }
        }
      })
        .then(() => {
          this.visibilityModal.close()
          this.visibilityModal = null
          level.state = modal.value
          this.$buefy.toast.open({
            message: level.title + ' visibility updated!',
            type: 'is-success',
          })
        })
        .catch(this.handleErrorToast)
        .then(() => {
          modal.loading = false
        })
    },
    handlePageChange (page) {
      this.levels_pagination.current = page - 1
      this.fetchLevels()
    },
    fetchLevels () {
      this.levels_loading = true
      this.$apollo.query({
        query: gql`query FetchLevelForStudio($limit: Int!, $start: Int!) {
          my {
            levelsCount
            levels(start: $start, limit: $limit) {
              id
              uid
              title
              creationDate
              bundle {
                backgroundImage {
                  thumbnail
                }
              }
              state
              avgRating
              ratingCount
              downloadCount
              playCount
            }
          }
        }`,
        variables: {
          start: this.levels_pagination.current * this.levels_pagination.pageSize,
          limit: this.levels_pagination.pageSize,
        }
      })
        .then(({ data }) => {
          this.levels_pagination.total = data.my.levelsCount
          this.levels = data.my.levels
          window.scrollTo(0, 0)
        })
        .catch(err => this.handleErrorToast(err))
        .then(() => {
          this.levels_loading = false
        })
    },
  },
  i18n: {
    key: 'studio'
  }
}
</script>
