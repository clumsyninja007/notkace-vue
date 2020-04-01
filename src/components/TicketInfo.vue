<template>
  <div class="container">
    <div
      class="tile is-ancestor"
      style="white-space: pre-line; word-break: break-word"
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
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helpers from '@/mixins/helpers';

@Component
export default class TicketInfo extends mixins(Helpers) {
  @Prop()
  public ticket!: string;

  public ticketInfo: any = {};
  public loading = false;

  public getTicketInfo() {
    this.loading = true;
    this.$store
      .dispatch('getTicketInfo', this.ticket)
      .then((result) => {
        this.ticketInfo = result;
      })
      .then(() => (this.loading = false))
      .catch((error) => this.errorMessage(error));
  }

  public created() {
    this.getTicketInfo();
  }
}
</script>
