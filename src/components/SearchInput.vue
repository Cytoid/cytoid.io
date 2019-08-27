<template lang="pug">
  div
    a-auto-complete.search-input-container(
      @search="keyPressed"
      @select="itemSelected"
      :dataSource="data"
    )
      .search-input(slot="default")
        button.icon(@click="submit" style="outline: none;")
          font-awesome-icon(:icon="['fas', 'search']")
        input(type="search" autocomplete="off" v-model="searchKey" @keyup.enter.stop.prevent="submit")
    a-button.search-button(
      @click="handleSearchButton"
    )
      font-awesome-icon(:icon="['fas', 'search']")
    .fullscreen-search-overlay(v-show="overlay" @click="handleOverlay")
      .fullscreen-search-container
        a-card(class="ele3 gradient-card fullscreen-search-card" style="margin-bottom: 16px;" @click.stop="handleSearchButton")
          button.close-button(@click.stop="handleOverlay")
            font-awesome-icon(:icon="['fas', 'times']")
          p.card-heading(style="color: hsla(226, 68%, 77%, 1);") Search
          a-auto-complete.fullscreen-search-input-container(
            @search="keyPressed"
            @select="itemSelected"
            :dataSource="data"
          )
            .fullscreen-search-input(slot="default")
              button.icon(@click="submit" style="outline: none;")
                font-awesome-icon(:icon="['fas', 'search']")
              input(type="search" autocomplete="off" v-model="searchKey" @keyup.enter.stop.prevent="submit")
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      data: null,
      searchKey: '',
      overlay: false
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  methods: {
    handleSearchButton() {
      this.overlay = true
      console.log('opened')
    },
    handleOverlay() {
      this.overlay = false
      console.log('closed')
    },
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
      this.overlay = false
      this.$router.push({
        name: 'levels-id',
        params: { id: value },
      })
    },
    submit() {
      this.overlay = false
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
$theme: hsla(226, 68%, 77%, 1);
.search-input-container {
  margin-right: 1rem;
  .ant-select-selection {
    background: none;
  }
  @include mobile {
    display: none;
  }
}
.fullscreen-search-input-container {
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
    background-color: hsla(226, 68%, 6%, 0.7);
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
      display: none;
    }
  }
}
.fullscreen-search-input {
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
    color: $theme;
  }
  input {
    background-color: transparent;
    transition: 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    border: none;
    border-bottom: 2px solid $theme;
    display: block;
    margin-left: auto;
    height: $search-input-size;
    padding-left: 0px;
    padding-right: 0px;
    width: 384px;
    color: $theme;
  }
}
.search-button {
  position: relative;
  margin-right: 8px;
  @include tablet {
    display: none;
  }
}
.fullscreen-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 128;
  background: hsla(226, 68%, 6%, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  @include tablet {
    display: none;
  }
}
.fullscreen-search-container {
  position: relative;
  margin: auto;
  width: fit-content;
  height: fit-content;
  pointer-events: all;
}
.fullscreen-search-card {
  padding: 16px;
  background: white;
  color: $theme;
}
</style>

<style lang="less" scoped>
  .close-button {
    position: absolute;
    top: -18px;
    right: 18px;
    width: 36px;
    height: 36px;
    box-shadow: @ele4;
    border-radius: 50%;
    background: @theme6;
    color: white;
    font-size: 16px;
    padding: 0;
    border: none;
    outline: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      transform: scale(1.1, 1.1);
    }
    &:active {
      transform: scale(0.95, 0.95);
    }
    transition: 0.4s @hoverEasing;
  }
</style>
