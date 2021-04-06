//index.js
// 1.引入 用来发送请求的 方法 , 把路径写全
/* 
wx.navigateTo ：保留当前页，跳转到指定页,非tabBar；使用 wx.navigateBack 可以返回到当前的页面。

wx.redirectTo ：关闭当前页，跳转到指定页,非tabBar；将无法回到当前页面。

wx.switchTab ：只能用于跳转到tabbar页面，并关闭其他非tabbar页面。

wx.reLaunch ：是关闭所有页面，跳转到指定页,非tabBar的页面。
 */

import {
  request
} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    catesList: [],
    floorList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',      // json数据
    //   success: (result) => {
    //     this.setData({
    //   swiperList:result.data.message
    // })
    //   },
    //   fail: () => { },
    //   complete: () => { }
    // });

    // 2. 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题
    // requset({ url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata" })   // 最终放到...params中
    //   .then(result => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   })
    // .then()            //如果出现嵌套的情况,就可以再一个then
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  // 获取轮播图数据



  async getSwiperList() {
    const res = await request({
      url: "http://127.0.0.1/indexServlet",
      data: {
        position: '1'
      },
    });
    console.log(res.data);
    this.setData({
      swiperList: res.data
    })

    // request({
    //     url: "http://127.0.0.1/indexServlet",
    //     data: {
    //       position: '1'
    //     },
    //   }) // 最终放到...params中
    //   .then(result => {
    //     this.setData({
    //       swiperList: result.data
    //     })
    //   })
  },

  // 获取分类导航数据
  async getCateList() {
    const res = await request({
      url: "http://127.0.0.1/indexServlet",
      data: {
        position: '2'
      },
    });
    console.log(res.data);
    this.setData({
      catesList: res.data
    })
  },

  // 获取楼层数据
  async getFloorList() {
    const res = await request({
      url: "http://127.0.0.1/indexServlet",
      data: {
        position: '3'
      },
    });
    console.log(res.data);
    this.setData({
      floorList: res.data
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})