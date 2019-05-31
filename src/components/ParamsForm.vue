<template>
  <div
    class="click-finder"
    :class="showMenu ? 'active' : ''"
    @click="toggleMenuOuter"
  >
    <div class="form-background">
      <div class="button-back">
        <button class="menu-button" v-on:click="toggleMenu()">
          <i v-if="!showMenu" class="fas fa-bars"></i>
          <i v-if="showMenu" class="fas fa-times"></i>
        </button>
      </div>
      <form
        class="report-params-form"
        @submit.prevent.capture="handleSubmit"
        v-show="showMenu"
      >
        <div class="form-group">
          <div class="field-wrap">
            <label for="assigneeSelect">Owner</label>
            <select
              id="assigneeSelect"
              name="assignee"
              v-model="selectedAssignee"
            >
              <option value="*" selected>*</option>
              <option
                v-for="owner in $store.state.owners"
                :key="owner.Id"
                :value="owner.UserName"
                >{{ owner.FullName }}</option
              >
            </select>
          </div>
          <div class="field-wrap">
            <label for="softwareSelect">Documented Software</label>
            <select
              id="softwareSelect"
              name="software"
              v-model="selectedSoftware"
            >
              <option value="*" selected>*</option>
              <option
                v-for="sw in $store.state.software"
                :key="sw.Id"
                :value="sw.Name"
                >{{ sw.Name }}</option
              >
            </select>
          </div>
          <div class="field-wrap">
            <label for="referredToSelect">Referred To</label>
            <select
              id="referredToSelect"
              name="referredTo"
              v-model="selectedReferredTo"
            >
              <option value="*" selected>*</option>
              <option
                v-for="referee in $store.state.referredTo"
                :key="referee.Id"
                :value="referee.Name"
                >{{ referee.Name }}</option
              >
            </select>
          </div>
          <div class="field-wrap">
            <label for="departmentSelect">Department</label>
            <select
              id="departmentSelect"
              name="department"
              v-model="selectedDepartment"
            >
              <option value="*" selected>*</option>
              <option
                v-for="department in $store.state.departments"
                :key="department.Id"
                :value="department.Name"
                >{{ department.Name }}</option
              >
            </select>
          </div>
          <div class="field-wrap">
            <label for="locationSelect">Location</label>
            <select
              id="locationSelect"
              name="location"
              v-model="selectedLocation"
            >
              <option value="*" selected>*</option>
              <option
                v-for="location in $store.state.locations"
                :key="location.Id"
                :value="location.Name"
                >{{ location.Name }}</option
              >
            </select>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ParamsForm extends Vue {
  public showMenu = false;
  public selectedAssignee = '*';
  public selectedSoftware = '*';
  public selectedReferredTo = '*';
  public selectedDepartment = '*';
  public selectedLocation = '*';

  public toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  public toggleMenuOuter(e: any) {
    if (e.target.className === 'click-finder active') {
      this.toggleMenu();
    }
  }

  public handleSubmit() {
    // if any params have been changed, reload the table with the new parameters
    let loadTickets = false;

    if (
      this.selectedAssignee &&
      this.selectedAssignee !== this.$store.state.selectedAssignee
    ) {
      loadTickets = true;
      this.$store.commit('selectAssignee', this.selectedAssignee);
    }
    if (
      this.selectedSoftware &&
      this.selectedSoftware !== this.$store.state.selectedSoftware
    ) {
      loadTickets = true;
      this.$store.commit('selectSoftware', this.selectedSoftware);
    }
    if (
      this.selectedReferredTo &&
      this.selectedReferredTo !== this.$store.state.selectedReferredTo
    ) {
      loadTickets = true;
      this.$store.commit('selectReferredTo', this.selectedReferredTo);
    }
    if (
      this.selectedDepartment &&
      this.selectedDepartment !== this.$store.state.selectedDepartment
    ) {
      loadTickets = true;
      this.$store.commit('selectDepartment', this.selectedDepartment);
    }
    if (
      this.selectedLocation &&
      this.selectedLocation !== this.$store.state.selectedLocation
    ) {
      loadTickets = true;
      this.$store.commit('selectLocation', this.selectedLocation);
    }

    this.showMenu = false;
    window.scrollTo(0, 0);
    if (loadTickets) {
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

      this.$router.push({
        name: 'home',
        query,
      });
      this.$store.dispatch('getTickets').catch((error) => console.log(error));
    }
  }

  public mounted() {
    this.$store.dispatch('setParams').catch((error) => console.log(error));

    this.$store.dispatch('getOwners').catch((error) => console.log(error));
    this.$store.dispatch('getSoftware').catch((error) => console.log(error));
    this.$store.dispatch('getReferredTo').catch((error) => console.log(error));
    this.$store.dispatch('getDepartment').catch((error) => console.log(error));
    this.$store.dispatch('getLocation').catch((error) => console.log(error));

    this.selectedAssignee = this.$store.state.selectedAssignee;
    this.selectedSoftware = this.$store.state.selectedSoftware;
    this.selectedReferredTo = this.$store.state.selectedReferredTo;
    this.selectedDepartment = this.$store.state.selectedDepartment;
    this.selectedLocation = this.$store.state.selectedLocation;
  }
}
</script>

<style lang="scss" scoped>
.form-background {
  margin: 0;
  padding: 0;
  width: 100%;
  background: #333;
  position: fixed;
  top: 0;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.75);
  z-index: 9;

  .button-back {
    background: #333;
    height: calc(16px + 0.355rem + 0.355rem + 20px);

    display: flex;

    .menu-button {
      display: block;
      margin: 10px auto;
    }
  }

  .report-params-form {
    margin: 1rem 1rem 0.75rem;

    animation: 0.1s linear slide_in;

    .form-group {
      display: flex;
      flex-wrap: wrap;
      border: none;
      padding: 0;
      margin: 0;

      .field-wrap {
        display: flex;
        flex-direction: column;

        label {
          margin: 0.3rem;
        }

        .options {
          list-style-type: none;
          position: fixed;
          padding: 5px 18px 5px 5px;
          margin: -0.3rem 0.3rem 0.3rem;
          border: 1px solid black;
          background-color: #444;

          .option {
            &:hover {
              background: #555;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

.click-finder.active {
  position: fixed;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.16);
  animation: 0.1s linear fade;
}

@keyframes slide_in {
  from {
    margin-top: calc(-0.355rem - 0.355rem - 16px - 20px);
  }
  to {
    margin-top: 1rem;
  }
}

@keyframes fade {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.16);
  }
}

@media print {
  .form-background,
  .form-background * {
    display: none;
  }
}
</style>
