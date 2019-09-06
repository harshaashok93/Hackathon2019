<template>
  <div class="analyst-layout">
    <div class="scene">
      <div class="box" v-for="item in analystdata">
        <div class="front face">
          {{ item.display_name }}
        </div>
        <div class="right face">
          <p>{{ item.rating_value }}</p>
        </div>
      </div>
    </div>
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
  .scene {
    width: 90px;
    height: 100px;
  }
  .box {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: all 0.5s ease-out;
    transform-origin: 0 0;
  }
  .scene:hover .box {
    transform: rotateY(-90deg);
    cursor: pointer;
  }
  .face {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
  }
  .front {
    transform: rotateY(0deg);
    background-color: #393e46;
  }
  .right {
    transform: rotateY(90deg);
    background-color: #fcda05;
    color: #393e46;
    font-size: 0.8rem;
  }
</style>


