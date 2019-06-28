<template lang="pug">
.section
  a-card(title="Password")
    a-form-item(label="Password" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }")
      a-input(placeholder="Old Password")
    a-form-item(label="New Password" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }")
      a-input(placeholder="New Password")
      a-input(placeholder="Password Confirm")
</template>

<script>
export default {
  name: 'Security',
}
</script>
