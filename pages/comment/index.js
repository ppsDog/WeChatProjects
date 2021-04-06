// pages/comment/index.js
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
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 文本域的内容
    comment_text: "",
    // 订单id
    order_id: '',
    // 评论
    comments: [],
    order_number: "",

  },


  onShow: function () {
    /* const comments = wx.getStorageSync("comments") || []; */

    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的order_id参数
    let options = currentPage.options;
    const order_id = options.order_id;
    const order_number = options.order_number;
    /* console.log(order_id); */

    this.setData({
      order_id,
      order_number,
      /*  comments */
    })
  },


  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },




  // 点击 自定义图片组件
  handleRemoveImg(e) {
    // 2 获取被点击的组件的索引
    const {
      index
    } = e.currentTarget.dataset;
    // 3 获取data中的图片数组
    let {
      chooseImgs
    } = this.data;
    // 4 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },


  // 文本域的输入的事件
  handleTextInput(e) {
    this.setData({
      comment_text: e.detail.value
    })
  },


  // 提交按钮的点击
  handleFormSubmit(e) {

    let comments = wx.getStorageSync("comments") || [];
    const comment = [];
    // 1 获取文本域的内容 图片数组
    const {
      comment_text,
      chooseImgs
    } = this.data;

    // 2 合法性的验证
    if (!comment_text.trim()) {
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

    console.log("只是提交了文本");
    wx.navigateBack({
      delta: 1
    });

    let orders = wx.getStorageSync("orders") || [];
    comments.push({
      order_id: this.data.order_id,
      comment_text: comment_text,
      order_number: this.data.order_number
    });

    wx.request({
      url: 'http://localhost/commentAddServlet',
      data: {
        user_id:app.globalData.user_id,
        order_id: this.data.order_id,
        comment_text: comment_text,
        order_number: this.data.order_number
      },
      success: (result) => {
        console.log(result.data);
        wx.setStorageSync("comments", result.data);
      },

    });

    orders.forEach((v) => {
      if (v.order_id == this.data.order_id) {
        v.com_status = "1";

        wx.request({
          url: 'http://localhost/orderCommentServlet',
          data: {
            com_status: "1",
            order_id: this.data.order_id,
            user_id: app.globalData.user_id,
          },
          success: (result) => {
            console.log(result.data);
            wx.showLoading({
              title: '加载中',
            });

            setTimeout(function () {
              wx.hideLoading();
            }, 2000)
          },

        });
      }
    });
    wx.setStorageSync("orders", orders);
  
  }
})