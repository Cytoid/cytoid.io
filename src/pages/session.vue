<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :xs="{span: 0}" :lg="{span: 8}" />
      <a-col :xs="{span: 24}" :lg="{span: 16}" style="padding: 24px; max-width: 400px">
        <a-card :bordered="false" class="ele2 session-card" style="width: 100%;">
          <nuxt-child style="position:relative;z-index:1;padding:24px;" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  layout: 'background',
  background: require('@/assets/images/dark.png'),
}
</script>

<style lang="less">
  .session-card .ant-card-body {
    padding: 0;
  }
  .session-card {
    background: linear-gradient(to top, hsla(226, 15%, 19%, 1) 66%, rgba(0,0,0,0)), linear-gradient(to left, #B06AB3, #4568DC);
  }
</style>
