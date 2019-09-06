<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">

      <b-form-group id="input-group-3" label="Company:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.company"
          :options="dropdownData.companies"
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-group-3" label="Analyst:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.analyst"
          :options="dropdownData.analysts"
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-group-3" label="Sector:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.sector"
          :options="dropdownData.sectors"
        ></b-form-select>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ resp }}</pre>
    </b-card>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'DropdownForm',
    props: {
        search: {
        type: Array,
        default: () => [],
        },
        dropdownData: {
            type: Object,
            default: () => {},
        }
    },
    data() {
      return {
        form: {},
        resp: [],
        show: true
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        alert(JSON.stringify(this.form));
        var data = this.form;
        axios.post(
            'http://192.168.3.147:8000/api/v1/hackathon/searchPublications/',
            data
        ).then(response => {
            this.resp = response.data;
        });
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>

<style>
    #input-group-3 {
        display: inline-block;
    }
</style>
