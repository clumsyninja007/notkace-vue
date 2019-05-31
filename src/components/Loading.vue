<template>
  <div class="loading" :class="localLoader ? 'local' : ''">
    <i class="fas fa-spinner fa-spin" :class="localLoader ? 'local' : ''"></i>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Loading extends Vue {
  @Prop({ default: false })
  public localLoader?: boolean;
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 10;

  &.local {
    position: absolute;
    height: 100%;
  }

  i {
    font-size: 3em;
    position: fixed;
    top: 50%;
    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, -50%);

    &.local {
      position: inherit;
    }
  }
}
</style>
