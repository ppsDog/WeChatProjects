// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   * 接收父元素数据
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击事件
    handleItemTap(e){
      // 1 获取点击的索引
      /* console.log(e.currentTarget.dataset.index); */
      const index=e.currentTarget.dataset;
      // 2 触发 父组件中的事件 自定义
      this.triggerEvent("tabsItemChange",index);
    }
  }
})
