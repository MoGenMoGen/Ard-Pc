// require ('assets/css/index.less');
 require ('assets/css/common.css');

// require ('assets/css/reset.css');
// require ('assets/css/help.css');
// require ('assets/css/mobile.less');
// require ('assets/css/project.less');
// import 'assets/js/ScreenAdaptive.js';

// import 'bootstrap/dist/css/bootstrap.min.css'
import "element-ui/lib/theme-chalk/index.css";
import ElementUI from 'element-ui';


 import "babel-polyfill";// 解决 IE11 Promise对象未定义
// import axios from 'axios';
import './vueFilter';  	//全局过滤器
import {until,reg,app} from 'assets/js/until'
import 'assets/js/wconfig.js';
import './iconfont'  //字体库
import './wconfig.js'
import {Query} from 'assets/js/query'
import {api} from './api'
import store from './store'
// import 'assets/js/Ios';
// import 'assets/js/WebViewJavascriptBridge';
// import Router from 'vue-router'
const hostUrl='http://mx.jiaxiangtech.com/wechat';
import saveAs from 'file-saver';
var FileSaver = require('file-saver');
import echarts from 'echarts'
export default{
  install(Vue){
    Vue.use(ElementUI)
    // Vue.use(FileSaver)
    // Vue.prototype.axios = axios;
    Vue.prototype.api=new api();
    Vue.prototype.store = store.store;
    Vue.prototype.$echarts = echarts
    Vue.prototype.FileSaver = FileSaver;
    Vue.prototype.hostUrl=hostUrl;
    Vue.prototype.until = new until();
    Vue.prototype.app=new app();
    Vue.prototype.reg = new reg();
    Vue.prototype.Query = Query;

  }
}


