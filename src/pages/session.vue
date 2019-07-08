<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :xs="{span: 0}" :lg="{span: 8}" />
      <a-col :xs="{span: 24}" :lg="{span: 16}" style="padding: 24px; max-width: 400px">
        <a-card :bordered="false" class="ele2 session-card" style="width: 100%;">
          <!-- TODO: Refactor this shit lol -->
          <div
            style="
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            border-radius: 4px;
                            background: linear-gradient(to left, #B06AB3, #4568DC);
                            "
          />
          <div
            style="
                            position: absolute;
                            bottom: 67%;
                            width: 100%;
                            height: 33%;
                            background: linear-gradient(to top, hsla(226, 15%, 19%, 1), rgba(0,0,0,0) 100%);
                            border-radius: 4px 4px 0 0;
                            "
          />
          <div
            style="
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            height: 67%;
                            border-radius: 0 0 4px 4px;
                            background: hsla(226, 15%, 19%, 1);
                            "
          />
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
</style>
