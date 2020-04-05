<template>
  <div class="container">
    <div
      class="tile is-ancestor"
      style="white-space: pre-line; word-break: break-word"
      v-if="!loading"
    >
      <div class="tile is-parent">
        <div class="tile is-child">
          <h2 class="title is-4">Long Description</h2>
          <p style="white-space: pre-line;">
            {{ ticketInfo.summary }}
          </p>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child">
          <h2 class="title is-4">Last Comment</h2>
          <h3 class="subtitle is-6">
            {{ ticketInfo.commenter }} {{ fixDateTime(ticketInfo.timestamp) }}
          </h3>
          <p class="content" v-html="ticketInfo.comment"></p>
        </div>
      </div>
    </div>
    <b-loading :active.sync="loading" :is-full-page="false"></b-loading>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helpers from '@/mixins/helpers';
import { mapActions } from 'vuex';

@Component({
  methods: { ...mapActions(['getTicketInfo']) },
})
export default class TicketInfo extends mixins(Helpers) {
  @Prop()
  ticket!: number;

  // mapped actions
  getTicketInfo!: (ticket: number) => TicketInfo;

  ticketInfo!: TicketInfo;
  loading = false;

  async created() {
    this.loading = true;

    try {
      this.ticketInfo = await this.getTicketInfo(this.ticket);
    } catch (e) {
      this.errorMessage(e);
    }

    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 50px;
}
</style>
