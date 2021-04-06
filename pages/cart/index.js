// pages/cart/index.js
import {
  showModal,
  showToast
} from "../../utils/asyncWx.js";
/* 小程序使用es7的async */
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    car_address: [], // 收货地址
    cart: [], //购物车
    allChecked: false, //全选
    totalPrice: 0, //总价格
    totalNum: 0 //总数量
  },

  /**
  onShow 
    1.回到了商品详情页面 第一次添加商品的时候 手动添加了属性
      1.num=1;
      2.checked=true;
    2.获取缓存中的购物车数组
    3.把购物车数据 填充到data中
   */

  onShow() {
    // 获取缓存中的收货地址信息
    /*  const address = wx.getStorageSync("address"); */
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的goods_id参数
    let options = currentPage.options;
    /* console.log(options); */
    const consignee = options.consignee;
    
    this.setCart(cart);

  },

  onLoad: function(options){
    console.log("111");
    /* console.log(options); */
    const consignee = options.consignee;
    this.getAddress(consignee);
  },

  /**
  获取用户的收货地址
    1.绑定点击事件
    2.获取用户对小程序所授予获取地址的 的api wx.chooseAddress
       获取收货地址
    3.把获取到的收货地址 存入到 本地存储中 
   */
  // 点击 收货地址
  handleChooseAddress() {
    // 调用获取收货地址的 api
    wx.navigateTo({
      url: '/pages/cart_address/index'
    });

  },
  
  getAddress(consignee) {
    const address = wx.getStorageSync("address") || [];
    var add = [];
    console.log(consignee);
    address.forEach(v => {
      if (v.consignee == consignee) {
        add = v
        this.setData({
          car_address: add
        })
      } else{
        add = ""
      }
    })
    console.log(this.data.car_address);
     wx.setStorageSync("carAddress", this.data.car_address);
  },

  /**
  商品的选中
    1.绑定change事件
    2.获取到被修改的商品对象
    3.商品对象的选中状态 取反
    4.重新填充回data中和缓存中
    5.重新计算全选。总价格 总数量。。。
   */

  // 商品的选中
  handeItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组 
    let {
      cart
    } = this.data;
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  /**
  全选和反选
    1.全选复选框绑定事件 change
    2.获取 data中的全选变量 allChecked
    3.直接取反 allChecked=!allChecked
    4.遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
    5.把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
   */
  // 商品全选功能
  handleItemAllCheck() {
    // 1 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  /**
    总价格和总数量
      1.都需要商品被选中 我们才拿它来计算
      2.获取购物车数组
      3.遍历
      4.判断商品是否被选中
      5.总价格 += 商品的单价 * 商品的数量
      5.总数量 +=商品的数量
      6.把计算后的价格和数量 设置回data中即可 
   */
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    // 默认全选
    let allChecked = true;
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    // 对购物车进行遍历
    cart.forEach(v => {
      // 获取每个选中的商品
      if (v.checked) {
        totalPrice = totalPrice + v.goods_price * 1;
        totalNum += 1;
      } else {
        // 存在没被选中的商品,全选设为false
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },


  /**
  商品数量的编辑
    1."+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
      1.“+” "+1"
      2."-" "-1"
    2.传递被点击的商品id goods_id
    3.获取data中的购物车数组 来获取需要被修改的商品对象
    4.当 购物车的数量 =1 同时 用户 点击 "-"
      弹窗提示(showModal) 询问用户 是否要删除
      1.确定 直接执行删除
      2.取消  什么都不做 
    4.直接修改商品对象的数量 num
    5.把cart数组 重新设置回 缓存中 和data中 this.setCart
   */


  // 商品数量的编辑功能
 /*  async handleItemNumEdit(e) {

    // 1 获取传递过来的参数 
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let {
      cart
    } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].goods_number === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({
        content: "您是否要删除？"
      });
      if (res.confirm) {
        // 数组删除元素
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4  进行修改数量
      cart[index].goods_number += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
  }, */


  /** 
    点击结算
      1.判断有没有收货地址信息
      2.判断用户有没有选购商品
      3.经过以上的验证 跳转到 支付页面！ 
  */
  // 点击 结算 
  async handlePay() {
    // 1.判断收货地址
    const {
      car_address,
      totalNum
    } = this.data;
    if (!car_address.consignee) {
      await showToast({
        title: "您还没有选择收货地址"
      });
      return;
    }
    // 2.判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品"
      });
      return;
    }
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }


})