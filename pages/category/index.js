// pages/category/index.js
import {
  request
} from "../../request/index.js";
/* 小程序使用es7的async */
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的菜单数据
    rightMenuList: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
      0. web中的本地存储 和 小程序中的本地存储的区别
        1.写代码的方式不一样
          web:      localStorage.setItem("key","value") 
                    localStorage.getItem("key") 
          小程序中:  wx.setStorageSync("key", "value");
                    wx.wx.getStorageSync("key");
        2.存的时候  有没有做类型转换
          web:不管存入的是什么类型的数据,最终都会先调用一下 toString(),把数据变成字符串,再存入
        小程序:不存在 类型转换的这个操作,存什么类型的数据,获取就是什么类型
      1.先判断一下本地存储中有没有旧的数据
        {time:Data.now(),data:[...]}
      2.没有旧数据 直接发送新请求
      3.有旧的数据,同时旧的数据也没有过期,就使用本地存储的旧数据即可
    */

    // 1.获取本地存储中的数据  (小程序也是存在本地存储技术的)

    this.getCates();
    // 2.判断
   // const Cates = wx.getStorageSync("cates");

   /*  
    // 有旧数据 暂时定义过期时间  1小时
    if (Date.now() - Cates.time > 1000 * 60 * 60) {
      // 重新发送请求
      this.getCates();
    } else {
      // 可以使用旧的数据
      // console.log(Cates);
       //console.log("旧数据") 
      this.Cates = Cates.data;
      let leftMenuList = this.Cates.map(v => v.cat_name);
      let rightMenuList = this.Cates[0].children;
      this.setData({
        leftMenuList: leftMenuList,
        rightMenuList: rightMenuList
      })
    } */

  },

  // 获取分类数据

  /* getCates() {
    // 最终放到...params中
    request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/categories" })  
      .then(result => {
        console.log(result)
        this.Cates = result.data.message;

        // 把接口的数据存入到本地存储中
        wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

        // 构造左侧的大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        
        // 构造右侧的商品数据
        let rightMenuList=this.Cates[0].children;
        this.setData({
          leftMenuList : leftMenuList,
          rightMenuList : rightMenuList
        })
      })
  }, */


  async getCates() {
    // 1.使用es7的async await 发送请求
    const result = await request({
      url: "http://localhost/categoryServlet"
    })
    console.log(result);
    this.Cates = result.data;

    // 把接口的数据存入到本地存储中
   /*  wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    }); */

    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);

    // 构造右侧的商品数据
    let rightMenuList = this.Cates[0].children;
    this.setData({
      leftMenuList: leftMenuList,
      rightMenuList: rightMenuList
    })
  },

  /* async getCates() {
    // 1.使用es7的async await 发送请求
    const result = await request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
    })
    this.Cates = result.data.message;

    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });

    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);

    // 构造右侧的商品数据
    let rightMenuList = this.Cates[0].children;
    this.setData({
      leftMenuList: leftMenuList,
      rightMenuList: rightMenuList
    })
  }, */

  // 左侧菜单的点击事件
  handleItemTap(e) {
    /* 
      1.获取被点击的标题身上的索引
      2.给data中currentIndex赋值就可以了
      3.根据不同的索引来渲染右侧的商品内容
    */
    /* console.log(e.currentTarget.dataset.index) */
    const index = e.currentTarget.dataset.index;
    let rightMenuList = this.Cates[index].children;


    this.setData({
      currentIndex: index,
      rightMenuList: rightMenuList,
      // 重新设置右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })

  },

})