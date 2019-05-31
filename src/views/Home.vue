<template>
  <div class="home">
    <params-form></params-form>
    <div class="content">
      <div style="float: left">
        <h1>Service Requests</h1>
        <h3
          v-if="
            $store.state.selectedAssignee &&
              $store.state.selectedAssignee !== '*'
          "
        >
          Assignee: {{ $store.getters.getAssigneeName }}
        </h3>
        <h3
          v-if="
            $store.state.selectedSoftware &&
              $store.state.selectedSoftware !== '*'
          "
        >
          Asset: {{ $store.state.selectedSoftware }}
        </h3>
        <h3
          v-if="
            $store.state.selectedReferredTo &&
              $store.state.selectedReferredTo !== '*'
          "
        >
          Referred To: {{ $store.state.selectedReferredTo }}
        </h3>
        <h3
          v-if="
            $store.state.selectedDepartment &&
              $store.state.selectedDepartment !== '*'
          "
        >
          Department: {{ $store.state.selectedDepartment }}
        </h3>
        <h3
          v-if="
            $store.state.selectedLocation &&
              $store.state.selectedLocation !== '*'
          "
        >
          Location: {{ $store.state.selectedLocation }}
        </h3>
        <p>Ticket Count: {{ $store.state.rows.length }}</p>
        <button @click="refresh">Refresh Table</button>
      </div>
      <div style="float: right;">
        <!--<img v-if="img === 0" src="@/assets/gangnam_0.gif" width="500" />
        <img v-if="img === 1" src="@/assets/gangnam_1.gif" width="500" />
        <img v-if="img === 2" src="@/assets/gangnam_2.gif" width="500" />-->
        <img src="@/assets/countySeal.png" width="150" style="margin-right: 1vw" />
      </div>
      <ticket-table></ticket-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TicketTable from '@/components/TicketTable.vue';
import ParamsForm from '@/components/ParamsForm.vue';

@Component({
  components: { TicketTable, ParamsForm },
})
export default class Home extends Vue {
  // public img = 0;

  public refresh() {
    this.$store.dispatch('getTickets').catch((error) => console.log(error));
  }

  /*public getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }*/

  /*public mounted() {
    this.img = this.getRandomInt(0, 2);
  }*/
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 50px;
  padding-top: 1em;

  h1 {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
