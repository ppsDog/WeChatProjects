// pages/cart_address/index.js
const app = getApp()
Page({
  data: {
    // 获取地址
    address: [],
  },


  onLoad() {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading();
    }, 2000)
   /*  wx.setStorageSync("address", ""); */
  },

  onShow() {
    const address = wx.getStorageSync("address") || [];
    const token = wx.getStorageSync("token");
     console.log(address);
    this.setData({
      address
    })

  },

  // 带参跳转tabBar页面
  handleCart(e){
    wx.reLaunch({

      url: '/pages/cart/index?consignee='+e.currentTarget.dataset.address_id,
      success: (result)=>{
        
      },
    });
  }


})