<template>
  <div class="main-page">
      <leftLayout
        :tab1="tab1"
        :tab2="tab2"
        :dropdownData="dropdownData"
      />
      <analystLayout
        :analystdata="analystdata"
      />
  </div>
</template>
<script>
import LeftLayout from './LeftLayout'
import AnalystLayout from './AnalystLayout'
import axios from 'axios';

export default {
  name: 'MainPage',
  components: {
    LeftLayout,
    AnalystLayout
  },
  data() {
    return {
        tab1: [],
        tab2: [],
        analystdata: [],
        dropdownData: {}
    }
  },
  mounted: function() {
    this.FetchData();
  },
  methods: {
    FetchData: function() {
      var app = this;
      axios.get('http://192.168.3.147:8000/api/v1/hackathon/topRatedPublications/').then(response => {
        app.tab1 = response.data.publications.topRated;
        app.tab2 = response.data.publications.trending;
        app.analystdata = response.data.analysts;
        app.dropdownData = response.data.dropdownData;
      });
    }
  }
}
</script>
<style>
    .main-page {
        padding: 0px 10px;
        display: inline-block;
        width: 100%;
    }
</style>
