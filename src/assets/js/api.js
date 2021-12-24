import { until } from "./until";
const untilApi = new until();
import { Message } from "element-ui";
// const hosturl='https://order.ilikeit-runner.com'
const hosturl='https://order.ilikeit-runner.com'
class api {
  //产品线
  getProductCatList() {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/cat/api/list").then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }

  //功能
  getProFunctionList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/fun/api/list", data).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }

  //形状
  getProShapeList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/shape/api/list", data).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }

  //面板材质
  getProPanelMaterialList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/panelMaterial/api/list", data).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }

  //获取产品属性(根据前4个的id去查)
  getProductByMaterial(data) {
    return new Promise((resolve, reject) => {
      untilApi
        .get(`/crm/specialProduct/api/${data}/findByMaterial`)
        .then(res => {
          if (res.code === 0) {
            resolve(res.data);
          }
        });
    });
  }

  //下一步获取物品属性
  getProductAttributeByProNo(data) {
    return new Promise((resolve, reject) => {
      untilApi.get(`/crm/attribute/api/${data}/list`).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }

  //获得商品的排序属性集合
  getProductAttributeByProNoSort(data) {
    return new Promise((resolve, reject) => {
      untilApi.get(`/crm/attribute/api/${data}/linkList`).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }

  //pc登录
  postSysLogin(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/general/access/pcLogin", data).then(res => {
        resolve(res);
      });
    });
  }

  //退出
  getSysLoginOut() {
    return new Promise((resolve, reject) => {
      untilApi.get("/general/access/logout").then(res => {
        resolve(res);
      });
    });
  }

  //加入购物车
  postSysAddCart(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/cart/api/save", data).then(res => {
        resolve(res);
      });
    });
  }

  //批量加入购物车
  postSysBatchAddCart(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/cart/api/batchSave", data).then(res => {
        resolve(res);
      });
    });
  }

  //购物车列表
  getSysCartList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/cart/api/page", data).then(res => {
        resolve(res);
      });
    });
  }

  //项目报备
  getSysProjectList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/report/api/page", data).then(res => {
        resolve(res.data);
      });
    });
  }

  //我的消息
  getMessage(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/msg/api/page", data).then(res => {
        resolve(res);
      });
    });
  }

  //收货地址列表

  getAddress(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/address/api/page", data).then(res => {
        resolve(res);
      });
    });
  }
  //获得营业网点列表
  getNetwork(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/network/api/page", data).then(res => {
        resolve(res);
      });
    });
  }
  //获得营业网点List信息
  getNetworkList(){
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/network/api/myList").then(res => {
        resolve(res);
      });
    });
  }

  //列表，不分页
  getAddressList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/address/api/page", data).then(res => {
        resolve(res.data.result);
      });
    });
  }

  //地址详情
  getSysAddressInfo(data) {
    return new Promise((resolve, reject) => {
      untilApi.get(`/crm/receiveAddress/info/${data}`).then(res => {
        resolve(res.data);
      });
    });
  }
  //网点信息详情
  getSysNetwork(data) {
    return new Promise((resolve, reject) => {
      untilApi.get(`/crm/network/api/info/${data}`).then(res => {
        resolve(res.data);
      });
    });
  }
  //我的经销商分页列表
  getDistributor(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/agent/api/page", data).then(res => {
        resolve(res.data);
      });
    });
  }

  getSysDistributorList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/agent/api/list", data).then(res => {
        resolve(res.data);
      });
    });
  }
  //商品分类列表
  getClassify(data) {
    return new Promise((resolve, reject) => {
      untilApi
        .get("/crm/standardCategory/listItmTableTreeNode?status=1")
        .then(res => {
          resolve(res.data.list);
        });
    });
  }

  //商品列表
  getProList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/standardProduct/api/page", data).then(res => {
        resolve(res.data);
      });
    });
  }

  //商品详情
  getProInfo(id) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/standardProduct/api/" + id + "/info").then(res => {
        resolve(res.data);
      });
    });
  }

  //我的订单
  myOrder(data) {
    return new Promise(resolve => {
      untilApi.get("/crm/order/api/page", data).then(res => {
        resolve(res);
      });
    });
  }

  //补货订单
  myOrderBH(data) {
    return new Promise(resolve => {
      untilApi.get("/crm/order/api/listForBH", data).then(res => {
        resolve(res);
      });
    });
  }
  //订单详情
  getOrdInfo(id) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/order/api/" + id + "/info").then(res => {
        resolve(res.data);
      });
    });
  }

  //获取个人信息，传token
  getPersonalInformation() {
    return new Promise((resolve, reject) => {
      untilApi.get("/wxMa/access/getUserInfoByToken").then(res => {
        resolve(res);
      });
    });
  }

  //更改用户密码
  postChangePsd(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/user/api/resetPassword", data).then(res => {
        resolve(res);
      });
    });
  }

  //意见反馈
  postFeedback(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/feedBack/api/save", data).then(res => {
        resolve(res);
      });
    });
  }

  //获取付款列表
  getPayInfo(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/pay/api/page", data).then(res => {
        resolve(res);
      });
    });
  }
  //获取省市区三级数据
  getRegion(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/region/api/list", data).then(res => {
        resolve(res);
      });
    });
  }
  //省市区全部数据
  getAddr() {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/region/listItmTableTreeNode?pid=0", "").then(res => {
        resolve(res);
      });
    });
  }
  //收货地址添加/编辑
  addrAdd(data) {
    return untilApi.post("/crm/address/api/save", data);
  }

  //营业网点添加/编辑
  networkAdd(data) {
    return untilApi.post("/crm/network/api/add", data);
  }
  //收货地址删除
  addrDelet(id) {
    return untilApi.get("/crm/address/api/" + id + "/del");
  }
  //营业网点删除
  networkDelet(id) {
    return untilApi.get("/crm/network/api/del?ids=" + id );
  }
  //物流信息
  logistics(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/orderExpressInfo/page", data).then(res => {
        resolve(res.data);
      });
    });
  }
  //轮播图
  getBaseDataOfAd(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/ad/api/list", data).then(res => {
        resolve(res);
      });
    });
  }
  //下订单
  sysSaveOrder(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/order/api/save", data).then(res => {
        resolve(res);
      });
    });
  }
  //修改订单
  sysUpdateOrder(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/order/api/upd", data).then(res => {
        resolve(res);
      });
    });
  }
  //变更订单
  sysChangeOrder(data) {
    console.log('变更订单')
    return new Promise((resolve, reject) => {
      untilApi.postData("/crm/order/api/changeOrder", data).then(res => {
        resolve(res);
      });
    });
  }
  //删除购物车
  sysDelCart(data) {
    return untilApi.post("/crm/cart/api/del", data);
  }

  //删除批次
  sysDelCartBatch(data) {
    return untilApi.post("/crm/cartCat/api/del", data);
  }
  //修改购物车数量
  editCartNum(data) {
    return new Promise((resolve, reject) => {
      untilApi.postData("/crm/cart/api/upd", JSON.stringify(data)).then(res => {
        resolve(res);
      });
    });
  }

  //模糊搜索产品编号
  sysSearchProductNo(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/specialProduct/api/list", data).then(res => {
        resolve(res);
      });
    });
  }
  //消息已经阅读接口
  getMessageRead(msgId, userId) {
    return untilApi.get("/crm/msg/api/" + msgId + "/" + userId + "/info");
  }
  //消息删除
  messageDelet(id, userId) {
    return untilApi.get("/crm/msg/api/" + id + "/" + userId + "/del");
  }
  //得到约束条件
  getCheckRestrictionsList(data) {
    return new Promise((resolve, reject) => {
      untilApi
        .get(`/crm/attribute/api/getCheckList?valIds=${data}`, "")
        .then(res => {
          resolve(res.data);
        });
    });
  }
  //后台首页数据（除地图外）
  adminData(data) {
    return untilApi.get("/crm/trigger/homePageStatistics", data);
  }
  //后台首页数据（地图）
  adminMap(data) {
    return untilApi.get("/crm/trigger/homeMapPageStatistics", data);
  }
  //数据字典
  getBaseDictionaryList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get(`/crm/syscat/api/listByPcd?cd=${data}`).then(res => {
        resolve(res.data);
      });
    });
  }
  //获取订单审批记录
  getSysOrderCheckList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/order/api/getOrderCheckInfo", data).then(res => {
        resolve(res.data);
      });
    });
  }
  //获取订单审批记录
  getSysOrderStatisData(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/order/api/getOrderPriceStatistics", data).then(res => {
        resolve(res.data);
      });
    });
  }
  //确认收货
  postFinishOrder(data) {
    return new Promise((resolve, reject) => {
      untilApi
        .postData("/crm/order/api/finishOrder", JSON.stringify(data))
        .then(res => {
          resolve(res);
        });
    });
  }
  //订单不同状态的数量
  getDiffrentStatusOrderCount(data) {
    return new Promise((resolve, reject) => {
      untilApi
        .get("/crm/order/api/getEveryStatusOrderTotal", data)
        .then(res => {
          resolve(res.data);
        });
    });
  }
  //取消订单
  postCancelOrder(data) {
    return new Promise((resolve, reject) => {
      untilApi
        .postData("/crm/order/api/cancelOrder", JSON.stringify(data))
        .then(res => {
          resolve(res);
        });
    });
  }

  //我的订单增加项次
  postAddNewOrderItem(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/order/api/addOrderItem", data).then(res => {
        resolve(res);
      });
    });
  }
  //修改收货地址
  postEditOrderReveiveAddress(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/order/api/updAddress", data).then(res => {
        resolve(res);
      });
    });
  }
  //购物车批次
  getCartBatchList(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/cartCat/api/page", data).then(res => {
        resolve(res);
      });
    });
  }
  //分页查询购物车批次
  getCartBatchListByPage(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/cartCat/api/page2", data).then(res => {
        resolve(res);
      });
    });
  }
  //得到所有批次数据
  getAllBatchDataByList() {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/cartCat/api/list").then(res => {
        resolve(res.data);
      });
    });
  }
  //根据选择批次得到购物车数据
  getCartListByBatch(data) {
    return new Promise((resolve, reject) => {
      untilApi
        .post("/crm/cart/api/getCartInfoRoByCartCatIds", data)
        .then(res => {
          resolve(res.data);
        });
    });
  }

  //修改批次备注
  postMoidfyBatchCart(data) {
    return new Promise((resolve, reject) => {
      untilApi.post("/crm/cartCat/api/upd", data).then(res => {
        resolve(res);
      });
    });
  }

  //上传图片
  postSendPicToService(data) {
    return new Promise((resolve, reject) => {
      untilApi.upIlikeImg(data).then(
        res => {
          resolve(res);
        },
        rej => {
          Message.error({
            message: rej
          });
          reject(rej);
        }
      );
    });
  }

  //得到付款列表（根据用户）
  getPayListAccordingToUser(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/order/api/payPage", data).then(res => {
        resolve(res.data);
      });
    });
  }

  //得到付款列表（根据订单）
  getPayListAccordingToOrderNo(data) {
    return new Promise((resolve, reject) => {
      untilApi.get("/crm/order/api/payLog", data).then(res => {
        resolve(res);
      });
    });
  }

  //根据id得到批次名称
  getBatchRemarkAccordingToId(id) {
    return new Promise((resolve, reject) => {
      untilApi.get(`/crm/cartCat/api/info/${id}`).then(res => {
        resolve(res.data);
      });
    });
  }


  //根据id得到经销商的订单类型
  getAgentOrdrType(id) {
    return untilApi.get('/crm/agent/api/agentOrderType/'+id);
  }

  //复制订单确定
  copyOrderComfirm(data){
    return untilApi.post('/crm/order/api/copy',data)
  }

  //确定/取消订单变更 、
  changeOrder(data) {
    return new Promise((resolve, reject) => {
      untilApi.postData("/crm/order/api/submitChange", data).then(res => {
        resolve(res);
      });
    });
  }
   //我的积分头部
   getOneAllPoints(data) {
     return new Promise((resolve, reject) => {
       untilApi.get('/crm/pointsLog/apis/oneAllPoints',data).then(res => {
         resolve(res.data);
       });
     });
   }
   //我的积分（可用积分）
    getAvailablePoints(data) {
      return new Promise((resolve, reject) => {
        untilApi.get('/crm/pointsLog/apis/availablePoints',data).then(res => {
          resolve(res);
        });
      });
    }
    //我的积分（总积分）
     getAllPoints(data) {
       return new Promise((resolve, reject) => {
         untilApi.get('/crm/pointsLog/apis/allPoints',data).then(res => {
           resolve(res);
         });
       });
     }
     //我的积分（已使用）
      getPointsUsed(data) {
        return new Promise((resolve, reject) => {
          untilApi.get('/crm/pointsLog/apis/pointsUsed',data).then(res => {
            resolve(res);
          });
        });
      }
      //我的积分（即将过期）
       getAboutToExpirePoints(data) {
         return new Promise((resolve, reject) => {
           untilApi.get('/crm/pointsLog/apis/aboutToExpirePoints',data).then(res => {
             resolve(res);
           });
         });
       }
}

export { api };
