<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style lang="scss">
// Bulma 1.x replaced the old Sass-variable theming with CSS custom properties,
// so the dark theme is now driven by data-theme="dark" on <html> (set in
// public/index.html) plus the --bulma-* overrides below. Sass @use rules must
// come first, which is why the scrollbar rules moved below the imports.
@use 'bulma/sass' with (
  $primary: #4de4f4,
  // 'orange' is a custom colour the old theme added to Bulma's $colors map;
  // TicketTable's priorityColor() returns 'has-text-orange' for Critical.
  $custom-colors: (
      'orange': (
        orange,
        #000,
      ),
    )
);
@use 'buefy/src/scss/buefy';

// Match the greys the old Bulma 0.9 theme hard-coded. Bulma 1 derives the
// striped-row and hover colours from scheme-main-bis, so hover is set on its
// own to keep the two distinct as they were before.
:root[data-theme='dark'] {
  --bulma-scheme-h: 0;
  --bulma-scheme-s: 0%;
  --bulma-scheme-main-l: 20%; // #333 body/table background
  --bulma-scheme-main-bis-l: 26.7%; // #444 striped even row
  --bulma-scheme-main-ter-l: 33.3%; // #555
  --bulma-text-l: 92%; // #eaeaea
  --bulma-table-row-hover-background-color: #555;
  --bulma-table-striped-row-even-hover-background-color: #555;
  --bulma-table-cell-border-color: black;
}

html {
  scrollbar-width: thin;
  scrollbar-color: rgb(90, 90, 90) rgb(75, 75, 75);
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: rgb(97, 97, 97);
}

::-webkit-scrollbar-thumb {
  background-color: rgb(134, 134, 134);
}
</style>
