<template>
  <div class="tab-layout">
    <div class="tab-div">
        <div class="top-rate"><button @click="show1 = true, show2 = false">Top Rated</button></div>
        <div class="trending"><button @click="show2 = true, show1 = false">Trending</button></div>
    </div>
    <div class="tab1" v-if="show1">
        <ul>
            <li v-for="item in tab1">
                {{ item._source.title }}
            </li>
        </ul>
    </div>
    <div class="tab2" v-if="show2">
        <ul>
            <li v-for="item in tab2">
                {{ item._source.title }}
            </li>
        </ul>
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
  }
  .tab-div {
    display: inline-block;
    width: 100%;
  }
  .top-rate {
    width: 49%;
    display: inline-block;
    text-align: center;
  }
  .trending {
    width: 49%;
    display: inline-block;
    text-align: center;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>


