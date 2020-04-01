<template>
  <section>
    <div class="container is-fullhd">
      <b-table
        :data="this.$store.state.rows"
        :loading="true"
        paginated
        backend-pagination
        :total="this.$store.state.total"
        :per-page="this.$store.state.perPage"
        :current-page.sync="$store.state.currPage"
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
            :visible="!$store.state.excludedColumns.includes('ticket')"
          >
            <a
              :href="'http://cty-k1k/adminui/ticket?ID=' + props.row.ticket"
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
            :visible="!$store.state.excludedColumns.includes('priority')"
          >
            <span :class="priorityColor(props.row.priority)">
              {{ props.row.priority }}
            </span>
          </b-table-column>

          <b-table-column
            field="title"
            label="Brief Description"
            sortable
            :visible="!$store.state.excludedColumns.includes('title')"
          >
            {{ props.row.title }}
          </b-table-column>

          <b-table-column
            field="status"
            label="Status"
            sortable
            centered
            :visible="!$store.state.excludedColumns.includes('status')"
          >
            {{ props.row.status }}
          </b-table-column>

          <b-table-column
            field="owner"
            label="Assignee"
            sortable
            centered
            :visible="
              !$store.state.excludedColumns.includes('owner') &&
                $store.state.selectedAssignee === '*'
            "
          >
            {{ props.row.owner }}
          </b-table-column>

          <b-table-column
            field="submitter"
            label="Customer"
            sortable
            centered
            :visible="!$store.state.excludedColumns.includes('submitter')"
          >
            {{ props.row.submitter }}
          </b-table-column>

          <b-table-column
            field="dept"
            label="Department"
            sortable
            centered
            :visible="
              !$store.state.excludedColumns.includes('dept') &&
                $store.state.selectedDepartment === '*'
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
              !$store.state.excludedColumns.includes('location') &&
                $store.state.selectedLocation === '*'
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
              !$store.state.excludedColumns.includes('asset') &&
                $store.state.selectedSoftware === '*'
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
              !$store.state.excludedColumns.includes('referredTo') &&
                $store.state.selectedReferredTo === '*'
            "
          >
            {{ props.row.referredTo }}
          </b-table-column>

          <b-table-column
            field="created"
            label="Create Date"
            sortable
            centered
            :visible="!$store.state.excludedColumns.includes('created')"
          >
            {{ fixDate(props.row.created) }}
          </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <ticket-info :ticket="props.row.ticket"></ticket-info>
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

@Component({ components: { TicketInfo } })
export default class TicketTable extends mixins(Helpers) {
  public get defaultSort() {
    if (this.$store.state.selectedAssignee === '*') {
      return 'owner';
    }

    return 'priority';
  }

  public getDept(rowName: string) {
    if (rowName.indexOf(' [') > 0) {
      return rowName.slice(0, rowName.indexOf('[')).trim();
    }
    return rowName.trim();
  }

  public priorityColor(color: string) {
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

  public async onPageChange(page: number) {
    await this.$store.dispatch('changePage', page);
    this.$store
      .dispatch('getTickets')
      .catch((error) => this.errorMessage(error));
  }

  public async onSort(field: string, order: string) {
    let sort = '';

    if (order === 'desc') {
      sort = '-' + field;
    } else {
      sort = '+' + field;
    }

    await this.$store.dispatch('changePage', 1);
    await this.$store.dispatch('changeSort', sort);
    try {
      await this.$store.dispatch('getTickets');
    } catch (error) {
      this.errorMessage(error);
    }
  }

  public created() {
    this.$store
      .dispatch('setParams')
      .catch((error) => this.errorMessage(error));
    this.$store
      .dispatch('getTickets')
      .catch((error) => this.errorMessage(error));
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
