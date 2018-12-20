import Vue from 'vue';
import axios from 'axios';

// `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
// 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://localhost:3001';
    console.log(axios.defaults.baseURL, '开发');
}
else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = 'http://localhost:3001';
    console.log(axios.defaults.baseURL, 789);
}
const httpPulgin = {
    install: function (Vue) {
        let axiosCase1 = axios.create();
        // 需要判断是否登录时用 axiosCase2
        let axiosCase2 = axios.create({
            // 设置响应头
            headers: {'Authorization': ''}
        });
        axiosCase2.interceptors.request.use(function (config) {
            console.log(config);
        }, function (error) {
        // 对请求错误做些什么
            return Promise.reject(error);
        });

        Object.defineProperty(Vue.prototype, '$http', {
            value: axiosCase1
        });

        Object.defineProperty(Vue.prototype, '$http_token', {
            value: axiosCase2
        });
    }
};

Vue.use(httpPulgin);
