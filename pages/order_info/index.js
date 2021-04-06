/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
import {
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js";
const app = getApp()
Page({
  data: {
    order: ""
  },

  onShow: function () {
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的goods_id参数
    let options = currentPage.options;
    const order_id = options.order_id;
    /*    console.log(goods_id);
       console.log("onShow"); */
    this.getOrderDetail(order_id);

  },

  getOrderDetail(order_id) {

    wx.request({
      url: "http://localhost/orderDetailServlet",
      data: {
        order_id
      },
      success: (res) => {
        console.log(res.data);
        this.setData({
          order: res.data
        })
      },

    });

  },


  // 取消订单 
  delOrder(e) {
    var order_id = e.currentTarget.dataset.order_id;
    console.log(order_id);
    wx.request({
      url: 'http://localhost/orderDelServlet',
      data: {
        order_id,
        user_id: app.globalData.user_id,
      },

      success: (result) => {
        console.log(result.data);
       
        wx.setStorageSync("orders", result.data);

        // 8 支付成功了 跳转到订单页面
        wx.redirectTo({
          url: '/pages/order/index?pay_status=0'
        }); 

        wx.showLoading({
          title: '取消成功',
        });

        setTimeout(function () {
          wx.hideLoading();
        }, 2000)
      },

    });

  }
  


})