<template>
  <div id="app">
    <!--<router-view />-->
    <home></home>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Home from './views/Home.vue';

@Component({
  components: { Home },
})
export default class App extends Vue {}
</script>

<style lang="scss">
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

// Import Bulma's core
@import '~bulma/sass/utilities/_all';

// Set your colors
$primary: #4de4f4;
$primary-invert: findColorInvert($primary);
$orange: orange;
$orange-invert: findColorInvert($orange);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  'white': (
    $white,
    $black,
  ),
  'black': (
    $black,
    $white,
  ),
  'light': (
    $light,
    $light-invert,
  ),
  'dark': (
    $dark,
    $dark-invert,
  ),
  'primary': (
    $primary,
    $primary-invert,
  ),
  'info': (
    $info,
    $info-invert,
  ),
  'success': (
    $success,
    $success-invert,
  ),
  'warning': (
    $warning,
    $warning-invert,
  ),
  'danger': (
    $danger,
    $danger-invert,
  ),
  'orange': (
    $orange,
    $orange-invert,
  ),
);

$background: #333;
$text: #eaeaea;
$body-background-color: $background;
$strong-color: $text;

// Tables
$table-background-color: $background;
$table-striped-row-even-background-color: #444;
$table-color: $text;
$table-head-cell-color: $text;
$table-cell-border: 1px solid black;
$table-row-hover-background-color: #555;
$table-striped-row-even-hover-background-color: #555;
$table-foot-cell-color: $text;

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Boxes
$box-background-color: $background;
$box-color: $text;

// Titles
$title-color: $text;
$subtitle-color: $text;

// Form
$label-color: $text;

// Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';
</style>
