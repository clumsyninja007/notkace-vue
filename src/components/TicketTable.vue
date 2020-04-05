<template>
  <section>
    <div class="container is-fullhd">
      <b-table
        :data="rows"
        :loading="loading"
        paginated
        backend-pagination
        :total="total"
        :per-page="perPage"
        :current-page.sync="currPage"
        @page-change="onPageChange"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        hoverable
        striped
        backend-sorting
        :default-sort="defaultSort"
        @sort="onSort"
        detailed
        show-detail-icon
      >
        <template slot-scope="props">
          <b-table-column
            field="ticket"
            label="Ticket #"
            width="81"
            numeric
            sortable
            centered
            :visible="!excludedColumns.includes('ticket')"
          >
            <a
              :href="
                'https://nokace.archerharmony.com/ticket?ID=' + props.row.ticket
              "
              target="_blank"
              rel="noopener nofollow"
            >
              {{ props.row.ticket }}
            </a>
          </b-table-column>

          <b-table-column
            field="priority"
            label="Priority"
            sortable
            centered
            :visible="!excludedColumns.includes('priority')"
          >
            <span :class="priorityColor(props.row.priority)">
              {{ props.row.priority }}
            </span>
          </b-table-column>

          <b-table-column
            field="title"
            label="Brief Description"
            sortable
            :visible="!excludedColumns.includes('title')"
          >
            {{ props.row.title }}
          </b-table-column>

          <b-table-column
            field="status"
            label="Status"
            sortable
            centered
            :visible="!excludedColumns.includes('status')"
          >
            {{ props.row.status }}
          </b-table-column>

          <b-table-column
            field="owner"
            label="Assignee"
            sortable
            centered
            :visible="
              !excludedColumns.includes('owner') && selectedAssignee === '*'
            "
          >
            {{ props.row.owner }}
          </b-table-column>

          <b-table-column
            field="submitter"
            label="Customer"
            sortable
            centered
            :visible="!excludedColumns.includes('submitter')"
          >
            {{ props.row.submitter }}
          </b-table-column>

          <b-table-column
            field="dept"
            label="Department"
            sortable
            centered
            :visible="
              !excludedColumns.includes('dept') && selectedDepartment === '*'
            "
          >
            {{ getDept(props.row.dept) }}
          </b-table-column>

          <b-table-column
            field="location"
            label="Location"
            sortable
            centered
            :visible="
              !excludedColumns.includes('location') && selectedLocation === '*'
            "
          >
            {{ props.row.location }}
          </b-table-column>

          <b-table-column
            field="asset"
            label="Asset"
            sortable
            centered
            :visible="
              !excludedColumns.includes('asset') && selectedSoftware === '*'
            "
          >
            {{ props.row.Asset }}
          </b-table-column>

          <b-table-column
            field="referredTo"
            label="Referred To"
            sortable
            centered
            :visible="
              !excludedColumns.includes('referredTo') &&
                selectedReferredTo === '*'
            "
          >
            {{ props.row.referredTo }}
          </b-table-column>

          <b-table-column
            field="created"
            label="Create Date"
            sortable
            centered
            :visible="!excludedColumns.includes('created')"
          >
            {{ fixDate(props.row.created) }}
          </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <ticket-info :ticket="props.row.ticket"></ticket-info>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
              </p>
              <p>Nothing here.</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helpers from '@/mixins/helpers';
import TicketInfo from '@/components/TicketInfo.vue';
import { mapActions, mapState } from 'vuex';
import TicketRow from '../models/TicketRow';

@Component({
  components: { TicketInfo },
  computed: {
    ...mapState([
      'selectedAssignee',
      'selectedDepartment',
      'selectedLocation',
      'selectedSoftware',
      'selectedReferredTo',
      'rows',
      'loading',
      'total',
      'perPage',
      'currPage',
      'excludedColumns',
    ]),
  },
  methods: {
    ...mapActions(['changePage', 'changeSort', 'getTickets', 'setParams']),
  },
})
export default class TicketTable extends mixins(Helpers) {
  // mapped state
  selectedAssignee!: string;
  selectedDepartment!: string;
  selectedLocation!: string;
  selectedSoftware!: string;
  selectedReferredTo!: string;
  rows!: TicketRow[];
  loading!: boolean;
  total!: number;
  perPage!: number;
  currPage!: number;
  excludedColumns!: string[];
  // mapped actions
  changePage!: (page: number) => void;
  changeSort!: (sort: string) => void;
  getTickets!: () => void;
  setParams!: () => void;

  // methods
  get defaultSort() {
    if (this.selectedAssignee === '*') {
      return 'owner';
    }
    return 'priority';
  }

  // Departments are stored in Kace with their budget units in [] brackets
  // I don't want to see these, so I'm stripping them here
  getDept(rowName: string) {
    if (rowName.indexOf(' [') > 0) {
      return rowName.slice(0, rowName.indexOf('[')).trim();
    }
    return rowName.trim();
  }

  // used for adding a class to Priority tags in order to color them appropriately
  priorityColor(color: string) {
    switch (color.toLowerCase()) {
      case 'emergency':
        return 'has-text-danger';
      case 'critical':
        return 'has-text-orange';
      case 'high':
        return 'has-text-warning';
      case 'low':
        return 'has-text-grey-light';
    }
  }

  async onPageChange(page: number) {
    this.changePage(page);

    try {
      this.getTickets();
    } catch (e) {
      this.errorMessage(e);
    }
  }

  // my api determines sort direction by a + or - prefix to the sort field
  async onSort(field: string, order: string) {
    let sort = '';

    if (order === 'desc') {
      sort = '-' + field;
    } else {
      sort = '+' + field;
    }

    this.changePage(1);
    this.changeSort(sort);

    try {
      await this.getTickets();
    } catch (e) {
      this.errorMessage(e);
    }
  }

  // lifecycle hooks
  async created() {
    this.setParams();

    try {
      await this.getTickets();
    } catch (e) {
      this.errorMessage(e);
    }
  }
}
</script>

<style lang="scss">
.b-table {
  table.is-striped.is-hoverable {
    box-shadow: 3px 2px 8px 0 rgba(0, 0, 0, 0.46);

    tbody {
      tr.detail {
        background-color: #333;
        box-shadow: none;

        &:hover {
          background-color: #333;
        }

        &:not(.is-selected):nth-child(2n) {
          background-color: #444;

          &:hover {
            background-color: #444;
          }
        }
      }
    }
  }

  .level {
    .level-right {
      .level-item {
        nav.pagination {
          a:not(.is-current):not([disabled]) {
            background-color: #eaeaea;

            &:hover {
              background-color: #4de4f4;
            }
          }
        }
      }
    }
  }
}
</style>
