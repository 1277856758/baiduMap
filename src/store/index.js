import Vue from 'vue';
import Vuex from 'vuex';
// import getters from "./getters.js";
// import mutations from "./mutations.js";
import modules from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules
});
export default store;
