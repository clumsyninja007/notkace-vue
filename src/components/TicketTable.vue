<template>
  <data-table
    :dataSource="$store.state.rows"
    :columns="columns"
    :expandable="true"
  >
    <template #ticket="slotProps">
      <a
        :href="
          'https://cty-k1k.co.humboldt.ca.us/adminui/ticket?ID=' +
            slotProps.row.Ticket
        "
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ slotProps.row.Ticket }}
      </a>
    </template>
    <template #priority="slotProps">
      <span :class="slotProps.row.Priority.toLowerCase()">{{
        slotProps.row.Priority
      }}</span>
    </template>
    <template #dept="slotProps">
      {{ getDept(slotProps.row.Dept) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataTable from '@/components/DataTable.vue';

@Component({
  components: { DataTable },
})
export default class TicketTable extends Vue {
  get columns() {
    let columns = [
      {
        title: 'Ticket #',
        dataIndex: 'Ticket',
        sorter: true,
        width: '75px',
        customRender: 'ticket',
      },
      {
        title: 'Priority',
        dataIndex: 'Priority',
        sorter: 'priOrd',
        width: '85px',
        customRender: 'priority',
      },
      {
        title: 'Brief Description',
        dataIndex: 'Title',
        sorter: true,
        align: 'left',
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        sorter: 'statOrd',
      },
      {
        title: 'Assignee',
        dataIndex: 'Owner',
        sorter: true,
      },
      {
        title: 'Customer',
        dataIndex: 'Submitter',
        sorter: true,
      },
      {
        title: 'Department',
        dataIndex: 'Dept',
        sorter: true,
        customRender: 'dept',
      },
      {
        title: 'Asset',
        dataIndex: 'Asset',
        sorter: true,
      },
      {
        title: 'Referred To',
        dataIndex: 'ReferredTo',
        sorter: true,
      },
    ];

    if (
      this.$store.state.selectedAssignee &&
      this.$store.state.selectedAssignee !== '*'
    ) {
      columns = columns.filter((column) => column.title !== 'Assignee');
    }
    if (
      this.$store.state.selectedSoftware &&
      this.$store.state.selectedSoftware !== '*'
    ) {
      columns = columns.filter((column) => column.title !== 'Asset');
    }
    if (
      this.$store.state.selectedReferredTo &&
      this.$store.state.selectedReferredTo !== '*'
    ) {
      columns = columns.filter((column) => column.title !== 'Referred To');
    }
    if (
      this.$store.state.selectedDepartment &&
      this.$store.state.selectedDepartment !== '*'
    ) {
      columns = columns.filter((column) => column.title !== 'Department');
    }
    if (
      this.$store.state.selectedLocation &&
      this.$store.state.selectedLocation !== '*'
    ) {
      columns = columns.filter((column) => column.title !== 'Location');
    }

    return columns;
  }

  public getDept(rowName: string) {
    if (rowName.indexOf(' [') > 0) {
      return rowName.slice(0, rowName.indexOf('[')).trim();
    }
    return rowName.trim();
  }

  public mounted() {
    this.$store.dispatch('setParams').catch((error) => console.log(error));

    this.$store.dispatch('getTickets').catch((error) => console.log(error));
  }
}
</script>
