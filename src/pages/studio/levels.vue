<template lang="pug">
  div
    a-modal(
      title="Change level visibility"
      v-model="change_visibility_modal_visible"
      :closable="false"
      @ok="changeVisibility"
    )
      a-radio-group(v-model="change_visibility_value" size="large")
        a-radio-button(:value="'public'") Public
        a-radio-button(:value="'unlisted'") Unlisted
      div(style="padding-top: 16px;")
        template(v-if="change_visibility_value === 'public'")
          p This level is visible to everybody.
        template(v-if="change_visibility_value === 'unlisted'")
          p(style="font-weight: bold;") This level is only visible to anybody who has the link.
          p This level won't appear to viewers who visit the level listing or your profile. It also won't appear in the search results.
            span(style="font-weight: bold;")  However, it is visible in a public collection which contains the level.
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
            a(class="level-thumbnail" :href="'/levels/' + record.uid")
              img(:src="record.bundle.background" style="width: 128px; height: 80px; object-fit: cover; border-radius: 4px;")
            div(style="margin-left: 8px")
              p(style="margin-left: 8px; padding-top: 8px; margin-bottom: 0;") {{ record.title }}
                p(style="margin-left: 8px; font-size: 10px; color: rgba(255, 255, 255, 0.3);") {{ 'ID: ' + record.uid }}
              div
                a-button(class="icon-button")
                  font-awesome-icon(:icon="['fas', 'download']" fixed-width)
                a-button(class="icon-button")
                  font-awesome-icon(:icon="['fas', 'edit']" fixed-width)
                a-button(class="icon-button")
                  font-awesome-icon(:icon="['fas', 'trash']" fixed-width)
        template(v-slot:unlisted="unlisted")
          a.ant-dropdown-link(href="#" @click="showChangeVisibilityModel")
            span {{ unlisted ? "Unlisted" : "Public" }}
              font-awesome-icon(:icon="['fas', 'caret-down']" fixed-width)
        template(v-slot:creation_date="creation_date") {{ creation_date }}
        template(v-slot:rating="rating")
          div(style="display: flex;")
            font-awesome-icon(:icon="['fas', 'star']" fixed-width style="margin-top: 2px; margin-right: 4px;")
            span(style="white-space: nowrap;") {{ (Math.floor(10 * 0.5 * 100) / 100).toFixed(2) + ' (' + 27 + ')' }}
        template(v-slot:downloads="downloads") {{ downloads }}
        template(v-slot:plays="plays") {{ plays }}
</template>

<script>
import UploadLevel from '@/components/studio/UploadLevel'
export default {
  components: {
    UploadLevel,
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
        dataIndex: 'unlisted',
        scopedSlots: {
          customRender: 'unlisted'
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
        dataIndex: 'creation_date',
        scopedSlots: {
          customRender: 'creation_date'
        }
      },
    ]
    return {
      levels: [],
      levels_pagination: {
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `${total} levels (${range})`,
        current: 1,
      },
      levels_loading: false,
      change_visibility_modal_visible: false,
      change_visibility_value: null,
      columns
    }
  },
  mounted() {
    this.fetchLevels()
  },
  methods: {
    showChangeVisibilityModel() {
      this.change_visibility_modal_visible = true
    },
    changeVisibility() {
      // TODO: API request
      this.change_visibility_modal_visible = false
    },
    handleTableChange(pagination, filters, sorter) {
      this.levels_pagination = pagination
      this.fetchLevels()
    },
    fetchLevels() {
      this.levels_loading = true
      this.$axios.get(`/levels`, { params: {
        // uploader: this.$auth.user.id,
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
