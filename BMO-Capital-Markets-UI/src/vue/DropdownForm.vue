<template>
  <div class="dropdown-form-container">
    <h3>Search based on your follows:</h3>
    <b-form class="follow-dropdown-form" @submit="onSubmit" @reset="onReset" v-if="show">

      <b-form-group id="input-group-3" label="Company:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.companies"
          :options="dropdownData.companies"
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-group-3" label="Analyst:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.analysts"
          :options="dropdownData.analysts"
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-group-3" label="Sector:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.sectors"
          :options="dropdownData.sectors"
        ></b-form-select>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ resp.length }}</pre>
    </b-card> -->
    <CardContainer
        :publicationList="resp"
    />
  </div>
</template>

<script>
  import CardContainer from './CardContainer.vue';
  import axios from 'axios';

  export default {
    name: 'DropdownForm',
    components: {
        CardContainer
    },
    props: {
        dropdownData: {
            type: Object,
            default: () => {},
        }
    },
    mounted: function() {
        this.FetchData();
    },
    data() {
      return {
        form: {
            companies: '',
            analysts: '',
            sectors: ''
        },
        resp: [],
        show: true
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        var data = {
            companies: [this.form.companies],
            analysts: [this.form.analysts],
            sectors: [this.form.sectors]
        }
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
        this.form.companies = ''
        this.form.analysts = ''
        this.form.sectors = ''
        this.resp = []
      },
      FetchData: function() {
        var data = {
            companies: [],
            analysts: [],
            sectors: []
        }
        axios.post(
            'http://192.168.3.147:8000/api/v1/hackathon/searchPublications/',
            data
        ).then(response => {
            this.resp = response.data;
        });
      }
    }
  }
</script>

<style>
    .dropdown-form-container {
        margin: 20px;
        padding-bottom: 20px;
    }
    form.follow-dropdown-form {
        width: 100%;
    }
    #input-group-3 {
        display: inline-block;
        width: 270px;
    }
    #input-group-3 div select {
        width: 100%;
    }
</style>
