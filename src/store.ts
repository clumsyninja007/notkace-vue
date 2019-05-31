import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ticketApi:
      process.env.NODE_ENV === 'production'
        ? '/api/'
        : 'http://localhost:3000/',
    color: '#fff',
    selectedAssignee: '*',
    selectedSoftware: '*',
    selectedReferredTo: '*',
    selectedDepartment: '*',
    selectedLocation: '*',
    rows: [],
    owners: new Array(),
    software: [],
    referredTo: [],
    departments: [],
    locations: [],
    loading: false
  },
  getters: {
    getRows: (state) => (sortField: any, sortDirection: any) => {
      if (sortField === '' || sortField === undefined || !sortField) {
        return state.rows;
      }

      return state.rows.concat().sort((a, b) => {
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
    getAssigneeName: (state) => {
      if (state.owners.length > 0 && state.selectedAssignee !== '*') {
        const owner = state.owners.find(
          (o) => o.UserName === state.selectedAssignee
        );
        return owner.FullName;
      } else {
        return '';
      }
    }
  },
  mutations: {
    changeColor(state, color) {
      state.color = color;
    },
    selectAssignee(state, assignee) {
      state.selectedAssignee = assignee;
    },
    selectSoftware(state, software) {
      state.selectedSoftware = software;
    },
    selectReferredTo(state, referredTo) {
      state.selectedReferredTo = referredTo;
    },
    selectDepartment(state, department) {
      state.selectedDepartment = department;
    },
    selectLocation(state, location) {
      state.selectedLocation = location;
    },
    setRows(state, rows) {
      state.rows = rows;
    },
    setOwners(state, owners) {
      state.owners = owners;
    },
    setSoftware(state, software) {
      state.software = software;
    },
    setReferredTo(state, referredTo) {
      state.referredTo = referredTo;
    },
    setDepartment(state, departments) {
      state.departments = departments;
    },
    setLocation(state, locations) {
      state.locations = locations;
    },
    toggleLoading(state, loading) {
      state.loading = loading;
    }
  },
  actions: {
    getTickets({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('toggleLoading', true);

        let url = state.ticketApi + 'HdTickets/Open?';
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

        fetch(url)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            Array.prototype.forEach.call(json, (row: any) => {
              row.open = false;
            });
            return json;
          })
          .then((rowData) => {
            commit('setRows', rowData);
            commit('toggleLoading', false);
          })
          .then(() => resolve())
          .catch((error) => {
            commit('toggleLoading', false);
            reject(error);
          });
      });
    },
    getOwners({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch(state.ticketApi + 'Users/Owners')
          .then((response) => response.json())
          .then((json) => commit('setOwners', json))
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    },
    getSoftware({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch(state.ticketApi + 'Assets/Type/6')
          .then((response) => response.json())
          .then((json) => commit('setSoftware', json))
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    },
    getReferredTo({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch(state.ticketApi + 'Assets/Type/4')
          .then((response) => response.json())
          .then((json) => commit('setReferredTo', json))
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    },
    getDepartment({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch(state.ticketApi + 'Assets/Type/2')
          .then((response) => response.json())
          .then((json) => commit('setDepartment', json))
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    },
    getLocation({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch(state.ticketApi + 'Assets/Type/1')
          .then((response) => response.json())
          .then((json) => commit('setLocation', json))
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    },
    setParams({ commit }) {
      const urlParams = new URLSearchParams(window.location.search);
      const assignee = urlParams.get('assignee');
      const software = urlParams.get('software');
      const referredTo = urlParams.get('referredTo');
      const department = urlParams.get('department');
      const location = urlParams.get('location');
      const color = urlParams.get('color');

      if (assignee && assignee !== '*') {
        commit('selectAssignee', assignee);
      }
      if (software && software !== '*') {
        commit('selectSoftware', software);
      }
      if (referredTo && referredTo !== '*') {
        commit('selectReferredTo', referredTo);
      }
      if (department && department !== '*') {
        commit('selectDepartment', department);
      }
      if (location && location !== '*') {
        commit('selectLocation', location);
      }
      if (color) {
        commit('changeColor', color);
      }
    },
    getTicketInfo({ state }, ticket) {
      return new Promise((resolve, reject) => {
        const url = state.ticketApi + 'HdTickets/Open/' + ticket;

        fetch(url)
          .then((response) => response.json())
          .then((json) => resolve(json))
          .catch((error) => reject(error));
      });
    }
  }
});
