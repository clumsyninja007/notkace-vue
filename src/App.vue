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
@use 'sass:math';
@use 'bulma/sass' with (
  $primary: #4de4f4,
  // the old theme set $link to $primary; Bulma 1 also derives the select arrow
  // and the focus ring from it, so leaving it default turned both blue
  $link: #4de4f4,
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
  --bulma-text-l: 91.8%; // #eaeaea
  --bulma-table-row-hover-background-color: #555;
  --bulma-table-striped-row-even-hover-background-color: #555;
  --bulma-table-cell-border-color: black;
}

// Bulma 1.0 removed the .tile grid, which this app's layouts are built on
// (Home's summary panel and the ticket detail panel). Ported from Bulma 0.9.4
// sass/grid/tiles.sass so the existing markup keeps working.
$tile-spacing: 0.75rem;

.tile {
  align-items: stretch;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: min-content;

  &.is-ancestor {
    margin-left: -$tile-spacing;
    margin-right: -$tile-spacing;
    margin-top: -$tile-spacing;

    &:last-child {
      margin-bottom: -$tile-spacing;
    }

    &:not(:last-child) {
      margin-bottom: $tile-spacing;
    }
  }

  &.is-child {
    margin: 0 !important;
  }

  &.is-parent {
    padding: $tile-spacing;
  }

  &.is-vertical {
    flex-direction: column;

    & > .tile.is-child:not(:last-child) {
      margin-bottom: 1.5rem !important;
    }
  }

  @media screen and (min-width: 769px) {
    &:not(.is-child) {
      display: flex;
    }

    @for $i from 1 through 12 {
      &.is-#{$i} {
        flex: none;
        width: math.div($i, 12) * 100%;
      }
    }
  }
}

// Bulma 1 dropped the generic a:hover colour that 0.9 had. Components that
// style their own hover (buttons, navbar, pagination) are left alone.
a:hover:not(.button):not(.navbar-item):not(.dropdown-item):not(.pagination-link):not(.pagination-previous):not(.pagination-next) {
  color: var(--bulma-link-text-hover);
}

// Buefy positions the sort arrow absolutely at the right edge of .th-wrap, so a
// wide or centred label can run underneath it. Reserve room for the icon.
.b-table .table th.is-sortable .th-wrap {
  &:not(.is-numeric) {
    padding-right: 1.5rem;
  }

  &.is-numeric {
    padding-left: 1.5rem;
  }
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
