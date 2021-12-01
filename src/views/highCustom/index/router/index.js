import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import cart from "../components/batch.vue";
import customize from "../components/customize.vue";
import comfirmOrder from "../components/confirmOrder.vue"

export default new VueRouter({
  routes: [
    {
      path: "",
      redirect: "/customize"
    },
    {
      path: "/customize",
      component: customize
    },
    {
      path: "/cart",
      component: cart
    },
    {
      path:'/order',
      component:comfirmOrder
    }
  ]
});
