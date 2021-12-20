import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import home from "../components/home.vue";
import highCustom from "../../../highCustom/index/app.vue";
import customize from "../../../highCustom/index/components/customize.vue";
import cart from "../../../highCustom/index/components/batch.vue";
import confirmOrder from "../../../highCustom/index/components/confirmOrder.vue";
import shop from "../../../shop/app.vue";
import shopList from "../../../shop/components/shop.vue";
import shopDetail from "../../../shop/components/shopDetail.vue";
import link from "../components/link.vue";
import service from "../components/service.vue";
import Personal from "../views/personal";
import Order from "../views/order";
import ChangePass from "../views/changePass";
import Feedback from "../views/feedback";
import Message from "../views/message";
import Distributor from "../views/distributor";
import Myaddress from "../views/myaddress";
import Saleoutlet from "../views/saleoutlet";
import Paydetail from "../views/paydetail";
import Integral from "../views/myintegral";
import AccountManager from "../views/account";
import MessageDetail from "../views/messageDetail";
import Mynetwork from "../views/mynetwork"

const router = new VueRouter({
  routes: [
    { path: "", redirect: "/home" },
    {
      path: "/home",
      component: home,
      meta: {
        title: "首页"
      }
    },
    {
      path: "/highcustom",
      component: highCustom,

      children: [
        { path: "", redirect: "customize" },
        {
          path: "customize",
          component: customize,
          meta: {
            title: "高端定制"
          }
        },
        {
          path: "cart",
          component: cart,
          meta: {
            title: "购物车"
          }
        },
        {
          path: "order",
          component: confirmOrder,
          meta: {
            title: "确认订单"
          }
        }
      ],
      redirect: "customize"
    },
    {
      path: "/shop",
      component: shop,
      children: [
        { path: "", redirect: "shopList" },
        {
          path: "order",
          component: confirmOrder,
          meta: {
            title: "确认订单"
          }
        },
        {
          path: "shopList",
          component: shopList,
          meta: {
            title: "ILI商城"
          }
        },
        {
          path: "shopDetail",
          component: shopDetail,
          meta: {
            title: "商品详情"
          }
        }
      ]
    },
    {
      path: "/link",
      component: link,
      meta: {
        title: "案例展示"
      }
    },
    {
      path: "/service",
      component: service,
      children: [
        { path: "", redirect: "personal" },
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        {
          path: "personal",
          component: Personal,
          meta: {
            title: "个人中心"
          }
        },
        {
          path: "order",
          component: Order,
          meta: {
            title: "我的订单"
          }
        },
        {
          path: "changepass",
          component: ChangePass,
          meta: {
            title: "修改密码"
          }
        },
        {
          path: "feedback",
          component: Feedback,
          meta: {
            title: "信息反馈"
          }
        },
        {
          path: "message",
          component: Message,
          meta: {
            title: "我的消息"
          }
        },
        {
          path: "distributor",
          component: Distributor,
          meta: {
            title: "我的经销商"
          }
        },
        {
          path: "myaddress",
          component: Myaddress,
          meta: {
            title: "收货地址"
          }
        },
        {
          path: "mynetwork",
          component: Mynetwork,
          meta: {
            title: "营业网点"
          }
        },
        {
          path: "saleoutlet",
          component: Saleoutlet,
          meta: {
            title: "营业网点"
          }
        },
        {
          path: "paydetail",
          component: Paydetail,
          meta: {
            title: "付款详情"
          }
        },
        {
          path: "integral",
          component: Integral,
          meta: {
            title: "我的积分"
          }
        },
        {
          path: "account",
          component: AccountManager,
          meta: {
            title: "账户管理"
          }
        },
        //查看物流页面，临时的
        {
          path: "messagedetail",
          component: MessageDetail,
          meta: {
            title: "消息详情"
          }
        }
        // ...其他子路由
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  //beforeEach是router的钩子函数，在进入路由前执行

  if (to.meta.title) {
    //判断是否有标题
    document.title = to.meta.title;
  }
  next(); //执行进入路由，如果不写就不会进入目标页
});

export default router;
