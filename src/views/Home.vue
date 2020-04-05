<template>
  <div class="home">
    <params-form></params-form>
    <section>
      <div class="container is-widescreen">
        <div class="tile is-ancestor is-flex-mobile">
          <div class="tile is-parent">
            <div
              style="margin-bottom: 0 !important"
              class="tile is-child box is-shadowless"
            >
              <h1 class="title">Service Requests</h1>
              <h2
                v-if="
                  $store.state.selectedAssignee &&
                    $store.state.selectedAssignee !== '*'
                "
                class="subtitle"
              >
                Assignee: {{ $store.getters.getAssigneeName }}
              </h2>
              <h2
                v-if="
                  $store.state.selectedSoftware &&
                    $store.state.selectedSoftware !== '*'
                "
                class="subtitle"
              >
                Asset: {{ $store.state.selectedSoftware }}
              </h2>
              <h2
                v-if="
                  $store.state.selectedReferredTo &&
                    $store.state.selectedReferredTo !== '*'
                "
                class="subtitle"
              >
                Referred To: {{ $store.state.selectedReferredTo }}
              </h2>
              <h2
                v-if="
                  $store.state.selectedDepartment &&
                    $store.state.selectedDepartment !== '*'
                "
                class="subtitle"
              >
                Department: {{ $store.state.selectedDepartment }}
              </h2>
              <h2
                v-if="
                  $store.state.selectedLocation &&
                    $store.state.selectedLocation !== '*'
                "
                class="subtitle"
              >
                Location: {{ $store.state.selectedLocation }}
              </h2>
              <p is-marginless>Ticket Count: {{ $store.state.total }}</p>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child box is-shadowless"></div>
          </div>
        </div>
      </div>
    </section>
    <ticket-table></ticket-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TicketTable from '@/components/TicketTable.vue';
import ParamsForm from '@/components/ParamsForm.vue';

@Component({
  components: { TicketTable, ParamsForm },
})
export default class Home extends Vue {}
</script>
