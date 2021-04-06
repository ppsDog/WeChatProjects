// pages/sell/index.js
const app = getApp()

Page({
  data: {
    tabs: [{
        id: 0,
        value: "我的商品",
        isActive: true
      },
      {
        id: 1,
        value: "待上架",
        isActive: true
      },
      {
        id: 2,
        value: "未出售",
        isActive: true
      },
      {
        id: 3,
        value: "已出售",
        isActive: true
      },
      {
        id: 4,
        value: "上架商品",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    index: 0,

    resImgs: [],
    // 
    sellList: [],
    tabsId: 0,
    edit: false,

    multiIndex: [0, 0, 0],

    multiArray: [],
    cat_id: '3',

    multiIndex: [0, 0, 0],

    catesNameList: [],


  },
  // 接口要的参数
  QueryParams: {
    /* query: "", */
    /*  cat_id: "", */ // 
    cid: "",
    pageNum: 1, // 当前页码
    pageSize: 10 // 一页显示数
  },

  // 总页数
 // totalPages: 1,

  onLoad() {

    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading();
    }, 2000)
    /*  wx.setStorageSync("address", ""); */
  },

  onLoad: function(options){
    const tabsId = options.tabsId;
    this.changeTitleByIndex(tabsId - 0);
  },

  onShow() {

    wx.setStorageSync("resImgs", []);
    /* console.log(app.globalData.userInfo.user_id); */
    const sellList = wx.getStorageSync("sellList") || [];
    const token = wx.getStorageSync("token");


    var catesNameList = wx.getStorageSync("catesNameList");


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

  /*   // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的参数

    const tabsId = currentPage.options.tabsId; */
   


    /* if (index == "1") {
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
        this.setData({
          address: addressList,
          edit: false,
        })

      } */

    this.getCates()

    this.setData({
      catesNameList,
      
    })

    console.log(catesNameList);


    let oneNameList = catesNameList.map(v => v.cat_name);
    console.log(oneNameList);

    /* let two = catesNameList.map(v => v.children);
      let twoNameList = two[0].map(v => v.cat_name);
  
      console.log(twoNameList); */

    let twoNameList = catesNameList.map(v => v.children)[0].map(v => v.cat_name);

    console.log(twoNameList);


    /*  let three = two[0].map(v => v.children);
     let threeNameList = three[0].map(v => v.cat_name);
     console.log(threeNameList); */

    // 第一个"0",修改第二列,第二个"0",修改第三列
    let threeNameList = catesNameList.map(v => v.children)[0].map(v => v.children)[0].map(v => v.cat_name);
    console.log(threeNameList);


    let list = [];

    list.push(oneNameList);
    list.push(twoNameList);
    list.push(threeNameList);


    this.setData({
      sellList,
      edit: false,
      multiArray: list
    })

    this.getSellList()
    /*  this.changeTitleByIndex(0); */
    this.getCates()
  },


  /* 获取我的商品 */
  getSellList() {
    wx.request({
      url: 'http://localhost/findSellServlet',
      data: {
        user_id: app.globalData.user_id,
      },

      success: (res) => {
        wx.setStorageSync("sellList", res.data);
        console.log(res.data);
        // 获取 总条数
        //const total = res.data.total;
        // 计算总页数
       // this.totalPages = Math.ceil(total / this.QueryParams.pageSize);

        console.log(this.totalPages);
        this.setData({
          // 拼接了数组
          sellList: res.data
        })

        // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
        wx.stopPullDownRefresh();

      },

    });

  },




  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },

  bindMultiPickerColumnChange: function (e) {

    var catesNameList = this.data.catesNameList;


    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      cat_id: this.data.cat_id
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          // 第一列第一行的所有data.multiArray[1]:第二列的名称, data.multiArray[2]:第二列的第一行的第三列
          case 0:
            data.multiArray[1] = catesNameList.map(v => v.children)[0].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[0].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 1:
            data.multiArray[1] = catesNameList.map(v => v.children)[1].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[1].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 2:
            data.multiArray[1] = catesNameList.map(v => v.children)[2].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[2].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 3:
            data.multiArray[1] = catesNameList.map(v => v.children)[3].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[3].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 4:
            data.multiArray[1] = catesNameList.map(v => v.children)[4].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[4].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 5:
            data.multiArray[1] = catesNameList.map(v => v.children)[5].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[5].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 6:
            data.multiArray[1] = catesNameList.map(v => v.children)[6].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[6].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 7:
            data.multiArray[1] = catesNameList.map(v => v.children)[7].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[7].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 8:
            data.multiArray[1] = catesNameList.map(v => v.children)[8].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 9:
            data.multiArray[1] = catesNameList.map(v => v.children)[9].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[9].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 10:
            data.multiArray[1] = catesNameList.map(v => v.children)[10].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[10].map(v => v.children)[0].map(v => v.cat_name);
            break;
          case 11:
            data.multiArray[1] = catesNameList.map(v => v.children)[11].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[11].map(v => v.children)[0].map(v => v.cat_name);
            break;

          case 12:
            data.multiArray[1] = catesNameList.map(v => v.children)[12].map(v => v.cat_name);
            data.multiArray[2] = catesNameList.map(v => v.children)[12].map(v => v.children)[0].map(v => v.cat_name);
            break;

        }

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;


      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[0].map(v => v.children)[0].map(v => v.cat_name);
                break;
            }
            break;

          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[1].map(v => v.children)[0].map(v => v.cat_name);
                break;
              case 1:
                data.multiArray[2] = catesNameList.map(v => v.children)[1].map(v => v.children)[1].map(v => v.cat_name);
                break;
              case 2:
                data.multiArray[2] = catesNameList.map(v => v.children)[1].map(v => v.children)[2].map(v => v.cat_name);
                break;
            }
            break;

          case 2:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[2].map(v => v.children)[0].map(v => v.cat_name);
                break;
              case 1:
                data.multiArray[2] = catesNameList.map(v => v.children)[2].map(v => v.children)[1].map(v => v.cat_name);
                break;
              case 2:
                data.multiArray[2] = catesNameList.map(v => v.children)[2].map(v => v.children)[2].map(v => v.cat_name);
                break;
            }
            break;

          case 3:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[3].map(v => v.children)[0].map(v => v.cat_name);
                break;
              case 1:
                data.multiArray[2] = catesNameList.map(v => v.children)[3].map(v => v.children)[1].map(v => v.cat_name);
                break;
              case 2:
                data.multiArray[2] = catesNameList.map(v => v.children)[3].map(v => v.children)[2].map(v => v.cat_name);
                break;
            }
            break;

          case 4:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[4].map(v => v.children)[0].map(v => v.cat_name);
                break;

            }
            break;

          case 5:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[5].map(v => v.children)[0].map(v => v.cat_name);
                break;

            }
            break;


          case 6:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[6].map(v => v.children)[0].map(v => v.cat_name);
                break;

            }
            break;


          case 7:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[7].map(v => v.children)[0].map(v => v.cat_name);
                break;
              case 1:
                data.multiArray[2] = catesNameList.map(v => v.children)[7].map(v => v.children)[1].map(v => v.cat_name);
                break;

            }
            break;


          case 8:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[0].map(v => v.cat_name);
                break;
              case 1:
                data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[1].map(v => v.cat_name);
                break;
              case 2:
                data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[2].map(v => v.cat_name);
                break;
              case 2:
                data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[3].map(v => v.cat_name);
                break;
            }
            break;


          case 9:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[9].map(v => v.children)[0].map(v => v.cat_name);
                break;

            }
            break;


          case 10:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[10].map(v => v.children)[0].map(v => v.cat_name);
                break;
              case 1:
                data.multiArray[2] = catesNameList.map(v => v.children)[10].map(v => v.children)[1].map(v => v.cat_name);
                break;

            }
            break;


          case 11:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[11].map(v => v.children)[0].map(v => v.cat_name);
                break;

            }
            break;


          case 12:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = catesNameList.map(v => v.children)[12].map(v => v.children)[0].map(v => v.cat_name);

                break;
            }
            break;

        }
        data.multiIndex[2] = 0;
        break;
    }
    data.cat_id = catesNameList.map(v => v.children)[data.multiIndex[0]].map(v => v.children)[data.multiIndex[1]].map(v => v.cat_id)[data.multiIndex[2]];
    console.log(data.multiIndex);
    console.log(data.cat_id);
    this.setData(data);
  },

  util: require('../../utils/util.js'), // 引入js文件,使用util.js中的函数

  /* 表单提交数据 */
  formSubmit(e) {
    console.log(e);
    var date = Date.parse(new Date());
    var d = this.util.formatData(date)

    let comments = wx.getStorageSync("comments") || [];
    const comment = [];
    // 1 获取文本域的内容 图片数组
    var {
      chooseImgs
    } = this.data;

    console.log(chooseImgs);

    let resImgs = wx.getStorageSync("resImgs");
    console.log(resImgs);


    wx.showLoading({
      title: "正在上传中",
      /* mask: true */
    });


      wx.request({
        url: 'http://localhost/addGoodsServlet',

        data: {
          cat_id: e.detail.value.cat_id,
          user_id: app.globalData.user_id,
          goods_name: e.detail.value.goods_name,
          goods_price: e.detail.value.goods_price,
          /*  goods_number: e.detail.value.goods_number, */
          goods_introduce: e.detail.value.goods_introduce,
          pics: resImgs[0]
        },

        success: (res) => {
          wx.setStorageSync("sellList", res.data);
          wx.setStorageSync("resImgs", []);

          console.log(res.data);
          // 获取 总条数
         // const total = res.data.total;
          // 计算总页数
          //this.totalPages = Math.ceil(total / this.QueryParams.pageSize);

         // console.log(this.totalPages);
          this.setData({
            // 拼接了数组
            sellList: res.data,
            resImgs:[]
          })


          wx.hideLoading();
          this.getSellList()

          this.changeTitleByIndex(0);
        },

      });

  },

  // 上传图片
  imgUpload(e) {
    const {
      chooseImgs
    } = this.data;
    var date = Date.parse(new Date());
    var d = this.util.formatData1(date)


    const resImgs = [];

    chooseImgs.forEach((v, i) => {

      console.log(v);
      var type = v.substring(v.lastIndexOf("\."));
      // 上传到本地服务器
      wx.uploadFile({
        url: 'http://127.0.0.1/uploadImlServlet', // 开发者服务器地址
        filePath: v,
        name: 'name', // 文件对应的key
        formData: {
          'fileName': d + type
        }, // https请求中其他额外的form data
        success(res) {
          console.log(res.data);
          // 去掉两头双引号
          resImgs.push(res.data.substring(1).substring(0, res.data.length - 2))
          console.log(resImgs);
          wx.setStorageSync("resImgs", resImgs);
        }
      })
    })

  },


  // 点击 “+” 选择图片
  handleChooseImg() {
    // 2 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式  原图  压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源  相册  照相机
      sourceType: ['album', 'camera'],
      success: (result) => {

        this.setData({
          // 图片数组 进行拼接 
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })

        wx.showLoading({
          title: '加载中',
        });

        setTimeout(function () {
          wx.hideLoading();
        }, 3000)
        this.imgUpload();

      }
    });


  },



  getCates() {
    var catesNameList = [];
    wx.request({
      url: 'http://localhost/categoryServlet',

      success: (result) => {
        console.log(result);
        catesNameList = result.data;

        this.setData({
          catesNameList
        })
        wx.setStorageSync("catesNameList", catesNameList);
      },


    });

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
    //console.log(index);

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
   // console.log(index);
    /* if (index == 1) {
      this.getComOrders();

    }  */
  },
})
