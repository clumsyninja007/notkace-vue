<template>
  <div class="container">
    <div
      class="tile is-ancestor"
      style="white-space: pre-line; word-break: break-word"
      v-if="!loading && ticketInfo"
    >
      <div class="tile is-parent">
        <div class="tile is-child">
          <h2 class="title is-4">Long Description</h2>
          <p style="white-space: pre-line">
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
    <b-loading v-model="loading" :is-full-page="false"></b-loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import Helpers from '@/mixins/helpers';
import { mapActions } from 'vuex';
import type TicketInfoModel from '@/models/TicketInfo';

export default defineComponent({
  name: 'TicketInfo',
  mixins: [Helpers],
  props: {
    ticket: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  data() {
    return {
      ticketInfo: null as TicketInfoModel | null,
      loading: false,
    };
  },
  methods: {
    ...mapActions(['getTicketInfo']),
  },
  async created() {
    this.loading = true;

    try {
      this.ticketInfo = await this.getTicketInfo(this.ticket);
    } catch (e) {
      this.errorMessage(e);
    }

    this.loading = false;
  },
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 50px;
}
</style>
