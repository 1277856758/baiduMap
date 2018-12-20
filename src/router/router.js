import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const routes = [
    {
        path: '/',
        component: resolve => require(['../page/map.vue'], resolve),
        name: '/'
    },
    {
        path: './map',
        component: resolve => require(['../page/map.vue'], resolve),
        name: 'map'
    },
    {
        path: './echarts',
        component: resolve => require(['../page/echarts.vue'], resolve),
        name: 'echarts'
    },
    {
        path: './dynamicData',
        component: resolve => require(['../page/webSocket.vue'], resolve),
        name: 'dynamicData'
    },
    {
        path: './mapv',
        component: resolve => require(['../page/mapv.vue'], resolve),
        name: 'mapv'
    }
];
const router = new Router({
    mode: 'history',
    routes: routes
});
export default router;
