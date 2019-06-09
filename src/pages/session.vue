<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :xs="{span: 0}" :lg="{span: 8}" />
      <a-col :xs="{span: 24}" :lg="{span: 16}" style="padding: 24px; max-width: 400px">
        <a-card :bordered="false" class="ele2" style="width: 100%;">
          <nuxt-child />
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
