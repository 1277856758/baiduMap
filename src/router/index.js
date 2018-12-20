import Vue from 'vue';
import Router from 'vue-router';
const routes = [
    {
        path: '/',
        // 重定向
        component: resolve => require(['@/page/map.vue'], resolve)
    },
    {
        path: '/map',
        component: resolve => require(['@/page/map.vue'], resolve),
        name: 'map'
    },
    {
        path: '/echarts',
        component: resolve => require(['@/page/echarts.vue'], resolve),
        name: 'echarts'
    },
    {
        path: '/mapv',
        component: resolve => require(['@/page/mapv.vue'], resolve),
        name: 'mapv'
    },
    {
        path: '/routing',
        component: resolve => require(['@/page/routing.vue'], resolve),
        name: 'routing'
    },
    {
        path: '/animation',
        component: resolve => require(['@/page/mapvAnimation.vue'], resolve),
        name: 'animation'
    },
    {
        path: '/webSocket',
        component: resolve => require(['@/page/webSocket.vue'], resolve),
        name: 'webSocket'
    },
    {
        path: '/webSocket1',
        component: resolve => require(['@/page/webSocket1.vue'], resolve),
        name: 'webSocket1'
    },
    {
        path: '/h5Api',
        component: resolve => require(['@/page/h5Api.vue'], resolve),
        name: 'h5Api'
    }
];
const router = new Router({
    routes: routes,
    mode: 'history'
});
router.beforeEach((to, from, next) => {
    next();
});
export default router;
Vue.use(Router);
