// pages/history/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList:[]
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

/**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const historyList = wx.getStorageSync("history") || [];
    this.setData({
      historyList
    })
    console.log(historyList);
  },

  handleGoodsDetail(e){
    //console.log(e.currentTarget.dataset.goodsid);
    wx.navigateTo({
      url: '/pages/goods_detail/index?goods_id='+e.currentTarget.dataset.goodsid,
    });
    //
  },

  // 清空足迹
  clearHis(e){
    wx.setStorageSync("history", []);
    this.onShow();
  }


  

})