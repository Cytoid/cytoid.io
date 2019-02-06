<template>
  <div>
    <div id="background-container">
      <img src="~assets/background.png">
      <div id="background-fadein-overlay" />
    </div>
    <nav
      class="navbar is-transparent"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="container">
        <div class="navbar-brand">
          <a
            class="navbar-item"
            href="/"
          >
            Cytoid
          </a>

          <div class="navbar-burger">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">
              Levels
            </a>
          </div>

          <div class="navbar-end">
            <a class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Me
              </a>
              <div class="navbar-dropdown is-right is-boxed">
                <a class="navbar-item">
                  Profile
                </a>
                <a class="navbar-item">
                  Favorites
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item">
                  Create Levels
                </a>
                <a class="navbar-item">
                  Create Collections
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item">
                  Settings
                </a>
                <a class="navbar-item">
                  Logout
                </a>
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
#background-container {
  overflow: hidden;
  z-index: -128;
  height: 100%;
  width: 100%;
  position: absolute;
  #background-fadein-overlay {
    position: absolute;
    bottom: -25%;
    width: 100%;
    height: 75%;
    background: linear-gradient(to top, $background, rgba(0, 0, 0, 0));
  }
}
</style>
