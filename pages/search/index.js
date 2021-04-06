// pages/search/index.js
/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  防止每输入一个字符就会发送请求
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goods: [],
    // 取消按钮是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId: -1,


  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    // 1 获取输入框的值
    const value = e.detail.value;
    // 2 检测合法性
    // trim() 方法用于删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。
    // value没有字符时,取反为true,value有字符时,取反为false
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      // 值不合法
      return;
    }
    // 3 准备发送请求获取数据
    this.setData({
      isFocus: true
    })

    //clearTimeout() 方法可取消由 setTimeout() 方法设置的定时操作。
    //clearTimeout() 方法的参数必须是由 setTimeout() 返回的 ID 值。
    clearTimeout(this.TimeId);
    // 稳定之后一秒后在发送
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },


  // 发送请求获取搜索建议 数据
  async qsearch(query) {
    const res = await request({
      url: "http://localhost/searchGoodsServlet",
      data: {
        goodsName:query
      }
    });
    console.log(res.data);
    this.setData({
      goods: res.data
    })
  },


  // 点击 取消按钮
  handleCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  }
})