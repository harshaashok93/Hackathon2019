<template>
  <div class="analyst-layout">
    <ul>
        <li v-for="item in analystdata">
          {{ item.display_name }}
        </li>
    </ul>
  </div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';

export default {
  name: 'AnalystLayout',
  props: {
    analystdata: {
      type: Array,
      default: () => [],
    }
  }
}
</script>
<style>
  .analyst-layout {
    display: inline-block;
    width: 20%;
    vertical-align: top;
  }
</style>


