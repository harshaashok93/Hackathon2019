<template>
  <div class="analyst-layout">
    <div :class="'scene'+index" v-for="(item, index) in analystdata">
      <div :class="'box'+index" >
        <div class="front face">
          <img
            :src="item.avatar_url"
            class="card-image-tag"
            alt="...">
          <div class="display-name">{{ item.display_name }}</div>
        </div>
        <div class="right face">
          <p>{{ item.display_title || 'BMO Capital Markets Corp.'}}</p>
          <p>{{ item.role || 'Analyst'}}</p>
          <StarRating :star-size='20' :rating="item.rating_value" :read-only="true"></StarRating>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
import StarRating from 'vue-star-rating'

export default {
  name: 'AnalystLayout',
  props: {
    analystdata: {
      type: Array,
      default: () => [],
    }
  },
  components: {
    StarRating
  }
}
</script>
<style>
  .analyst-layout {
    display: inline-block;
    width: 20%;
    vertical-align: top;
  }
  .scene0, .scene1, .scene2, .scene3, .scene4 {
    width: 125px;
    height: 160px;
    margin: auto;
    margin-bottom: 10px;
  }
  .box0, .box1, .box2, .box3, .box4 {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: all 0.5s ease-out;
    transform-origin: 0 0;
  }
  .scene0:hover .box0 {
    transform: rotateY(-90deg);
    cursor: pointer;
  }
  .scene1:hover .box1 {
    transform: rotateY(-90deg);
    cursor: pointer;
  }
  .scene2:hover .box2 {
    transform: rotateY(-90deg);
    cursor: pointer;
  }
  .scene3:hover .box3 {
    transform: rotateY(-90deg);
    cursor: pointer;
  }
  .scene4:hover .box4 {
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
    background-color: #ffffff;
    box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.18);
  }
  img {
    width: 125px;
    height: 125px;
  }
  .display-name {
    text-align: center;
    color: #0079c1;
  }

  .right {
    transform: rotateY(90deg);
    background-color: #0079c1;
    color: #393e46;
    font-size: 0.8rem;
  }
  .vue-star-rating-rating-text {
    display: none;
  }
  p {
    font-size: 16px;
    color: #ffffff;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 5px;
  }
</style>


