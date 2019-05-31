<template>
  <table class="comment-table">
    <loading v-if="loading" :localLoader="true"></loading>
    <tr>
      <td>
        <b>Long Description:</b>
      </td>
      <td></td>
      <td>
        <b>Last Comment:</b>
      </td>
    </tr>
    <tr>
      <td class="formatted">{{ ticketInfo.Summary }}</td>
      <td></td>
      <td class="formatted">
        <span class="no-wrap">{{
          ticketInfo.Commenter + ' ' + fixDate(ticketInfo.Timestamp)
        }}</span
        ><br />{{ ticketInfo.Comment }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';

@Component({
  components: { Loading },
})
export default class TicketInfo extends Vue {
  @Prop()
  public ticket!: string;

  public ticketInfo = {};
  public loading = false;

  public getTicketInfo() {
    this.loading = true;
    this.$store
      .dispatch('getTicketInfo', this.ticket)
      .then((result) => (this.ticketInfo = result))
      .then(() => (this.loading = false))
      .catch((error) => console.log(error));
  }

  public fixDate(date: any) {
    const commentDate = new Date(date);

    let hour;
    let amPm;

    if (commentDate.getHours() > 12) {
      hour = commentDate.getHours() - 12;
      amPm = 'PM';
    } else if (commentDate.getHours() === 12) {
      hour = 12;
      amPm = 'PM';
    } else if (commentDate.getHours() === 0) {
      hour = 12;
      amPm = 'AM';
    } else {
      hour = commentDate.getHours();
      amPm = 'AM';
    }

    return (
      commentDate.getMonth() +
      1 +
      '/' +
      commentDate.getDate() +
      '/' +
      commentDate.getFullYear() +
      ' ' +
      String(hour) +
      ':' +
      ('0' + commentDate.getMinutes()).slice(-2) +
      ' ' +
      amPm
    );
  }

  public mounted() {
    this.getTicketInfo();
  }
}
</script>

<style lang="scss" scoped>
.comment-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  position: relative;
  display: inline-block;

  .no-wrap {
    white-space: nowrap;
  }

  .formatted {
    white-space: pre-wrap;
    vertical-align: text-top;
  }
}
</style>
