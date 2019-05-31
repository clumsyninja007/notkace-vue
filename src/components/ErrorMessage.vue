<template>
  <div class="error" v-if="error">ERROR</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ErrorMessage extends Vue {
  public error = false;

  public delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public showError() {
    this.error = true;

    this.delay(5000).then(() => (this.error = false));
  }

  public mounted() {
    this.showError();
  }
}
</script>

<style lang="scss" scoped>
.error {
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translate(-50%, -50%);
  animation: 1.5s ease-in slide_in, 1s linear 4s phase_out;

  background-color: rgba(255, 0, 0, 0.91);
  padding: 10px 50px;
  border-radius: 25px;
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.5);
}

@keyframes slide_in {
  from {
    bottom: -50px;
  }
  to {
    bottom: 50px;
  }
}

@keyframes phase_out {
  from {
    opacity: 100%;
  }
  to {
    opacity: 0;
  }
}
</style>
