// pages/feedback/index.js
/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
 */

const app = getApp()
Page({
  data: {
    tabs: [{
        id: 0,
        value: "我的反馈",
        isActive: true
      },
      {
        id: 1,
        value: "给我的反馈",
        isActive: false
      },
      {
        id: 2,
        value: "意见反馈",
        isActive: false
      }
    ],
    // 文本域的内容
    feedback_text: "",
    //我的反馈
    feedback: [],
    //给我的反馈
    tomeFeedback: []

  },
  onLoad: function (options) {
    const tabsId = options.tabsId;
    this.changeTitleByIndex(tabsId - 0);
  },


  onShow: function () {
   
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

     
    this.getFeedback()
    this.getTomeFeedback()
    const feedback = wx.getStorageSync("feedback") || [];
    const tomeFeedback = wx.getStorageSync("tomeFeedback")|| [];
    this.setData({
      feedback,
      tomeFeedback,
      
    })
  },

  
  /* 获取我的留言 */
  getFeedback() {
    wx.request({
      url: 'http://localhost/feedbackFindServlet',
      data: {
        user_id: app.globalData.user_id,
      },

      success: (res) => {
        // wx.setStorageSync("feedback", res.data);
        console.log(res.data);
        // 获取 总条数

      //  console.log(this.totalPages);
        this.setData({
          // 拼接了数组
          feedback: res.data
        })

        // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
        wx.stopPullDownRefresh();

      },

    });

  },

  /* 获取给我的留言 */
  getTomeFeedback() {
    wx.request({
      url: 'http://localhost/feedbackTomeServlet',
      data: {
        user_id: app.globalData.user_id,
      },

      success: (res) => {
        // wx.setStorageSync("tomeFeedback", res.data);
        console.log(res.data);
        // 获取 总条数

       // console.log(this.totalPages);
        this.setData({
          // 拼接了数组
          tomeFeedback: res.data
        })

        // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
        wx.stopPullDownRefresh();

      },

    });

  },

  // 删除
  handleDelect(e) {
    var feedback_id = e.currentTarget.dataset.feedback_id;

    console.log(feedback_id);
    wx.request({
      url: 'http://localhost/delFeedbackServlet',
      data: {
        feedback_id: feedback_id,
        user_id: app.globalData.user_id,
      },

      success: (result) => {
        console.log(result.data);
        // wx.setStorageSync("address", result.data);

        this.setData({
          // 拼接了数组
          tomeFeedback: result.data
        })
        wx.showLoading({
          title: '加载中',
        });

        setTimeout(function () {
          wx.hideLoading();
        }, 2000)

        /* const address = wx.getStorageSync("address") || [];
          this.setData({
            address,
            edit: false,
          })
          this.changeTitleByIndex(0); */
      },

    });
  },


  // 文本域的输入的事件
  handleTextInput(e) {
    this.setData({
      feedback_text: e.detail.value
    })
  },

  util: require('../../utils/util.js'), // 引入js文件,使用util.js中的函数


  // 提交按钮的点击
  handleFormSubmit(e) {

    let feedback = wx.getStorageSync("feedback") || [];

    var date = Date.parse(new Date());
    var d = this.util.formatData2(date)
    console.log(d);

    // 1 获取文本域的内容 图片数组
    const {
      feedback_text,
    } = this.data;
    console.log(feedback_text);
    // 2 合法性的验证
    if (!feedback_text.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }

    wx.showLoading({
      title: "正在上传中",
      /* mask: true */
    });

    wx.hideLoading();

    //console.log("只是提交了文本");
   /*  wx.navigateBack({
      delta: 1
    });
 */
   // let orders = wx.getStorageSync("orders") || [];
   /*  comments.push({
      order_id: this.data.order_id,
      comment_text: comment_text,
      order_number: this.data.order_number
    }); */

    wx.request({
      url: 'http://localhost/feedbackAddServlet',
      data: {
        user_id: app.globalData.user_id,
        feedback_text: feedback_text,
        feedback_time: d
      },
      success: (result) => {
        console.log(result.data);
        //wx.setStorageSync("comments", result.data);
        wx.showLoading({
          title: '加载中',
        });

        setTimeout(function () {
          wx.hideLoading();
        }, 2000)

        this.getFeedback();
        this.changeTitleByIndex(0);
      },
      
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
   
  },

})