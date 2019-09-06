<template>
  <div class="tab-layout">
    <div class="tab1">
        <ul>
            <li v-for="item in tab1">
                {{ item._source.title }}
            </li>
        </ul>
    </div>
    <div class="tab2">
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
}
</script>
<style>
  .tab-layout {
    display: inline-block;
    width: 100%;
  }
</style>


