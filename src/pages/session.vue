<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :xs="{span: 0}" :lg="{span: 8}" />
      <a-col :xs="{span: 24}" :lg="{span: 16}" style="padding: 24px; max-width: 400px">
        <a-card :bordered="false" class="ele2" style="width: 100%;">
          <div style="display:none">
            <sign-in />
          </div>
          <sign-up />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import SignIn from '@/components/session/SignIn'
import SignUp from '@/components/session/SignUp'
export default {
  components: {
    SignIn, SignUp
  },
  data() {
    return {
    }
  }
}
</script>
