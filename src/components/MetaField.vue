<template functional>
  <div class="meta-field-container">
    <div class="heading" v-text="props.label" />
    <b-field grouped>
      <b-field label="Name" label-position="on-border" expanded>
        <b-input :value="props.value.name" />
      </b-field>
      <b-field label="Localized name" label-position="on-border" expanded>
        <b-input :value="props.value.localized_name" />
      </b-field>
    </b-field>
    <b-field label="Source URL" label-position="on-border" expanded>
      <b-input :value="props.value.url" />
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'MetaField',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.meta-field-container {
  background-color: $grey-light;
  border-radius: $radius;
  padding: 1rem;
  .heading {
    margin-bottom: 1rem;
  }
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>
