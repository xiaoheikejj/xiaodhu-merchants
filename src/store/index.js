import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    token: '',
    username: '',
    uid: '',
    email: '',
    password: '',
    isCollapse: false,
    title: "商户后台管理系统"
}

const mutations = {
    getInitState(state,n){
        state.token = n.token;
        state.username = n.username;
        state.uid = n.uid;
        state.email = n.email;
        state.password = n.password;
    },
    add(state,n){
        state.num += n;
    },
    reduce(state){
        state.num--;
    },
    reduceCollapse(state) {
        state.isCollapse = state.isCollapse ? false : true
        if (state.isCollapse === false) {
            state.title = "商户后台管理系统";
        } else {
            state.title = "";
        }
    }
}

export default new Vuex.Store({
    state,
    mutations
})
