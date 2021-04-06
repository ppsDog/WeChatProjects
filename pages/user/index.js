// pages/user/index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},

    userName:"",
    // 判断是否由用户信息
    hasUserInfo: false,
    // 被收藏的商品的数量
    collectNums: 0,
    // 评论的商品的数量
    commentNums: 0,

    sellListNums: 0,

    historyNums: 0,
  },

  getUserInfo: function (e) {
    const comments = wx.getStorageSync("comments") || [];
    const sellList = wx.getStorageSync("sellList") || [];
    const collect = wx.getStorageSync("collect") || [];
    // console.log(e.detail.userInfo)
    /*  console.log("2")
     console.log(e) */
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      collectNums: collect.length,
      commentNums: comments.length,
      userName:app.globalData.userName,
    })
    app.globalData.userInfo = e.detail.userInfo,
      app.login();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading();
    }, 2000)
    //  wx.setStorage异步存储缓存, wx.getStorage异步读取缓存
    //  wx.setStorageSync同步存储缓存, wx.getStorageSync同步读取缓存
    // 在实际开发中,存储缓存用异步,而读取缓存一般使用同步
    // wx.setStorage({
    //   data: {
    //     name : 'wang',
    //     isLogin : true
    //   },
    //   key: 'state',
    //   success:function(res){
    //     wx.showToast({
    //       title: '存储成功',
    //     })
    //   }

    // })

    // wx.getStorage({
    //   key: 'state',
    //   success:function(res){
    //     console.log(res.data)
    //   }
    // })

    // var login = wx.getStorageSync('state')
    // console.log(login)

    // 先从全局变量中获取用户信息
    /*     if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        } else{
          //没有获取到全局变量的userInfo,那么要通过回调函数,在app.js中成功获取到用户信息后传回userInfo
          // 为app对象添加一个回调函数,将userInfo传回
          app.userInfoReadyCallback = res => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        } */
    // console.log(app.globalData.userInfo)

  },

  onShow() {
    const comments = wx.getStorageSync("comments") || [];
    const history = wx.getStorageSync("history") || [];
    const collect = wx.getStorageSync("collect") || [];
    const sellList = wx.getStorageSync("sellList") || [];
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        collectNums: collect.length,
        commentNums: comments.length,
        sellListNums: sellList.length,
        historyNums: history.length,
        userName:app.globalData.userName,
      })
    } else {
      //没有获取到全局变量的userInfo,那么要通过回调函数,在app.js中成功获取到用户信息后传回userInfo
      // 为app对象添加一个回调函数,将userInfo传回
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          collectNums: collect.length,
          commentNums: comments.length,
          sellListNums: sellList.length,
          historyNums: history.length,
          userName:app.globalData.userName,
        })
      }
    }

    /* this.setData({collectNums:collect.length}); */

  },

  handleUserInfo() {
    wx.navigateTo({
      url: '/pages/user_info/index?user_id=' + app.globalData.user_id,

    });
  }


})