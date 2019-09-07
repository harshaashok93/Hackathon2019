<template>
  <div class="left-layout-div">
      <tablayout
        :tab1="tab1"
        :tab2="tab2"
      />
      <searchLayout
        :search="search"
        :dropdownData="dropdownData"
      />
  </div>
</template>
<script>
import Tablayout from './Tablayout';
import SearchLayout from './SearchLayout';
import axios from 'axios';
export default {
  name: 'LeftLayout',
  mounted: function() {
    this.FetchData();
  },
  data() {
    return {
      search: [],
    }
  },
  props: {
    tab1: {
      type: Array,
      default: () => [],
    },
    tab2: {
      type: Array,
      default: () => [],
    },
    dropdownData: {
      type: Object,
      default: () => {},
    }
  },
  methods: {
    FetchData: function() {
      var app = this;
      axios.get('https://bmo-capital-markets-dev-ui-equity.galepartners.com/api/v1/health/').then(response => {
        app.search = [{ name: 'a', age: 1 },{ name: 'b', age: 2 },{ name: 'c', age: 3 },{ name: 'd', age: 4 }, { name: 'e', age: 5 }]
      });
    }
  },
  components: {
    Tablayout,
    SearchLayout,
  },
}
</script>
<style>
  .left-layout-div {
      display: inline-block;
      width: 80%;
      float: left;
  }
</style>
