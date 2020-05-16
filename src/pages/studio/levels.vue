<template lang="pug">
  div
    .section
      .heading Upload
      upload-level
    .section
      .heading Manage
      .box
        b-table(
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
          template(slot-scope="props")
            b-table-column(label="Level")
              .media
                .media-left
                  nuxt-link.image.is-studio-table-thumbnail(:to="{name: 'levels-id', params: { id: props.row.uid }}")
                    img(:src="props.row.cover.thumbnail")
                .media-content
                  h4(v-text="props.row.title")
                  p.is-size-7.has-text-grey ID: {{ props.row.uid }}
                  ul.action-buttons
                    li: nuxt-link(:to="{name: 'levels-id-manage', params: { id: props.row.uid }}")
                      font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
                    li: a(@click="openDeleteModal(props.row)")
                      font-awesome-icon(:icon="['fas', 'trash']" fixed-width)
            b-table-column(label="Visibility")
              visibility-select(:value="props.row.state" @change="openChangeVisibilityModal(props.row, $event)")
            b-table-column(label="Downloads") {{ props.row.downloads }}
            b-table-column(label="Plays") {{ props.row.plays }}
            b-table-column(label="Rating")
              .content(style="white-space: nowrap;")
                font-awesome-icon(:icon="['fas', 'star']" style="margin-right: 0.5rem;")
                | {{ props.row.rating ? (Math.floor(props.row.rating * 0.5 * 100) / 100).toFixed(2) : 'N/A' }}
            b-table-column(label="Date") {{ $dateFormatCalendar(props.row.creationDate) }}
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
  data() {
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
  mounted() {
    this.fetchLevels()
  },
  methods: {
    openDeleteModal(level) {
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
    openChangeVisibilityModal(level, visibility) {
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
    deleteLevel(modal) {
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
    setLevelVisibility(modal) {
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
    handlePageChange(page) {
      this.levels_pagination.current = page - 1
      this.fetchLevels()
    },
    fetchLevels() {
      this.levels_loading = true
      this.$axios.get('/levels', {
        params: {
          owner: this.$store.state.user.id,
          page: this.levels_pagination.current,
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
  },
  i18n: {
    key: 'studio'
  }
}
</script>
