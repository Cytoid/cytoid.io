<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :xs="{span: 0}" :lg="{span: 8}" />
      <a-col :xs="{span: 24}" :lg="{span: 16}" style="padding: 24px; max-width: 400px">
        <a-card :bordered="false" class="ele2" style="width: 100%;">
          <login />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Login from '@/components/auth/Login'
export default {
  data() {
    return {
      currentSessionComponent: 'sign-in-form'
    }
  },
  components: {
    Login,
  }
}
</script>
