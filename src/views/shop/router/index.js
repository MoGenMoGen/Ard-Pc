import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import shop from "../components/shop.vue";
import shopDetail from "../components/shopDetail.vue"

export default new VueRouter({
  routes: [
    {
      path: "",
      redirect: "/shop"
    },
    {
      path: "/shop",
      component: shop
    },
    {
      path: "/shopDetail",
      component: shopDetail
    }
  ]
});
