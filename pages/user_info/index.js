// pages/user_info/index.js
const app = getApp()
Page({
  data: {
    array: ['男', '女'],
    index: 0,
    userInfo:""
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onShow: function () {
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的goods_id参数
    let options = currentPage.options;
    const user_id = options.user_id;

    console.log(user_id);
    this.getUserInfo(user_id)
  },

  getUserInfo(user_id) {

    wx.request({
      url: 'http://localhost/findUserInfoServlet',
      data: {
        user_id: user_id,
      },

      success: (result) => {
        console.log(result);
        this.setData({
          userInfo:result.data
        })
        wx.showLoading({
          title: '加载中',
        });

        setTimeout(function () {
          wx.hideLoading();
        }, 2000)
      },
    });

  },

  
  updataUserInfo(e){

    //console.log(e.detail.value);
    wx.request({
      url: 'http://localhost/updateUserServlet',
      data: {
        nickName: e.detail.value.nickName,
        userName: e.detail.value.userName,
        sex: e.detail.value.sex,
        user_id: e.detail.value.user_id,
      },
  
      success: (result) => {
        wx.showLoading({
          title: '加载中',
        });
  
        setTimeout(function () {
          wx.hideLoading();
        }, 2000)
        app.globalData.userName = e.detail.value.userName,
        wx.switchTab({
          url: '/pages/user/index',
        });
      },
    });
  }
 
})