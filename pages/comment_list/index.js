// pages/comment_list/index.js
/*
1 页面被打开的时候 onShow
0 onShow 不同于onLoad 无法在形参上接收 options参数
0.5 判断缓存中有没有token
1 没有 直接跳转到授权页面
2 有 直接往下进行
1 获取url上的参数com_status
2 根据com_status来决定页面标题的数组元素 哪个被激活选中
2 根据com_status 去发送请求获取订单数据
3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据
*/
const app = getApp()
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs: [{
        id: 0,
        value: "全部评论",
        isActive: true
      },
      {
        id: 1,
        value: "待评论",
        isActive: false
      }
    ],
    tabsId: 0,
    // 用来接收缓存comment数据
    comment: [],
    // 用来接收缓存orders数据
    order: [],
   
  },
  util: require('../../utils/util.js'), // 引入js文件,使用util.js中的函数


  onShow() {
    
    const orders = wx.getStorageSync("orders") || [];
    const comments = wx.getStorageSync("comments") || [];
    const token = wx.getStorageSync("token");
    /* 检测是否登录 */
    /*  if (!token) {
       wx.showToast({
         title: '请先登录',
         icon: 'none',
         image: '../../style/err.png',
         duration: 1000,
         success: function () {
           setTimeout(function () {
             wx.switchTab({
               url: '/pages/user/index'
             });
           }, 1000);
         }
       });
       return;
     } */



    this.setData({
      comment: comments,
      orders
    })

    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的com_status参数
    const com_status = currentPage.options.com_status;
    // 4 激活选中页面标题  因为获取到的com_status为字符串类型
    this.changeTitleByIndex(com_status - 0);

    this.getComment();

  },

     /* 获取我的评论 */
     getComment(){

      wx.request({
        url: 'http://localhost/commentFindServlet',
        data: {
          user_id: app.globalData.user_id,
        },
  
        success: (res) => {
        //  console.log(res.data);
          wx.setStorageSync("comments", res.data);
  
        },
      });
    },

 // 筛选未评论的方法
 getComOrders() {
  /*  const comments = wx.getStorageSync("comments") || [];
   // 筛选订单状态
   let orders = this.data.orders;
   var isComments = false;
   orders.forEach((v,g) => {
     // 获取时间格式的order_time
     var date = new Date(v.order_time);
     // 格式化order_time
     var d = this.util.formatData(date);
    
     // 将格式化的order_time赋值给format_time
     v.format_time = d;
    
     // 判断该订单是否被评论过
     comments.forEach((j,i) => {
       console.log(g);
       j.order_id == v.order_id ? orders.splice(g,1) : isComments=true
     })
   })
   console.log(orders);
   console.log("-----------");
   console.log(this.data.orders);
   // 将筛选后且时间格式化的新orders存入缓存
   wx.setStorageSync("orders", orders);
   this.setData({
     order: orders,
   }) */

     // 筛选订单状态
     let orders = this.data.orders.filter(v => v.com_status == 2);
    /*  orders.forEach(v => {
       // 获取时间格式的order_time
       var date = new Date(v.order_time);
       // 格式化order_time
       var d = this.util.formatData(date);
       // 将格式化的order_time赋值给format_time
       v.format_time = d
     })
     // 将筛选后且时间格式化的新orders存入缓存
     wx.setStorageSync("orders", orders); */
     this.setData({
       orders
     })

 },

  // 去评论
  handleToComment(e) {
    /* console.log(e.currentTarget.dataset.order_id); */
    const order_id = e.currentTarget.dataset.order_id
    const order_number = e.currentTarget.dataset.order_number
    wx.navigateTo({
      url: '/pages/comment/index?order_id=' + order_id +'&order_number='+order_number,
    });
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    /* onsole.log(index); */
    // 2 修改源数组
    let tabs = this.data.tabs;

    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs,
      tabsId: index
    })
  },


  handleTabsItemChange(e) {

    /* console.log(e.detail.index); */
    // 1 获取被点击的标题索引
    const index = e.detail.index;
    this.changeTitleByIndex(index);
    // 2 重新发送请求 如果为0,则为全部订单,不用调用getOrders方法
    console.log(index);
    if (index == 1) {
      this.getComOrders();
    } 
  },


})