<template>
  <div>
    <table>
      <thead>
        <tr>
          <th
            v-if="expandable"
            class="expand"
            style="width: 18px; cursor: pointer"
            @click="expandAll"
          >
            <i class="fas fa-plus"></i>
          </th>
          <th
            v-for="column in columns"
            :style="{ width: column.width }"
            :class="column.sorter ? 'sorter' : ''"
            @click="sortTable(column.sorter, column.dataIndex, $event)"
          >
            {{ column.title }}
            <i
              class="sort-indicator fas fa-angle-up"
              v-if="
                (column.sorter === true
                  ? sortField === column.dataIndex
                  : sortField === column.sorter) && sortDirection === 'ascend'
              "
            ></i>
            <i
              class="sort-indicator fas fa-angle-down"
              v-if="
                (column.sorter === true
                  ? sortField === column.dataIndex
                  : sortField === column.sorter) && sortDirection === 'descend'
              "
            ></i>
            <i
              class="fas fa-filter"
              v-if="column.filter"
              @click="filterTable"
            ></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in paginatedRows">
          <tr :class="[index % 2 === 0 ? '' : 'odd']">
            <td
              v-if="expandable"
              @click="row.open ? (row.open = false) : (row.open = true)"
              class="expand"
            >
              <i class="fas fa-plus"></i>
            </td>
            <td
              v-for="rowCol in columns"
              :class="rowCol.align ? 'left-me' : ''"
            >
              <template v-if="rowCol.customRender">
                <slot :name="rowCol.customRender" :row="row">{{
                  row[rowCol.dataIndex]
                }}</slot>
              </template>
              <template v-else>{{ row[rowCol.dataIndex] }}</template>
            </td>
          </tr>
          <tr
            v-if="row.open"
            :class="[index % 2 === 0 ? '' : 'odd']"
            class="comment left-me"
          >
            <td colspan="15">
              <ticket-info :ticket="row.Ticket"></ticket-info>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="pagination" v-if="paginated && maxPages > 1">
      <button :disabled="this.from < 1" @click="prevPage">Prev</button>
      <ul>
        <li v-for="page in maxPages">
          <button :disabled="page === currPage" @click="setPage(page)">
            {{ page }}
          </button>
        </li>
      </ul>
      <button
        :disabled="this.from + this.perPage >= dataSource.length"
        @click="nextPage"
        class="next-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import TicketInfo from '@/components/TicketInfo.vue';
import { TicketRow } from '@/models/TicketRow';

@Component({
  components: { TicketInfo },
})
export default class DataTable extends Vue {
  @Prop()
  public dataSource!: TicketRow[];
  @Prop()
  public columns!: object[];
  @Prop()
  public customRenders?: any;
  @Prop({ default: false })
  public expandable?: boolean;
  @Prop({ default: true })
  public paginated!: boolean;
  @Prop({ default: 100 })
  public perPage!: number;

  public sortField: string = '';
  public sortDirection: string = '';

  public allOpen = false;

  public currPage = 1;
  public from = 0;

  public filterTable() {
    console.log('filtered!');
  }

  public sortTable(sorter: any, sortColumn: any, event: any) {
    if (event.target.className !== 'fas fa-filter') {
      if (sorter) {
        if (typeof sorter !== 'boolean') {
          sortColumn = sorter;
        }

        if (this.sortField === sortColumn) {
          if (this.sortDirection === 'ascend') {
            this.sortDirection = 'descend';
          } else {
            this.sortField = '';
            this.sortDirection = '';
          }
        } else {
          this.sortField = sortColumn;
          this.sortDirection = 'ascend';
        }
      }
    }
  }

  public expandAll() {
    this.allOpen = !this.allOpen;

    this.dataSource.forEach((row) => {
      row.open = this.allOpen;
    });
  }

  public nextPage() {
    if (this.from + this.perPage < this.dataSource.length) {
      this.currPage += 1;
      this.from += this.perPage;
    }
  }

  public prevPage() {
    if (this.from > 1) {
      this.currPage -= 1;
      this.from -= this.perPage;
    }
  }

  public setPage(newPage: number) {
    this.currPage = newPage;
    this.from = (this.currPage - 1) * this.perPage;
  }

  get maxPages() {
    return Math.ceil(this.dataSource.length / this.perPage);
  }

  get to() {
    return this.from + this.perPage;
  }

  get paginatedRows() {
    if (this.paginated) {
      return this.getRows.slice(this.from, this.to);
    }

    return this.getRows;
  }

  get getRows() {
    if (this.sortField === '') {
      return this.dataSource;
    }

    return this.dataSource.concat().sort((a: any, b: any) => {
      const nullPosition = this.sortDirection === 'ascend' ? 1 : -1;
      if (a[this.sortField] == null) {
        return -nullPosition;
      }
      if (b[this.sortField] == null) {
        return nullPosition;
      }
      if (a[this.sortField] < b[this.sortField]) {
        return -nullPosition;
      }
      if (a[this.sortField] > b[this.sortField]) {
        return nullPosition;
      }
      return 0;
    });
  }

  public updated() {
    if (this.currPage > this.maxPages) {
      this.currPage = 1;
      this.from = 0;
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 98vw;
  text-align: center;
  border-collapse: collapse;
  box-shadow: 3px 2px 8px 0 rgba(0, 0, 0, 0.46);
  margin: auto;

  thead {
    tr {
      th {
        border-top: 1px solid rgb(68, 68, 68);
        border-bottom: 2px solid black;
        padding: 8px;
        user-select: none;

        &.sorter {
          cursor: pointer;

          &:hover {
            border-right: 1px solid rgb(68, 68, 68);
            border-left: 1px solid rgb(68, 68, 68);
          }
        }

        .fa-filter {
          &:hover {
            color: #4de4f4;
          }
        }

        .sort-indicator {
          color: rgb(234, 234, 234);
          font-size: 12px;
        }
      }
    }
  }

  tbody {
    tr {
      td {
        & .emergency {
          color: red;
        }
        & .critical {
          color: orange;
        }
        & .high {
          color: yellow;
        }
        & .low {
          color: rgb(177, 177, 177);
        }
      }
    }

    tr:hover:not(.comment) {
      background: #555;
    }
  }

  td {
    padding: 8px;

    &.expand {
      cursor: pointer;
    }
  }

  .odd {
    background: #444;
  }

  .left-me {
    text-align: left;
  }
}

.pagination {
  margin-top: 20px;
  padding-right: 1vw;
  display: flex;
  justify-content: space-between;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: inline;
    }
  }
}
</style>
