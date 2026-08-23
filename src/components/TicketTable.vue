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
        v-model:current-page="currPage"
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
        <b-table-column
          field="ticket"
          label="Ticket #"
          width="81"
          numeric
          sortable
          centered
          :visible="!excludedColumns.includes('ticket')"
          v-slot="props"
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
          v-slot="props"
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
          v-slot="props"
        >
          {{ props.row.title }}
        </b-table-column>

        <b-table-column
          field="status"
          label="Status"
          sortable
          centered
          :visible="!excludedColumns.includes('status')"
          v-slot="props"
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
          v-slot="props"
        >
          {{ props.row.owner }}
        </b-table-column>

        <b-table-column
          field="submitter"
          label="Customer"
          sortable
          centered
          :visible="!excludedColumns.includes('submitter')"
          v-slot="props"
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
          v-slot="props"
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
          v-slot="props"
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
          v-slot="props"
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
          v-slot="props"
        >
          {{ props.row.referredTo }}
        </b-table-column>

        <b-table-column
          field="created"
          label="Create Date"
          sortable
          centered
          :visible="!excludedColumns.includes('created')"
          v-slot="props"
        >
          {{ fixDate(props.row.created) }}
        </b-table-column>
        <template #detail="props">
          <ticket-info :ticket="props.row.ticket"></ticket-info>
        </template>

        <template #empty>
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
import { defineComponent } from 'vue';
import Helpers from '@/mixins/helpers';
import TicketInfo from '@/components/TicketInfo.vue';
import { mapActions, mapState } from 'vuex';

export default defineComponent({
  name: 'TicketTable',
  components: { TicketInfo },
  mixins: [Helpers],
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

    defaultSort(): string {
      if (this.selectedAssignee === '*') {
        return 'owner';
      }
      return 'priority';
    },
  },
  methods: {
    ...mapActions(['changePage', 'changeSort', 'getTickets', 'setParams']),

    // Departments are stored in Kace with their budget units in [] brackets
    // I don't want to see these, so I'm stripping them here
    getDept(rowName: string) {
      if (rowName.indexOf(' [') > 0) {
        return rowName.slice(0, rowName.indexOf('[')).trim();
      }
      return rowName.trim();
    },

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
    },

    async onPageChange(page: number) {
      this.changePage(page);

      try {
        this.getTickets();
      } catch (e) {
        this.errorMessage(e);
      }
    },

    // my api determines sort direction by a + or - prefix to the sort field
    async onSort(field: string, order: string) {
      const sort = (order === 'desc' ? '-' : '+') + field;

      this.changePage(1);
      this.changeSort(sort);

      try {
        await this.getTickets();
      } catch (e) {
        this.errorMessage(e);
      }
    },
  },
  async created() {
    this.setParams();

    try {
      await this.getTickets();
    } catch (e) {
      this.errorMessage(e);
    }
  },
});
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
          // These buttons are deliberately light against the dark page, so the
          // text has to be dark: the inherited pagination colour is near-white,
          // which left the page numbers at a 1.01:1 contrast ratio (invisible)
          // and 1.28:1 on hover. #333 gives 10.5:1 and 8.3:1.
          a:not(.is-current):not([disabled]) {
            background-color: #eaeaea;
            color: #333;

            &:hover {
              background-color: #4de4f4;
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>
