import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    token: '',
    username: '',
    uid: '',
    email: '',
    password: ''
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
    }
}

export default new Vuex.Store({
    state,
    mutations
})