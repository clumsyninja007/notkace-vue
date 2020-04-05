<template>
  <section>
    <b-navbar fixed-top type="is-dark">
      <template slot="start">
        <b-navbar-item tag="div">
          <b-button type="is-primary" @click="toggleMenu">
            Parameters
          </b-button>
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="div">
          <b-button type="is-primary" @click="refresh">Refresh Table</b-button>
        </b-navbar-item>
      </template>
    </b-navbar>
    <b-modal :active.sync="showMenu">
      <div class="box">
        <b-field grouped group-multiline>
          <b-field label="Assignee">
            <b-select v-model="currentAssignee">
              <option value="*" selected>*</option>
              <option
                v-for="owner in owners"
                :key="owner.id"
                :value="owner.userName"
                >{{ owner.fullName }}</option
              >
            </b-select>
          </b-field>
          <b-field label="Documented Software">
            <b-select v-model="currentSoftware">
              <option value="*" selected>*</option>
              <option v-for="sw in software" :key="sw.id" :value="sw.name">
                {{ sw.name }}
              </option>
            </b-select>
          </b-field>
          <b-field label="Referred To">
            <b-select v-model="currentReferredTo">
              <option value="*" selected>*</option>
              <option
                v-for="referee in referredTo"
                :key="referee.id"
                :value="referee.name"
                >{{ referee.name }}</option
              >
            </b-select>
          </b-field>
          <b-field label="Department">
            <b-select v-model="currentDepartment">
              <option value="*" selected>*</option>
              <option
                v-for="department in departments"
                :key="department.id"
                :value="department.name"
                >{{ department.name }}</option
              >
            </b-select>
          </b-field>
          <b-field label="Location">
            <b-select v-model="currentLocation">
              <option value="*" selected>*</option>
              <option
                v-for="location in locations"
                :key="location.id"
                :value="location.name"
                >{{ location.name }}</option
              >
            </b-select>
          </b-field>
          <b-field label="Exclude Columns">
            <b-select v-model="selectedExclusions" multiple>
              <option
                v-for="column in columns"
                :key="'exclude_' + column.dataIndex"
                :value="column.dataIndex"
              >
                {{ column.title }}
              </option>
            </b-select>
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field>
            <b-button type="is-primary" @click="handleSubmit">Submit</b-button>
          </b-field>
          <b-field>
            <b-button type="is-primary" @click="resetParams"
              >Reset Params</b-button
            >
          </b-field>
        </b-field>
      </div>
    </b-modal>
  </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import Helpers from '@/mixins/helpers';
import { mapActions, mapState } from 'vuex';
import User from '../models/User';
import Asset from '../models/Asset';
import Columns from '../models/Columns';

@Component({
  computed: {
    ...mapState([
      'selectedAssignee',
      'selectedDepartment',
      'selectedLocation',
      'selectedSoftware',
      'selectedReferredTo',
      'owners',
      'departments',
      'locations',
      'software',
      'referredTo',
      'columns',
      'excludedColumns',
    ]),
  },
  methods: {
    ...mapActions([
      'changePage',
      'getTickets',
      'setParams',
      'getOwners',
      'getSoftware',
      'getReferredTo',
      'getDepartment',
      'getLocation',
    ]),
  },
})
export default class ParamsForm extends Mixins(Helpers) {
  // mapped state
  selectedAssignee!: string;
  selectedDepartment!: string;
  selectedLocation!: string;
  selectedSoftware!: string;
  selectedReferredTo!: string;
  owners!: User[];
  departments!: Asset[];
  locations!: Asset[];
  software!: Asset[];
  referredTo!: Asset[];
  columns!: Columns[];
  excludedColumns!: string[];

  // mapped actions
  changePage!: (page: number) => void;
  getTickets!: () => void;
  setParams!: () => void;
  getOwners!: () => void;
  getSoftware!: () => void;
  getReferredTo!: () => void;
  getDepartment!: () => void;
  getLocation!: () => void;

  // properties
  showMenu = false;
  currentAssignee = '*';
  currentSoftware = '*';
  currentReferredTo = '*';
  currentDepartment = '*';
  currentLocation = '*';
  selectedExclusions: string[] = [];

  // methods
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  async refresh() {
    this.changePage(1);

    try {
      await this.getTickets();
    } catch (e) {
      this.errorMessage(e);
    }
  }

  resetParams() {
    this.currentAssignee = '*';
    this.currentSoftware = '*';
    this.currentReferredTo = '*';
    this.currentDepartment = '*';
    this.currentLocation = '*';
  }

  async handleSubmit() {
    this.showMenu = false;
    window.scrollTo(0, 0);

    // eslint-disable-next-line
    const query: { [k: string]: any } = {};

    if (this.currentAssignee !== '*') {
      query.assignee = this.currentAssignee;
    }
    if (this.currentSoftware !== '*') {
      query.software = this.currentSoftware;
    }
    if (this.currentReferredTo !== '*') {
      query.referredTo = this.currentReferredTo;
    }
    if (this.currentDepartment !== '*') {
      query.department = this.currentDepartment;
    }
    if (this.currentLocation !== '*') {
      query.location = this.currentLocation;
    }
    if (this.selectedExclusions.length > 0) {
      query.exclude = this.selectedExclusions.join(' ');
    }

    this.$router.push({
      name: 'home',
      query,
    });

    this.setParams();
    this.changePage(1);

    try {
      await this.getTickets();
    } catch (e) {
      this.errorMessage(e);
    }
  }

  async created() {
    this.setParams();

    try {
      await this.getOwners();
      await this.getSoftware();
      await this.getReferredTo();
      await this.getDepartment();
      await this.getLocation();
    } catch (e) {
      this.errorMessage(e);
    }

    this.currentAssignee = this.selectedAssignee;
    this.currentSoftware = this.selectedSoftware;
    this.currentReferredTo = this.selectedReferredTo;
    this.currentDepartment = this.selectedDepartment;
    this.currentLocation = this.selectedLocation;
    this.selectedExclusions = this.excludedColumns;
  }
}
</script>

<style lang="scss" scoped>
nav {
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.75);
}

button.is-primary {
  &:hover {
    background-color: #30a7f7;
  }
}
</style>
