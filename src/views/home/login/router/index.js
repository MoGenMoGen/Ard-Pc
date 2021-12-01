import Vue from "vue";
import VueRouter from "vue-router";
import forgetpass from "../components/forgetpass";
import login1 from "../components/login1"
Vue.use(VueRouter);



export default new VueRouter({
  routes: [

    { path: "/forgetpass", component: forgetpass },
    { path: "/login1", component: login1 },
    //重定向
    { path:"",component:login1}

  ]
});
