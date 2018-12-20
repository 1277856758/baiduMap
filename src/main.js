// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store/';
import router from './router';
import './http/axios.js';
import './assets/css/rest.css';
import './utils/fontAwesome/index.js';
// import './mock';
require('echarts/lib/chart/bar'); // 引入柱状图组件
require('echarts/lib/chart/pie'); // 引入饼图组件
require('echarts/lib/component/tooltip'); // 引入提示框
require('echarts/lib/component/title'); // 引入title组件
Vue.prototype.$echarts = require('echarts/lib/echarts'); // 引入基本模板



Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
});
