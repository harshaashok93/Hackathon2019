import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import Hello from './main.vue';
import BootstrapVue from 'bootstrap-vue';
import VueCarousel from 'vue-carousel';
import HighchartsVue from 'highcharts-vue';


Vue.use(BootstrapVue);
Vue.use(VueCarousel);
Vue.use(HighchartsVue);

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    el: '#vue',
    render: r => r(Hello),
  }
});

export const bootstrap = [
  vueLifecycles.bootstrap,
];

export const mount = [
  vueLifecycles.mount,
];

export const unmount = [
  vueLifecycles.unmount,
]
