<template lang="pug">
.category-badge.b-tooltip(v-if="category") {{ category }}
</template>

<script>
export default {
  props: {
    category: {
      type: String,
      require: false,
    }
  }
}
</script>

<style>
.category-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.3rem;
  max-height: 2.3rem;
  color: white;
  font-weight: bold;
  border-radius: 2.3rem;
  padding: 0 1rem;
  z-index: 10;
  user-select: none;
}
.category-badge.qualified {
  background: linear-gradient(to right bottom, #4a9386, #8d95bb);
}
.category-badge.featured {
  background: linear-gradient(to right bottom, #b91d73, #f953c6);
}
</style>