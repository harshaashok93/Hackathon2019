<template>
  <div class="analyst-layout">
    <h4>Top Rated Analysts</h4>
    <div class="scene" v-for="item in analystdata">
      <div class="box">
        <div class="front face">
          <img :src="item.avatar_url" class="analyst-avatar-image" :alt="item.display_name" />
        </div>
        <div class="right face">
          <p>{{ item.rating_value }}</p>
        </div>
      </div>
      <a :href="'/our-department/analysts/'+ item.client_code + '/'">{{ item.display_name }}</a>
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
    width: 140px;
    float: right;
    margin-right: 75px;
    padding: 10px 0;
    border-top: 1px solid #e9e9e9;
    box-shadow: 1px 0 4px 1px rgba(0,0,0,0.1)
  }
  .analyst-layout h4 {
    text-align: center;
  }
  .scene {
    width: 90px;
    min-height: 100px;
    margin: 0 auto 10px;
  }

  .scene a {
    display: block;
    font-size: 14px;
    text-align: center;
  }

  .box {
    width: 100%;
    height: 80px;
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
    /* background-color: #e9e9e9; */
    background-color: transparent;
  }

  .right {
    transform: rotateY(90deg);
    left: 80px;
    /* background-color: #e9e9e9; */
    background-color: transparent;
    color: #393e46;
    font-size: 0.8rem;
  }

  .front img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 0 5px;
  }

  .right p {
    height: 80px;
    font-size: 25px;
    margin: 0;
    text-align: center;
    padding-top: 25px;
  }
</style>
