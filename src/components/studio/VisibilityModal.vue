<template lang="pug">
a-modal(
  :title="title"
  v-model="modalVisible"
  v-if="level && modalVisible"
  :closable="false"
)
  p(v-if="value === 0").
    This level will be visible to everybody.
    #[br]#[br]
    The level will appear in search results and in your profile page.
    As a result, please be aware of the copyright implications of this action.
    It will be helpful to review our #[a(href="#") Terms & Services]
    and #[a(href="#") Community Guidelines] before you proceed.
  p(v-else-if="value === 1").
    This level will only visible to anybody who has the link.
    #[br]#[br]
    #[b(v-text="level.title")] will no longer appear
    to viewers who visit the level listing or your profile.
    It will also disappear from the search results.
    However, it will stay visible in a public collection that contains this level.
  p(v-else-if="value === 2").
    This video will be only visible to you.
    #[br]#[br]
    #[b(v-text="level.title")] will be removed from your profile page
    and all search results. It will stay in a public collection if it's already been added,
    but the other players will not be able to check the details of the level.
    Only you can see or download the level.
  p Please input the uid of the level #[b(v-text="level.uid")] to proceed
  action-confirm(
    slot="footer"
    :value="level.uid"
    :button-title="['Publish', 'Unlist', 'Make Private'][value]"
    :button-type="['primary', 'dashed', 'danger'][value]"
  )
</template>

<script>
import ActionConfirm from './ActionConfirm'
export default {
  name: 'VisibilityModal',
  components: { ActionConfirm },
  data: () => ({
    modalVisible: false,
    level: null,
    value: null,
  }),
  computed: {
    title() {
      const title = this.level.title
      return [
        'Make ' + title + ' public',
        `Make ${title} unlisted`,
        `Make ${title} private`
      ][this.value]
    },
  },
  methods: {
    show(level, visibility) {
      this.level = level
      this.value = visibility
      this.modalVisible = true
    }
  },
}
</script>
