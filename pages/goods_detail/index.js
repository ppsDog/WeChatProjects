// pages/goods_detail/index.js
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

//Page Object
Page({
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false,

    history: [],
  },

  // 商品对象
  GoodsInfo: {},


  //options(Object)
  /*   onLoad: function (options) {
      const goods_id = options;
      console.log("onload");
      this.getGoodsDetail(goods_id)
    }, */

  // 生命周期函数--监听页面加载
  onShow: function () {
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的goods_id参数
    let options = currentPage.options;
    const goods_id = options.goods_id;
    /*    console.log(goods_id);
       console.log("onShow"); */
    this.getGoodsDetail(goods_id);

  },
  /**
   获取商品详情数据
      1.先获取参数商品id  goods_id
      2.访问后台,获取数据
      3.获取有用值

   */
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    /*  console.log(goods_id); */
    let history = wx.getStorageSync("history") || [];
    const res = await request({
      url: "http://localhost/goodsServlet",
      data: {
        goods_id
      }
    });
    console.log(res.data);

    /*  console.log(res); */
    const goodsObj = res.data;
    this.GoodsInfo = goodsObj;

 /*    history.forEach(v => {
      console.log(v);
      if (goodsObj.goods_id != v.goods_id) {
        history.push(goodsObj);
        wx.setStorageSync("history", history);
      }
    }); */
    var isHistory = true;
    for (var i in history) {
      // console.log(cartList);
      if (goodsObj.goods_id == history[i].goods_id) {
        isHistory = false;
        break;
      }
     
    }
    if(isHistory){
      history.push(goodsObj);
      wx.setStorageSync("history", history);
    }

    // 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否被收藏,检索collect数组是否有该商品
    // some 方法用于检测数组中的元素是否满足指定条件（函数提供）。
    // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce,
        pics: goodsObj.pics,
        picss: goodsObj.picss,
      },
      isCollect
    })
    /* console.log(this.data.goodsObj); */
  },

  /**
   
   点击轮播图 预览大图
    1.给轮播图绑定点击事件
    2.调用小程序的api  previewImage 

   */
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    console.log(this.GoodsInfo);
    // 1 先构造要预览的图片数组 
    const urls=[];
    urls.push(this.GoodsInfo.pics);
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls
    });

  },

  /**
   点击 加入购物车
      1.先绑定点击事件
      2.获取缓存中的购物车数据 数组格式 
      3.先判断,当前的商品是否已经存在于 购物车
      4.已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
      5.不存在于购物车的数组中,直接给购物车数组添加一个新元素,新元素带 购买数量属性"num",重新把购物车数组 填充回缓存中
      6.弹出提示 
   */

  // 点击 加入购物车
  handleCartAdd() {
    const token = wx.getStorageSync("token");
      /* 检测是否登录 */
      if (!token) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          image: '../../style/err.png',
          duration: 1000,
        /*   success: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/user/index'
              });
            }, 1000);
          } */
        });
        return;
      }
    // 1.获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      //3.不存在,第一次添加
      // 该商品当前数量为1

     /*  this.GoodsInfo.goods_number = 1; */

      this.GoodsInfo.checked = true;
      // 把当前数据添加到cart数组中
      cart.push(this.GoodsInfo);
    } 
    
    /* else {
      // 4.已经存在购物车数据 执行 num++,该商品数量++
      cart[index].goods_number++;
    } */

    
    // 5.把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 是否显示透明蒙层，防止触摸穿透	
      // true 防止用户 手抖 疯狂点击按钮 
      mask: true
    });
  },

  /**
   商品收藏
      1.页面onShow的时候  加载缓存中的商品收藏的数据
      2.判断当前商品是不是被收藏 
        1.是 改变页面的图标
        2.不是 没变化
      3.点击商品收藏按钮 
        1.判断该商品是否存在于缓存数组中
        2.已经存在 把该商品删除
        3.没有存在 把商品添加到收藏数组中 存入到缓存中即可 
   */

  // 点击 商品收藏图标
  handleCollect() {
    const token = wx.getStorageSync("token");
      /* 检测是否登录 */
      if (!token) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          image: '../../style/err.png',
          duration: 1000,
        /*   success: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/user/index'
              });
            }, 1000);
          } */
        });
        return;
      }
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3.当index！=-1表示 已经收藏过 
    if (index !== -1) {
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });

    } else {
      // 没有收藏过,把该商品信息添加到收藏数组中
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4.把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5.修改data中的属性  isCollect
    this.setData({
      isCollect
    })

  }

});