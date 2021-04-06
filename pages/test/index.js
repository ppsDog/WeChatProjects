Page({
  data: {
    multiArray: [
      ['无脊柱动物', '脊柱动物'],
      ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'],
      ['猪肉绦虫', '吸血虫']
    ],
    multiIndex: [0, 0, 0],

    multiArray: [],
    cat_id: '',

    multiIndex: [0, 0, 0],

    catesNameList: [],
    chooseImgs: []

  },

  util: require('../../utils/util.js'), // 引入js文件,使用util.js中的函数

  uploadImg: function () {
   /*  const {
      chooseImgs
    } = this.data;

    // console.log(this.util)
    var date = Date.parse(new Date());
    var d = this.util.formatData1(date)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // console.log(date)
        // console.log(d)
        const tempFilePaths = res.tempFilePaths;

        const element = res.tempFilePaths[0];
        const type = element.substring(element.lastIndexOf("\."));
        console.log(type) */

        // 上传到本地服务器
        wx.uploadFile({
          url: 'http://127.0.0.1/addGoodsServlet', // 开发者服务器地址
          filePath: tempFilePaths[0],
          name: 'name', // 文件对应的key
          formData: {
            'fileName': d + type
          }, // https请求中其他额外的form data
          success(res) {
            // 小程序上传接口uploadFile,服务器端响应的数据是通过String返回,在前段需要进行JSON序列化转换  
            /*  const info = JSON.parse(res.data)
             console.log(info.data.imgUrl) */
            console.log(res);
          }
        })
     /*  }
    }) */
  },

  /* 表单提交数据 */
  imgUpload(e) {
    const {
      chooseImgs
    } = this.data;
    var date = Date.parse(new Date());
    var d = this.util.formatData1(date)

    chooseImgs.forEach((v, i) => {

      console.log(v);
      var type = v.substring(v.lastIndexOf("\."));
       // 上传到本地服务器
       wx.uploadFile({
        url: 'http://127.0.0.1/addGoodsServlet', // 开发者服务器地址
        filePath: v,
        name: 'name', // 文件对应的key
        formData: {
          'fileName': d + type
        }, // https请求中其他额外的form data
        success(res) {
          console.log(res);
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
      }
    });
  },


  // bindMultiPickerChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     multiIndex: e.detail.value
  //   })
  // },

  // bindMultiPickerColumnChange: function (e) {

  //   var catesNameList = this.data.catesNameList;


  //   console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  //   var data = {
  //     multiArray: this.data.multiArray,
  //     multiIndex: this.data.multiIndex,
  //     cat_id: this.data.cat_id
  //   };
  //   data.multiIndex[e.detail.column] = e.detail.value;
  //   switch (e.detail.column) {
  //     case 0:
  //       switch (data.multiIndex[0]) {
  //         // 第一列第一行的所有data.multiArray[1]:第二列的名称, data.multiArray[2]:第二列的第一行的第三列
  //         case 0:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[0].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[0].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 1:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[1].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[1].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 2:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[2].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[2].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 3:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[3].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[3].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 4:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[4].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[4].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 5:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[5].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[5].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 6:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[6].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[6].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 7:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[7].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[7].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 8:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[8].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 9:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[9].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[9].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 10:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[10].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[10].map(v => v.children)[0].map(v => v.cat_name);
  //           break;
  //         case 11:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[11].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[11].map(v => v.children)[0].map(v => v.cat_name);
  //           break;

  //         case 12:
  //           data.multiArray[1] = catesNameList.map(v => v.children)[12].map(v => v.cat_name);
  //           data.multiArray[2] = catesNameList.map(v => v.children)[12].map(v => v.children)[0].map(v => v.cat_name);
  //           break;

  //       }

  //       data.multiIndex[1] = 0;
  //       data.multiIndex[2] = 0;
  //       break;


  //     case 1:
  //       switch (data.multiIndex[0]) {
  //         case 0:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[0].map(v => v.children)[0].map(v => v.cat_name);
  //               break;
  //           }
  //           break;

  //         case 1:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[1].map(v => v.children)[0].map(v => v.cat_name);
  //               break;
  //             case 1:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[1].map(v => v.children)[1].map(v => v.cat_name);
  //               break;
  //             case 2:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[1].map(v => v.children)[2].map(v => v.cat_name);
  //               break;
  //           }
  //           break;

  //         case 2:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[2].map(v => v.children)[0].map(v => v.cat_name);
  //               break;
  //             case 1:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[2].map(v => v.children)[1].map(v => v.cat_name);
  //               break;
  //             case 2:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[2].map(v => v.children)[2].map(v => v.cat_name);
  //               break;
  //           }
  //           break;

  //         case 3:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[3].map(v => v.children)[0].map(v => v.cat_name);
  //               break;
  //             case 1:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[3].map(v => v.children)[1].map(v => v.cat_name);
  //               break;
  //             case 2:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[3].map(v => v.children)[2].map(v => v.cat_name);
  //               break;
  //           }
  //           break;

  //         case 4:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[4].map(v => v.children)[0].map(v => v.cat_name);
  //               break;

  //           }
  //           break;

  //         case 5:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[5].map(v => v.children)[0].map(v => v.cat_name);
  //               break;

  //           }
  //           break;


  //         case 6:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[6].map(v => v.children)[0].map(v => v.cat_name);
  //               break;

  //           }
  //           break;


  //         case 7:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[7].map(v => v.children)[0].map(v => v.cat_name);
  //               break;
  //             case 1:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[7].map(v => v.children)[1].map(v => v.cat_name);
  //               break;

  //           }
  //           break;


  //         case 8:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[0].map(v => v.cat_name);
  //               break;
  //             case 1:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[1].map(v => v.cat_name);
  //               break;
  //             case 2:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[2].map(v => v.cat_name);
  //               break;
  //             case 2:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[8].map(v => v.children)[3].map(v => v.cat_name);
  //               break;
  //           }
  //           break;


  //         case 9:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[9].map(v => v.children)[0].map(v => v.cat_name);
  //               break;

  //           }
  //           break;


  //         case 10:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[10].map(v => v.children)[0].map(v => v.cat_name);
  //               break;
  //             case 1:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[10].map(v => v.children)[1].map(v => v.cat_name);
  //               break;

  //           }
  //           break;


  //         case 11:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[11].map(v => v.children)[0].map(v => v.cat_name);
  //               break;

  //           }
  //           break;


  //         case 12:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = catesNameList.map(v => v.children)[12].map(v => v.children)[0].map(v => v.cat_name);

  //               break;
  //           }
  //           break;

  //       }
  //       data.multiIndex[2] = 0;
  //       break;
  //   }
  //   data.cat_id = catesNameList.map(v => v.children)[data.multiIndex[0]].map(v => v.children)[data.multiIndex[1]].map(v => v.cat_id)[data.multiIndex[2]];
  //   console.log(data.multiIndex);
  //   console.log(data.cat_id);
  //   this.setData(data);
  // },



  // onShow() {
  //   var catesNameList = wx.getStorageSync("catesNameList");

  //   this.getCates()

  //   this.setData({
  //     catesNameList
  //   })

  //   console.log(catesNameList);


  //   let oneNameList = catesNameList.map(v => v.cat_name);
  //   console.log(oneNameList);

  //   /* let two = catesNameList.map(v => v.children);
  //   let twoNameList = two[0].map(v => v.cat_name);

  //   console.log(twoNameList); */

  //   let twoNameList = catesNameList.map(v => v.children)[0].map(v => v.cat_name);

  //   console.log(twoNameList);


  //   /*  let three = two[0].map(v => v.children);
  //    let threeNameList = three[0].map(v => v.cat_name);
  //    console.log(threeNameList); */

  //   // 第一个"0",修改第二列,第二个"0",修改第三列
  //   let threeNameList = catesNameList.map(v => v.children)[0].map(v => v.children)[0].map(v => v.cat_name);
  //   console.log(threeNameList);


  //   let list = [];

  //   list.push(oneNameList);
  //   list.push(twoNameList);
  //   list.push(threeNameList);

  //   this.setData({
  //     multiArray: list
  //   })



  // },


  // getCates() {
  //   var catesNameList = [];
  //   wx.request({
  //     url: 'http://localhost/catesServlet',

  //     success: (result) => {

  //       catesNameList = result.data;

  //       this.setData({
  //         catesNameList
  //       })
  //       wx.setStorageSync("catesNameList", catesNameList);
  //     },


  //   });




  // }



  //   getCates() {
  //     console.log(this.data.multiArray);
  //     // 1.使用es7的async await 发送请求
  //     var cates = wx.getStorageSync("cates");

  //     //console.log(cates);
  //     var catList = [];

  //     this.setData({
  //       cates: catesList,
  //     })

  //     var catesList = cates.data

  //     catesList.forEach((v, i) => {
  //       /*  catOne.push(v.cat_name) */
  //       var catOne = [];

  //       catOne.push(v.cat_name);
  //       /*  console.log(v.cat_id); */
  //       var catTwo = [];
  //       v.children.forEach((j, h) => {

  //         if (v.cat_id == j.cat_fid) {
  //           catTwo.push(j.cat_name);
  //           //console.log(j.cat_name);
  //           var catThree = [];
  //           j.children.forEach((x, h) => {
  //             if (j.cat_id == x.cat_fid) {
  //               catThree.push(x.cat_name);
  //               console.log(x.cat_name);
  //             }


  //             console.log(catThree);
  //             catTwo.children = [];
  //             catTwo.children.push(catThree);
  //             catTwo.children.push({"222":222});
  //             catTwo.children.push({"222":111});
  //             console.log("-----");






  //           })

  //          /*  console.log(catThree);
  //           catTwo.push(catThreeName);
  //           catTwo.push({"children":catThree});

  //           console.log("-----"); */
  //         }

  //         /*    catOne.children = catTwo; */
  //         /*   console.log(catOne); */
  //         catOne.children = [];
  //         catOne.children.push(catTwo);

  //       })

  //       catList.push(catOne)

  //     })
  //     console.log(catList);

  //     this.setData({
  //       catList
  //     })


  //     let oneList = catList.map(v => v[0]);

  //     console.log(oneList);

  //     let two = catList.map(v => v.children[0]);
  //     let twoList = [];
  //     twoList.push(two[0]);
  //     console.log(twoList);

  //     let threeList = catList.map(v => v.children.children);

  //     let list = [];

  //     list.push(oneList);
  //     list.push(twoList);
  //     list.push(threeList[0]);

  //     this.setData({
  //       multiArray: list
  //     })



  //     console.log(this.data.multiArray);





  //     //console.log(threeList); 


  //     /*  this.setData({
  //       multiArray:[]
  //     })

  //     this.data.multiArray.push(oneList);
  //     this.data.multiArray.push(twoList);
  //     this.data.multiArray.push(threeList);
  //     console.log(this.data.multiArray);
  //  */
  //     // 构造右侧的商品数据
  //     /*   let rightMenuList = this.data.cates[0].children;
  //     console.log(rightMenuList);



  //     /* this.setData({
  //       leftMenuList: leftMenuList,
  //       rightMenuList: rightMenuList
  //     }) */

  //   },




})