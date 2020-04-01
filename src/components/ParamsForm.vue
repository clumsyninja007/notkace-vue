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
            <b-select v-model="selectedAssignee">
              <option value="*" selected>*</option>
              <option
                v-for="owner in $store.state.owners"
                :key="owner.id"
                :value="owner.userName"
                >{{ owner.fullName }}</option
              >
            </b-select>
          </b-field>
          <b-field label="Documented Software">
            <b-select v-model="selectedSoftware">
              <option value="*" selected>*</option>
              <option
                v-for="sw in $store.state.software"
                :key="sw.id"
                :value="sw.name"
              >
                {{ sw.name }}
              </option>
            </b-select>
          </b-field>
          <b-field label="Referred To">
            <b-select v-model="selectedReferredTo">
              <option value="*" selected>*</option>
              <option
                v-for="referee in $store.state.referredTo"
                :key="referee.id"
                :value="referee.name"
                >{{ referee.name }}</option
              >
            </b-select>
          </b-field>
          <b-field label="Department">
            <b-select v-model="selectedDepartment">
              <option value="*" selected>*</option>
              <option
                v-for="department in $store.state.departments"
                :key="department.id"
                :value="department.name"
                >{{ department.name }}</option
              >
            </b-select>
          </b-field>
          <b-field label="Location">
            <b-select v-model="selectedLocation">
              <option value="*" selected>*</option>
              <option
                v-for="location in $store.state.locations"
                :key="location.id"
                :value="location.name"
                >{{ location.name }}</option
              >
            </b-select>
          </b-field>
          <b-field label="Exclude Columns">
            <b-select v-model="selectedExclusions" multiple>
              <option
                v-for="column in $store.state.columns"
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

@Component
export default class ParamsForm extends Mixins(Helpers) {
  public showMenu = false;
  public selectedAssignee = '*';
  public selectedSoftware = '*';
  public selectedReferredTo = '*';
  public selectedDepartment = '*';
  public selectedLocation = '*';
  public selectedExclusions = [];

  public toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  public async refresh() {
    await this.$store.dispatch('changePage', 1);
    try {
      await this.$store.dispatch('getTickets');
    } catch (error) {
      this.$buefy.toast.open({ message: error, type: 'is-danger' });
    }
  }

  public resetParams() {
    this.selectedAssignee = '*';
    this.selectedSoftware = '*';
    this.selectedReferredTo = '*';
    this.selectedDepartment = '*';
    this.selectedLocation = '*';
  }

  public async handleSubmit() {
    this.showMenu = false;
    window.scrollTo(0, 0);
    const query: { [k: string]: any } = {};

    if (this.selectedAssignee !== '*') {
      query.assignee = this.selectedAssignee;
    }
    if (this.selectedSoftware !== '*') {
      query.software = this.selectedSoftware;
    }
    if (this.selectedReferredTo !== '*') {
      query.referredTo = this.selectedReferredTo;
    }
    if (this.selectedDepartment !== '*') {
      query.department = this.selectedDepartment;
    }
    if (this.selectedLocation !== '*') {
      query.location = this.selectedLocation;
    }
    if (this.selectedExclusions.length > 0) {
      query.exclude = this.selectedExclusions.join(' ');
    }

    this.$router.push({
      name: 'home',
      query,
    });

    await this.$store.dispatch('setParams');
    await this.$store.dispatch('changePage', 1);
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
      .dispatch('getOwners')
      .catch((error) => this.errorMessage(error));
    this.$store
      .dispatch('getSoftware')
      .catch((error) => this.errorMessage(error));
    this.$store
      .dispatch('getReferredTo')
      .catch((error) => this.errorMessage(error));
    this.$store
      .dispatch('getDepartment')
      .catch((error) => this.errorMessage(error));
    this.$store
      .dispatch('getLocation')
      .catch((error) => this.errorMessage(error));

    this.selectedAssignee = this.$store.state.selectedAssignee;
    this.selectedSoftware = this.$store.state.selectedSoftware;
    this.selectedReferredTo = this.$store.state.selectedReferredTo;
    this.selectedDepartment = this.$store.state.selectedDepartment;
    this.selectedLocation = this.$store.state.selectedLocation;
    this.selectedExclusions = this.$store.state.excludedColumns;
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
