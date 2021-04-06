//app.js

App({
  /**
   * 实现小程序登录的流程如下
   *  1.先判断用户是否已经登录,即缓存中是否已经有token
   *  2.如果缓存中有token则无需在登陆,用户的操作都需要发送token验证身份,但是token可能会因为多终端登录等原因过期,如果token过期则需要用户重新登录
   *  3.如果缓存中没有token,则让用户登录,登录时分为两种情况 
   */

  // 打开小程序最先执行的是onLaunch函数,实际开发中常用来做登录判断,存储/更新缓存等操作

  onLaunch: function () {

    var token = wx.getStorageSync('token');
    if (token) { //  有token
      // this.globalData.token = token;
      
     /*  console.log(this.globalData.userInfo) */
      this.checkLogin(token)
    } else { // token为空
      if (this.globalData.userInfo != '') {
        
        setTimeout(() => {
          this.login();
        }, 0)

      }
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 
              this.login();

              // 由于 getUserInfo 是异步网络请求，可能app中用户信息还没有获取成功,但index页面已经获取了全局变量,这时全局变量userInfo为空.可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },


  checkLogin: function (token) {
    var _this = this;
    wx.request({
      url: 'http://127.0.0.1/checkLogin',
      method: 'POST',
      header: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: token
      },
      success: function (res) {
        console.log(res.data.success)

        if (res.data.success) { // token有效
          _this.globalData.token = token;
        } else {
          _this.login();
        }
      }
    })
  },

  login: function (callback) {

    var _this = this;
    wx.login({
      success: (res) => {
        console.log(res.code);
        wx.request({
          url: 'http://127.0.0.1/loginServlet',
          method: 'POST',
          header: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: {
            code: res.code,
            nickName: this.globalData.userInfo.nickName
            // gender : this.globalData.userInfo.nickName,
          },
          success: (res) => {
            console.log(res.data.data)
            if (res.data.success) {
              // 将token和user_id保存为全局变量,供各个页面中使用
              _this.globalData.token = res.data.data.token,
              _this.globalData.user_id = res.data.data.user_id,
              _this.globalData.userName = res.data.data.user.userName,
          
                wx.setStorage({
                  data: res.data.data.token,
                  key: 'token',

                })

              // 执行回调函数 "typeof callback == 'function'"是判断callback是否为函数,如果是函数则执行回调
              typeof callback == 'function' && callback();
              this.findAdd();
              this.getCates();
              this.getSellList();
              this.getOrder();
              this.getComment()

              wx.switchTab({
                url: '/pages/index/index',
                success: (result)=>{
                  
                },
                fail: ()=>{},
                complete: ()=>{}
              });
            }
          }
        })
      }
    })
  },

  // 查询收货地址
  findAdd(){
    wx.request({
      url: 'http://localhost/findAddServlet',
      data: {
        user_id: this.globalData.user_id,
      },

      success: (result) => {
        wx.setStorageSync("address", result.data);
        wx.showLoading({
          title: '加载中',
        });

        setTimeout(function () {
          wx.hideLoading();
        }, 2000)
      },
    });
  },

  // 获取分类
  getCates() {
    var catesNameList = [];
    wx.request({
      url: 'http://localhost/categoryServlet',

      success: (result) => {
        catesNameList = result.data;
        wx.setStorageSync("catesNameList", catesNameList);
      },

    });

  },

    /* 获取我的商品 */
    getSellList() {
     // console.log(this.globalData.user_id);
      wx.request({
        url: 'http://localhost/findSellServlet',
        data: {
          user_id: this.globalData.user_id,
        },
  
        success: (res) => {
        //  console.log(res.data);
          wx.setStorageSync("sellList", res.data);
  
        },
  
      });
  
    },
  
    /* 获取我的订单 */
  getOrder(){

    wx.request({
      url: 'http://localhost/orderFindServlet',
      data: {
        user_id: this.globalData.user_id,
      },

      success: (res) => {
      //  console.log(res.data);
        wx.setStorageSync("orders", res.data);

      },
    });
  },

      /* 获取我的评论 */
      getComment(){

        wx.request({
          url: 'http://localhost/commentFindServlet',
          data: {
            user_id: this.globalData.user_id,
          },
    
          success: (res) => {
          //  console.log(res.data);
            wx.setStorageSync("comments", res.data);
    
          },
        });
      },
    

 

  // 设置全局变量
  globalData: {
    token: '',
    userInfo: '',
    user_id:'',
    userName:'',
    orders: [],
   
  }
})