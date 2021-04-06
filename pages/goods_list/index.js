// pages/goods_list/index.js
/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pageSize)
      总页数 = Math.ceil( 23   /  10  ) = 3
    2 获取到当前的页码  currentPage
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据,弹出一个提示
  4 假如还有下一页数据,来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },


  // 接口要的参数
  QueryParams: {
    /* query: "", */
     cat_id: "", // 
   /*  cid: "", */
    pageNum: 1, // 当前页码
    pageSize: 10 // 一页显示数
  },

  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */



  onLoad: function (options) {
    console.log(options);
    /* this.QueryParams.cid = options.cid || ""; */
     this.QueryParams.cat_id = options.cat_id || "";
    // this.QueryParams.query = options.query || "";
    this.getGoodsList();

    /* this.cat_id=options.cat_id; */

    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading();
    }, 2000)
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    /*  console.log(e.detail.index); */
    // 1 获取被点击的标题索引
    const index = e.detail.index;
    // 2 修改源数组
    let tabs = this.data.tabs;
    /* 类似java中增强for循环,v是每次循环项,i是索引 */
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs: tabs
    })
  },

 /*  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/search",
      data: this.QueryParams
    });
    // 获取 总条数
    const total = res.data.message.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接了数组
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();

  }, */



   // 获取商品列表数据
   async getGoodsList() {
     const res = await request({
       url: "http://localhost/goodsListServlet",
       data: this.QueryParams
     });
     console.log(res.data);

     //  this.setData({
     //  goodsList: res.data.goods
     //}) 

     // 获取 总条数
     const total = res.data.total;
     // 计算总页数
     this.totalPages = Math.ceil(total / this.QueryParams.pageSize);

     console.log(this.totalPages);
     this.setData({
       // 拼接了数组
       goodsList: [...this.data.goodsList, ...res.data.goods]
     })

     // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
     wx.stopPullDownRefresh();

   },




  // 页面上滑 滚动条触底事件
  onReachBottom() {
    //  1 判断还有没有下一页数据
    if (this.QueryParams.pageNum >= this.totalPages) {
      // 没有下一页数据
      //  console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据'
      });

    } else {
      // 还有下一页数据
      //  console.log("有下一页数据");
      this.QueryParams.pageNum++;
      this.getGoodsList();
    }
  },

  // 下拉刷新事件 
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pageNum = 1;
    // 3 发送请求
    this.getGoodsList();
  }
})