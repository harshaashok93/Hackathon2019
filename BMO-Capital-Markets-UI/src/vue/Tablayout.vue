<template>
  <div class="tab-layout">
    <div class="tab-div">
        <div class="tab top-rated" :class="show1 ? 'enabled' : false ">
          <button type="button" class="btn btn-link" @click="show1 = true, show2 = false">Top Rated</button>
        </div>
        <div class="tab trending" :class="show2 ? 'enabled' : false ">
          <button type="button" class="btn btn-link" @click="show2 = true, show1 = false">Trending</button>
        </div>
    </div>
    <div class="tab-content tab1" v-if="show1">
      <div class="card" v-for="item in tab1">
        <div class="title">{{ item._source.title }} ({{ item._source.tags.research_type }})</div>
        <div class="link"><a :href="'/research/' + item._source.product_id" class="card-link">View publication</a></div>
      </div>
    </div>
    <div class="tab-content tab2" v-if="show2">
        <div class="card" v-for="item in tab2">
          <div class="title">{{ item._source.title }} ({{ item._source.tags.research_type }})</div>
          <div class="link"><a :href="'/research/' + item._source.product_id" class="card-link">View publication</a></div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Tablayout',
    props: {
      tab1: {
        type: Array,
        default: () => [],
      },
      tab2: {
        type: Array,
        default: () => [],
      }
    },
    data() {
      return {
        show1: true,
        show2: false,
      }
    }
  }
</script>

<style>
  .tab-layout {
    display: inline-block;
    width: 100%;
    margin-left: 40px;
    margin-bottom: 20px;
    padding: 20px;
    border-top: 1px solid #e9e9e9;
    box-shadow: 1px 0 4px 1px rgba(0,0,0,0.1)
  }
  .tab-div {
    display: inline-block;
    width: 100%;
  }
  .tab {
    width: 50%;
    display: inline-block;
    text-align: center;
    background: #e9e9e9;
    border-radius: 5px;
    float: left;
  }
  .tab.top-rated {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .tab.trending {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .tab button {
    color: black;
    text-decoration: none !important;
  }
  .tab.enabled button {
    color: white;
    text-decoration: none !important;
  }
  .tab.enabled {
    background: #0079c1;
  }
  .tab-content {
      display: block;
      width: 100%;
  }
  .tab-content .card {
      display: block;
      width: 100%;
      height: 60px;
      border: 1px solid #e9e9e9;
  }
  .tab-content .card div.title {
      display: inline-block;
      padding: 17px 0 0 20px;
  }
  .tab-content .card div.link {
      display: inline-block;
      float: right;
      padding: 17px 20px 0 0;
  }
  button {
    background: transparent;
    border: none;
  }
  button:focus {
    outline: none;
  }
  li {
    min-height: 50px;
    border-bottom: solid 1px #b3b3b3
  }
</style>
