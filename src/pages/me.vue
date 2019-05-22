<template lang="pug">
  a-row
    a-col(:span="8")
      a-menu
        a-menu-item 菜单项
        a-sub-menu(title="子菜单")
          a-menu-item 子菜单项
    a-col(:span="16")
      nuxt
</template>

<script>
export default {
}
</script>

<style scoped>

</style>
