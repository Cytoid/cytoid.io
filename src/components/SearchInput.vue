<template lang="pug">
a-auto-complete.search-input-container(
  @search="keyPressed"
  @select="itemSelected"
  :dataSource="data"
)
  .search-input(slot="default")
    button.icon(@click="submit" style="outline: none;")
      font-awesome-icon(:icon="['far', 'search']")
    input(type="search" autocomplete="off" v-model="searchKey" @keyup.enter.stop.prevent="submit")
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      data: null,
      searchKey: '',
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  methods: {
    keyPressed(key) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.$axios.get('/tags/full', {
          params: {
            search: key,
            limit: 5,
          }
        })
          .then((res) => {
            this.data = res.data.map(a => ({ value: a.uid, text: a.title }))
          })
      }, 300)
    },
    itemSelected(value) {
      this.$router.push({
        name: 'levels-id',
        params: { id: value },
      })
    },
    submit() {
      this.$router.push({
        name: 'levels',
        query: { search: this.searchKey }
      })
    }
  }
}
</script>

<style lang="scss">
$search-input-size: 2rem;
.search-input-container {
  margin-right: 1rem;
  .ant-select-selection {
    background: none;
  }
}
.search-input {
  position: relative;
  .icon {
    position: absolute;
    height: $search-input-size;
    width: $search-input-size;
    padding: $search-input-size / 4;
    right: 0;
    background: none;
    border: none;
    cursor: pointer;
  }
  input {
    background-color: hsla(226, 68%, 6%, 1);
    transition: 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    border: 1px solid transparent;
    &:hover, &:focus, &:active {
      background-color: hsla(226, 68%, 6%, 1);
      border: 1px solid #3e4045;
    }
    display: block;
    margin-left: auto;
    height: $search-input-size;
    border-radius: $search-input-size / 2;
    padding-left: $search-input-size / 2;
    padding-right: $search-input-size;
    width: 100%;
    @include mobile {
      &:not(:focus) {
        width: 0;
        padding-left: $search-input-size / 2;
        padding-right: $search-input-size / 2;
        cursor: pointer;
        background-color: $primary;
      }
    }
  }
}

</style>
