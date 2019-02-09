<template lang="pug">
nav.navbar.is-transparent(role='navigation', aria-label='main navigation')
  .container
    .navbar-brand
      nuxt-link.navbar-item(to="/") Cytoid
      .navbar-burger
        span
        span
        span
    .navbar-menu
      .navbar-start
        nuxt-link.navbar-item(to="/levels") Levels
      .navbar-end
        span.navbar-item.has-dropdown.is-hoverable
          span.navbar-link Me
          .navbar-dropdown.is-right.is-boxed
            a.navbar-item Profile
            a.navbar-item Favorites
            hr.navbar-divider
            a.navbar-item Create Levels
            a.navbar-item Create Collections
            hr.navbar-divider
            a.navbar-item Settings
            a.navbar-item Logout
</template>
