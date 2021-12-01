import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    cartNum:0,
  },
  mutations:{
    setCartNum: (state,data) => {
      state.cartNum = data
    },
  },
});

export default {
  store
}
