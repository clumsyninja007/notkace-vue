<template>
  <div id="app">
    <loading v-if="$store.state.loading"></loading>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';

@Component({
  components: { Loading },
})
export default class App extends Vue {}
</script>

<style lang="scss">
html {
  scrollbar-width: thin;
  scrollbar-color: rgb(134, 134, 134) rgb(97, 97, 97);
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

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
  margin: 0;
  background-color: #333;
  color: #fff;

  a {
    color: #4de4f4;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  h1, h3, p {
    margin-left: 1vw;
  }

  h3 {
    margin-top: 3px;
    margin-bottom: 3px;
  }

  button {
    cursor: pointer;
    margin-left: 1vw;
    margin-bottom: 1rem;
    color: #444;
    border: 1px solid #4de4f4;
    background-color: #4de4f4;
    border-radius: 2px;
    padding: 0.355rem 1rem 0.355rem 1rem;
    vertical-align: middle;
    box-shadow: inset 0 0 0 transparent;

    &:focus {
      outline: 1px dotted #aaa;
      outline-offset: 1px;
    }

    &:hover {
      color: #4de4f4;
      background-color: #444;
      border: 1px solid #444;
    }

    &:disabled {
      background-color: rgba(77, 228, 244, 0.65);
      color: #444;
      border: 1px solid #444;
      border-radius: 2px;
      cursor: default;
    }
  }

  select,
  input {
    border: 1px solid #000;
    background: #444;
    color: #ddd;
    padding: 5px 20px 5px 10px;
    line-height: 22px;
    margin: 0.3rem;
    vertical-align: middle;
    appearance: none;

    &:focus {
      box-shadow: 0 0 3px #4de4f4;
      outline: none;
    }
  }

  select {
    background: url(assets/down_arrow.png) no-repeat 99% 50% #444;

    &:focus {
      background: url(assets/up_arrow.png) no-repeat 99% 50% #444;
    }

    option {
      box-sizing: border-box;
    }
  }
}

@media screen and (max-width: 768px) {
  .notices {
    padding: 0;
    position: fixed !important;
  }
}
</style>
