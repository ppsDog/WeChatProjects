// pages/address/index.js
const app = getApp()
Page({
  data: {
    tabs: [{
        id: 0,
        value: "我的收货地址",
        isActive: true
      },
      {
        id: 1,
        value: "添加收货地址",
        isActive: false
      }
    ],
    index: 0,
    /* 第一列的所有选项 */
    multiArray: [
      ['E区', 'D区', 'A区', '其他'],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13']
    ],
    multiIndex: [0, 0],

    // 获取地址
    address: [],
    tabsId: 0,
    edit: false,
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

    /* console.log(app.globalData.userInfo.user_id); */
    const addressList = wx.getStorageSync("address") || [];
    const token = wx.getStorageSync("token");
    /* 检测是否登录 */
     if (!token) {
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
     }

    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的参数

    const index = currentPage.options.index;
    var add_id = currentPage.options.addid;
    // 4 激活选中页面标题  因为获取到的com_status为字符串类型
    console.log(index);

    if (index == "1") {
      this.changeTitleByIndex(index);
      var address = '';
      addressList.forEach(v => {
        if (v.add_id == add_id) {
          address = v;
          this.setData({
            address,
            edit: true
          })
          console.log(this.data.address);
        }

      });

    } else {
      /*  console.log(addressList); */
      this.setData({
        address: addressList,
        edit: false,
      })
      /*  console.log(this.data.address); */

    }



    /*  this.changeTitleByIndex(0); */

  },



  /* 表单提交数据 */
  formSubmit(e) {
    const address = wx.getStorageSync("address") || [];
    console.log(app.globalData.userInfo);
    if (!this.data.edit) {

      wx.request({
        url: 'http://localhost/addressServlet',
        data: {
          user_id: app.globalData.user_id,
          consignee: e.detail.value.consignee,
          tel: e.detail.value.tel,
          floor: e.detail.value.floor,
          floornum: e.detail.value.floornum,
          dormnum: e.detail.value.dormnum
        },

        success: (result) => {
          wx.setStorageSync("address", result.data);
          wx.showLoading({
            title: '加载中',
          });

          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
          const address = wx.getStorageSync("address") || [];
          this.setData({
            address
          })
          this.changeTitleByIndex(0);
        },

      });
    } else {
      wx.request({
        url: 'http://localhost/updateAddServlet',
        data: {
          add_id: this.data.address.add_id,
          user_id: this.data.address.user_id,
          consignee: e.detail.value.consignee,
          tel: e.detail.value.tel,
          floor: e.detail.value.floor,
          floornum: e.detail.value.floornum,
          dormnum: e.detail.value.dormnum
        },

        success: (result) => {
          wx.setStorageSync("address", result.data);
          wx.showLoading({
            title: '加载中',
          });

          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
          const address = wx.getStorageSync("address") || [];
          this.setData({
            address
          })
          this.changeTitleByIndex(0);
        },

      });
    }


  },

  /* 编辑按钮 */
  handleEdit(e) {
    /*   console.log(e.currentTarget.dataset.addid); */
    var add_id = e.currentTarget.dataset.addid;

    var addressList = wx.getStorageSync("address") || [];

    console.log(this.data.address);
    wx.redirectTo({
      url: '/pages/address/index?index=1&addid=' + add_id,
    
    });


  },

  /* 删除收货地址 */
  delAdd(e) {
    var add_id = e.currentTarget.dataset.addid;

    wx.request({
      url: 'http://localhost/delAddServlet',
      data: {
        add_id: add_id,
      },

      success: (result) => {
        
        wx.setStorageSync("address", result.data);
        wx.showLoading({
          title: '加载中',
        });

        setTimeout(function () {
          wx.hideLoading();
        }, 2000)

        const address = wx.getStorageSync("address") || [];
          this.setData({
            address,
            edit: false,
          })
          this.changeTitleByIndex(0);
      },

    });
  },




  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            /* 第一列第一行的第二列所有选项 */
            data.multiArray[1] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'];
            break;
          case 1:
            /* 第一列第二行的第二列所有选项 */
            data.multiArray[1] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
            break;
          case 2:
            /* 第一列第三行的第二列所有选项 */
            data.multiArray[1] = ['02'];
            break;
          case 3:
            /* 第一列第四行的第二列所有选项 */
            data.multiArray[1] = ['注:请来校园和卖主联系'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  // 点击确定时触发
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
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
    /* if (index == 1) {
      this.getComOrders();

    }  */
  },
})