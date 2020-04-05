import Vue from 'vue';
import Vuex from 'vuex';
import Columns from '@/models/Columns';
import TicketRow from '@/models/TicketRow';
import User from '@/models/User';
import Asset from '@/models/Asset';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ticketApi:
      process.env.NODE_ENV === 'production'
        ? 'https://api.archerharmony.com/'
        : 'http://localhost:28147/',
    color: '#fff',
    selectedAssignee: '*',
    selectedSoftware: '*',
    selectedReferredTo: '*',
    selectedDepartment: '*',
    selectedLocation: '*',
    rows: [] as TicketRow[],
    currPage: 1,
    perPage: 100,
    total: 0,
    sort: '',
    owners: [] as User[],
    software: [] as Asset[],
    referredTo: [] as Asset[],
    departments: [] as Asset[],
    locations: [] as Asset[],
    loading: false,
    excludedColumns: [] as string[],
    columns: [
      {
        title: 'Ticket #',
        dataIndex: 'ticket',
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
      },
      {
        title: 'Brief Description',
        dataIndex: 'title',
      },
      {
        title: 'Status',
        dataIndex: 'status',
      },
      {
        title: 'Assignee',
        dataIndex: 'owner',
      },
      {
        title: 'Customer',
        dataIndex: 'submitter',
      },
      {
        title: 'Department',
        dataIndex: 'dept',
      },
      {
        title: 'Location',
        dataIndex: 'location',
      },
      {
        title: 'Asset',
        dataIndex: 'asset',
      },
      {
        title: 'Referred To',
        dataIndex: 'referredTo',
      },
      {
        title: 'Created Date',
        dataIndex: 'created',
      },
    ] as Columns[],
  },
  getters: {
    getRows: (state: any) => (sortField: string, sortDirection: string) => {
      if (sortField === '' || sortField === undefined || !sortField) {
        return state.rows;
      }

      return state.rows.concat().sort((a: any, b: any) => {
        const nullPosition = sortDirection === 'ascend' ? 1 : -1;
        if (a[sortField] == null) {
          return -nullPosition;
        }
        if (b[sortField] == null) {
          return nullPosition;
        }
        if (a[sortField] < b[sortField]) {
          return -nullPosition;
        }
        if (a[sortField] > b[sortField]) {
          return nullPosition;
        }
        return 0;
      });
    },
    getAssigneeName: (state: any) => {
      if (state.owners.length > 0 && state.selectedAssignee !== '*') {
        const owner = state.owners.find(
          (o: any) => o.userName === state.selectedAssignee
        );
        return owner.fullName;
      } else {
        return '';
      }
    },
    getFilteredColumns: (state: any) => {
      let columns = state.columns;

      if (state.selectedAssignee && state.selectedAssignee !== '*') {
        columns = columns.filter(
          (column: Columns) => column.title !== 'Assignee'
        );
      }
      if (state.selectedSoftware && state.selectedSoftware !== '*') {
        columns = columns.filter((column: Columns) => column.title !== 'Asset');
      }
      if (state.selectedReferredTo && state.selectedReferredTo !== '*') {
        columns = columns.filter(
          (column: Columns) => column.title !== 'Referred To'
        );
      }
      if (state.selectedDepartment && state.selectedDepartment !== '*') {
        columns = columns.filter(
          (column: Columns) => column.title !== 'Department'
        );
      }
      if (state.selectedLocation && state.selectedLocation !== '*') {
        columns = columns.filter(
          (column: Columns) => column.title !== 'Location'
        );
      }

      return columns;
    },
    getExcludeFilteredColumns: (state: any, getters: any) => {
      if (state.excludedColumns.length > 0) {
        return getters.getFilteredColumns.filter(
          (column: Columns) => !state.excludedColumns.includes(column.dataIndex)
        );
      }

      return getters.getFilteredColumns;
    },
  },
  mutations: {
    changeColor(state: any, color: any) {
      state.color = color;
    },
    selectAssignee(state: any, assignee: any) {
      state.selectedAssignee = assignee;
    },
    selectSoftware(state: any, software: any) {
      state.selectedSoftware = software;
    },
    selectReferredTo(state: any, referredTo: any) {
      state.selectedReferredTo = referredTo;
    },
    selectDepartment(state: any, department: any) {
      state.selectedDepartment = department;
    },
    selectLocation(state: any, location: any) {
      state.selectedLocation = location;
    },
    setRows(state: any, rows: TicketRow[]) {
      state.rows = rows;
    },
    setTotal(state: any, total: number) {
      state.total = total;
    },
    setCurrPage(state: any, page: number) {
      state.currPage = page;
    },
    setSort(state: any, sort: string) {
      state.sort = sort;
    },
    setOwners(state: any, owners: any) {
      state.owners = owners;
    },
    setSoftware(state: any, software: any) {
      state.software = software;
    },
    setReferredTo(state: any, referredTo: any) {
      state.referredTo = referredTo;
    },
    setDepartment(state: any, departments: any) {
      state.departments = departments;
    },
    setLocation(state: any, locations: any) {
      state.locations = locations;
    },
    toggleLoading(state: any, loading: boolean) {
      state.loading = loading;
    },
    setExcludedColumns(state: any, exclusions: string[]) {
      state.excludedColumns = exclusions;
    },
  },
  actions: {
    async getTickets({ commit, state }: any) {
      commit('toggleLoading', true);

      let url =
        state.ticketApi +
        `HdTickets?perPage=${state.perPage}&page=${state.currPage}&excludedStatuses=CLOSED`;
      if (state.selectedAssignee && state.selectedAssignee !== '*') {
        url += `&assignee=${state.selectedAssignee}`;
      }
      if (state.selectedSoftware && state.selectedSoftware !== '*') {
        url += `&software=${state.selectedSoftware}`;
      }
      if (state.selectedReferredTo && state.selectedReferredTo !== '*') {
        url += `&referredTo=${state.selectedReferredTo}`;
      }
      if (state.selectedDepartment && state.selectedDepartment !== '*') {
        url += `&department=${state.selectedDepartment}`;
      }
      if (state.selectedLocation && state.selectedLocation !== '*') {
        url += `&location=${state.selectedLocation}`;
      }
      if (state.sort && state.sort !== '') {
        url += `&sort=${state.sort}`;
      }

      try {
        const res = await fetch(url);

        if (res.status === 200) {
          const json = await res.json();

          console.log(json);
          commit('setRows', json.result);
          commit('setTotal', json.total);
          commit('toggleLoading', false);
        } else if (res.status === 204) {
          commit('setRows', []);
          commit('setTotal', 0);
          commit('toggleLoading', false);
        }
      } catch (e) {
        commit('toggleLoading', false);
        throw e;
      }
    },
    changePage({ commit }: any, page: number) {
      commit('setCurrPage', page);
    },
    changeSort({ commit }: any, sort: string) {
      commit('setSort', sort);
    },
    async getOwners({ commit, state }: any) {
      const res = await fetch(state.ticketApi + 'Users/Owners');
      commit('setOwners', await res.json());
    },
    async getSoftware({ commit, state }: any) {
      const res = await fetch(state.ticketApi + 'Assets/Type/6');
      commit('setSoftware', await res.json());
    },
    async getReferredTo({ commit, state }: any) {
      const res = await fetch(state.ticketApi + 'Assets/Type/4');
      commit('setReferredTo', await res.json());
    },
    async getDepartment({ commit, state }: any) {
      const res = await fetch(state.ticketApi + 'Assets/Type/2');
      commit('setDepartment', await res.json());
    },
    async getLocation({ commit, state }: any) {
      const res = await fetch(state.ticketApi + 'Assets/Type/1');
      commit('setLocation', await res.json());
    },
    setParams({ commit }: any) {
      const urlParams = new URLSearchParams(window.location.search);
      const assignee = urlParams.get('assignee');
      const software = urlParams.get('software');
      const referredTo = urlParams.get('referredTo');
      const department = urlParams.get('department');
      const location = urlParams.get('location');
      const color = urlParams.get('color');
      const exclusions = urlParams.get('exclude');

      if (assignee && assignee !== '*') {
        commit('selectAssignee', assignee);
      } else {
        commit('selectAssignee', '*');
      }
      if (software && software !== '*') {
        commit('selectSoftware', software);
      } else {
        commit('selectSoftware', '*');
      }
      if (referredTo && referredTo !== '*') {
        commit('selectReferredTo', referredTo);
      } else {
        commit('selectReferredTo', '*');
      }
      if (department && department !== '*') {
        commit('selectDepartment', department);
      } else {
        commit('selectDepartment', '*');
      }
      if (location && location !== '*') {
        commit('selectLocation', location);
      } else {
        commit('selectLocation', '*');
      }
      if (color) {
        commit('changeColor', color);
      }
      if (exclusions) {
        commit('setExcludedColumns', exclusions.split(' '));
      } else {
        commit('setExcludedColumns', []);
      }
    },
    async getTicketInfo({ state }: any, ticket: number) {
      const url = state.ticketApi + 'HdTickets/' + ticket + '/Info';

      const res = await fetch(url);

      return await res.json();
    },
  },
});
