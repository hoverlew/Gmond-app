var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    cartlist: [],//购物车列表
    rec_id: 0,//购物车列表Id
    goods_buynumber: 0,//商品购买数量
    attrData: [],//商品属性
    goods_id: 0,//商品Id 
    productdata: [],//商品列表  
    goods_price: '',//商品价格
    goods_attr_price: '',//显示价格
    firstIndex: -1,
    product_number: 0,//产品库存数量
    attrValueList: [],
    goods_attr_id_list: '',
    isload: false,//按钮是否可用
    goods_attr_ids: '',//购物车商品属性Id
    user_id: '',
  },


  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var index = e.currentTarget.dataset.index;//点击的属性下标
    var goods_attr_id = e.currentTarget.dataset.id;//点击的商品属性Id
    var attr_id = e.currentTarget.dataset.attr_id;//点击的属性分类Id
    var attr_price = e.currentTarget.dataset.attr_price;//点击的属性价格
    var list = that.data.productdata;
    var goods_id = that.data.goods_id;
    for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
      if (list[0].GoodsAttrList[i].attr_id == attr_id) {
        if (list[0].GoodsAttrList[i].goods_attr_id != goods_attr_id) {
          list[0].GoodsAttrList[i].is_select = false;
        }
      }
    }
    if (list[0].GoodsAttrList[index].is_select == true) {
      
    } else {
      list[0].GoodsAttrList[index].is_select = true;
    }
    that.setData({
      productdata: list
    })
    //判断属性价格是否为空 
    if (attr_price != null || attr_price != '') {
      that.setData({
        goods_price: attr_price
      })
    }

    //缓存选择属性的集合
    //wx.setStorageSync('productdata', list)

    var goods_attr_id_list = '';//属性列表
    //选择的属性产品
    for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
      if (list[0].GoodsAttrList[i].is_select == true) {
        goods_attr_id_list = goods_attr_id_list + list[0].GoodsAttrList[i].goods_attr_id + ",";
      }
    }
    goods_attr_id_list = goods_attr_id_list.substring(0, goods_attr_id_list.length - 1);
    //选择产品的库存数量
    ECApiHelper.ProductInfoGet(goods_id, goods_attr_id_list, function (res) {
      var list = JSON.parse(res.Body);
      // console.log(res)
      // console.log(res.Body)
      var product_number = list[0].product_number;//产品库存数量
      wx.setStorageSync("product_number", list[0].product_number);
      var shop_final_amount = list[0].goods_info.shop_final_amount; //产品价格
      var loadbool = true;
      var attributenumber = that.data.attrData.length;//规矩数量
      var selectnumber = 0;//选择的规格数量
      var goodslist = that.data.productdata;
      for (var i = 0; i < goodslist[0].GoodsAttrList.length; i++) {
        if (goodslist[0].GoodsAttrList[i].is_select == true) {
          selectnumber = selectnumber + 1;
        }
      }
      if (selectnumber >= attributenumber) {
        loadbool = true;
      } else {
        loadbool = false;
      }
      //如果选择的规格参数正确
      if (loadbool) {
        //判断商品是否有产品
        if (list[0].product_id == "" || list[0].product_id == null) {
          that.setData({
            product_number: 0, //商品库存数量
          })
        } else {
          that.setData({
            product_number: product_number, //产品库存数量
          })
        }
        //价格初始化
        var goods_attr_price = that.data.goods_attr_price;
        // console.log(shop_final_amount)
        if (shop_final_amount != '' && shop_final_amount != null && shop_final_amount != 0) {
          that.setData({
            goods_attr_price: shop_final_amount,
          })
          wx.hideLoading();
        }
      } else {
        that.setData({
          product_number: list[0].goods_info.goods_number, //商品库存数量
          goods_attr_price: list[0].goods_info.shop_price,//商品价格
        })
        wx.hideLoading();
      }
    })
  },

  onShow: function () {

  },

  /* 点击确定 */
  submit: function () {
    var that = this;
    that.setData({
      isload: true
    })
    //判断是否有选择属性

    var list = that.data.productdata;
    var loadbool = true;
    var attributenumber = that.data.attrData.length;//规矩数量
    var selectnumber = 0;//选择的规格数量
    var attr_list = that.data.attr_list == null ? that.data.goods_attr_id_list : that.data.attr_list;
    if (list[0].GoodsAttrList.length > 0) {
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        //console.log(attr_list.length);
        for (var k = 0; k < attr_list.length; k++) {
          if (list[0].GoodsAttrList[i].attr_id == attr_list[k]) {
            if (list[0].GoodsAttrList[i].is_select == true) {
              selectnumber = selectnumber + 1;
            }
          }
        }
      }
    }
    if (selectnumber >= attributenumber) {
      loadbool = true;
    } else {
      loadbool = false;
    }
    if (loadbool) {
      if (that.data.product_number == 0) {
        wx.showToast({
          title: '产品库存不足!',
        })
        that.setData({
          isload: false
        })
      } else {
        that.AlertCartInfoSet();

      }
    } else {
      wx.showToast({
        title: '请选择规格',
      })
      that.setData({
        isload: false
      })
    }
  },

  /**
   * 显示购物车
   */
  UserCartList: function () {
    var that = this;
    that.AllCartListGet();
  },

  /**
    * 获取购物车列表
    */
  AllCartListGet: function (user_id) {
    var that = this;
    var user_id = that.data.user_id;
    ECApiHelper.CartListGet(user_id, null, null, null, null, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      that.setData({
        cartlist: list
      });
      wx.hideLoading();
      if (response == false) {
        wx.showModal({
          title: '提示',
          content: '您的网络有异常，下拉刷新试试看~~~',
          showCancel: false,
          success: function (res) {
          }
        })
        return;
      }
      if (response.is_error) {
        wx.showModal({
          title: '提示',
          content: '获取数据出错，' + response.ErrMsg,
          showCancel: false,
          success: function (res) {
          }
        })
        return;
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        })
      },
    })
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      goods_id: options.goods_id,
    })
    that.GoodsListGet();
    that.UserCartList();
    //var productdata = wx.getStorageSync('productdata');
    //var goods_attr_price = wx.getStorageSync('attr_price');
    //var product_number = wx.getStorageSync('product_number');

    that.setData({
      rec_id: options.rec_id,
      goods_buynumber: options.goods_number,
      //productdata: productdata,
      //goods_attr_price: options.goods_attr_price,
      //product_number: product_number,
      goods_attr_ids: options.goods_attr_id,
    })
    //console.log(that.data.goods_attr_id)

  },

  /**
   * 商品数量增加
   */
  OnAdd: function () {
    var that = this;
    var goods_buynumber = that.data.goods_buynumber;
    //如果购买数量大于库存数量，友好提示
    if (parseInt(goods_buynumber) + 1 > parseInt(that.data.product_number)) {
      wx.showToast({
        title: '库存数量不足！',
        icon: 'none'
      })
    } else {
      goods_buynumber = parseInt(goods_buynumber) + 1;
    }
    that.setData({
      goods_buynumber: goods_buynumber,//更新商品购买数量
    })
  },

  /**
   * 商品数量减少
   */
  OnMinus: function () {
    var that = this;
    var goods_buynumber = that.data.goods_buynumber; //购买数量
    if (goods_buynumber != 1) {
      goods_buynumber = parseInt(goods_buynumber) - 1;
    } else {
      goods_buynumber = parseInt(goods_buynumber)
    }
    that.setData({
      goods_buynumber: goods_buynumber
    })
  },

  /**
   * 更新购物车商品属性
   */
  AlertCartInfoSet: function () {
    var that = this;
    var rec_id = that.data.rec_id; //购物车记录Id
    var goods_buynumber = that.data.goods_buynumber;//商品购买数量
    var goods_attr_id = '';//要修改的商品属性
    var list = that.data.productdata;
    if (that.data.attr_ids == "" || that.data.attr_ids == null) {
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        if (list[0].GoodsAttrList[i].is_select == false) {
          goods_attr_id += list[0].GoodsAttrList[i].goods_attr_id + ","
        }
      }
      goods_attr_id = goods_attr_id.substring(0, goods_attr_id.length - 1)
    } else {
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        if (list[0].GoodsAttrList[i].is_select == true) {
          goods_attr_id += list[0].GoodsAttrList[i].goods_attr_id + ","
        }
      }
      goods_attr_id = goods_attr_id.substring(0, goods_attr_id.length - 1)
    }
    if (goods_attr_id == "" || goods_attr_id == null) {
      goods_attr_id = that.data.goods_attr_id_list;
    }
    //删除原购物车列表 添加新的商品到购物车
    var goods_id = that.data.goods_id;
    var user_id = that.data.user_id;
    //删除购物车商品
    ECApiHelper.CartInfoSet(user_id, rec_id, null, null, 'delete', function (response) {
      var list = JSON.parse(response.Body);
      if (list.error == 0) {
        ECApiHelper.CartInfoAdd(user_id, null, goods_id, goods_buynumber, goods_attr_id, function (response) {
          console.log(response.Body);
          var list = JSON.parse(response.Body);
          if (list.error == 0) {
            wx.showToast({
              title: '更新成功!',
            })
            that.setData({
              isload: false
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/steps/cart/cart',
              })
            }, 500)
          } else {
            wx.showToast({
              title: '修改失败！',
            })
            that.setData({
              isload: false
            })
          }
        })
      } else {
        wx.showToast({
          title: '修改失败！',
        })
      }
    })
  },

  /**
   * 显示商品详情信息 
   */
  GoodsListGet: function () {
    var that = this;
    var goods_id = that.data.goods_id;
    ECApiHelper.GoodsListGet(null, null, goods_id, null, null, null, null, null, null, null, 1, null,function (response) {
      var list = JSON.parse(response.Body);
      //向数组末尾添加字段-控制商品属性
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        list[0].GoodsAttrList[i]["is_select"] = true;
      }
      //console.log('刚获取')
      //console.log(list)
      var cat_ids = list[0].goods_type;
      var attr_ids = '';
      var attr_id = '';
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        var isfisrt = 0;
        for (var k = 0; k < list[0].GoodsAttrList.length; k++) {
          if (list[0].GoodsAttrList[i].attr_id == list[0].GoodsAttrList[k].attr_id) {
            isfisrt = isfisrt + 1;
            attr_id = list[0].GoodsAttrList[i].attr_id;
          }
        }
        if (isfisrt > 1) {
          if (attr_ids.indexOf(attr_id) == -1) {
            attr_ids += list[0].GoodsAttrList[i].attr_id + ",";
          }
        }
      }

      if (attr_ids == "") {
        attr_ids = null;
      } else {
        attr_ids = attr_ids.substring(0, attr_ids.length - 1);
      }
      that.setData({
        attr_ids: attr_ids
      })
      //拆分数组-取商品筛选属性Id 
      if (attr_ids != null) {
        var attr_list = attr_ids.split(',');
        that.setData({
          attr_list: attr_list
        })
        // console.log('多项属性')
        var goods_attr_ids = that.data.goods_attr_ids;
        var goods_attr_idser = goods_attr_ids.split(",");
        //  console.log(goods_attr_idser);
        for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
          for (var k = 0; k < attr_list.length; k++) {
            if (list[0].GoodsAttrList[i].attr_id == attr_list[k]) {
              list[0].GoodsAttrList[i].is_select = false;
            }
          }
        }
        if (goods_attr_idser != null && goods_attr_idser != "") {
          for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
            for (var k = 0; k < goods_attr_idser.length; k++) {
              if (list[0].GoodsAttrList[i].goods_attr_id == goods_attr_idser[k]) {
                list[0].GoodsAttrList[i].is_select = true;
              }
            }
          }
        }


      } else {
        //只有单项属性的商品
        //console.log(list)
        var goods_attr_id_list = '';//属性列表
        //选择的属性产品 
        for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
          if (list[0].GoodsAttrList[i].is_select == true) {
            goods_attr_id_list = goods_attr_id_list + list[0].GoodsAttrList[i].attr_id + ",";
          }
        }
        goods_attr_id_list = goods_attr_id_list.substring(0, goods_attr_id_list.length - 1);
        //console.log(goods_attr_id_list)
        //没有多项可选择的属性但是有产品的商品属性组合Id
        that.setData({
          goods_attr_id_list: goods_attr_id_list
        })
      }
      //拆分数组-取商品筛选属性Id
      var goods_attr_id = list[0].ProCategory.filter_attr;
      // console.log(attr_ids)
      //获取商品属性
      if (attr_ids != null && attr_ids != "") {
        ECApiHelper.AttributeListGet(cat_ids, attr_ids, function (res) {
          //console.log(res.Body)
          var list = JSON.parse(res.Body);
          that.setData({
            attrData: list,
          })
        })
      }
      //获取商品筛选属性
      if (goods_attr_id != null && goods_attr_id != "") {
        ECApiHelper.AttributeListGet(cat_ids, goods_attr_id, function (resd) {
          //console.log(resd.Body)
          var list = JSON.parse(resd.Body);
          that.setData({
            goods_attr: list,
            goods_type: cat_ids,
            goods_attr_id: goods_attr_id
          })
        })
      }
      if (attr_ids == null) {
        that.setData({
          product_number: '',
        })
      }
      //购物车商品属性价格初始化
      if (attr_ids != null && attr_ids != "") {
        ECApiHelper.ProductInfoGet(goods_id, goods_attr_ids, function (resss) {
          //console.log(resss.Body);
          var prolist = JSON.parse(resss.Body);
          //判断商品是否有产品
          //console.log(that.data.attr_price)
          if (prolist[0].product_id == "" || prolist[0].product_id == null) {
            var goods_amount = wx.getStorageSync('goods_amount');

            that.setData({
              product_number: list[0].goods_number, //商品库存数量
              goods_attr_price: goods_amount,//商品价格
            })
          } else {
            that.setData({
              product_number: prolist[0].product_number, //产品库存数量
              goods_attr_price: prolist[0].goods_info.shop_final_amount
            })
          }
        })
      } else {

      }
      // console.log(that.data.product_number)
      if (that.data.product_number == '' || that.data.product_number == null) {
        if (attr_ids == null) {
          //console.log('单项属性商品,赋值赋值商品库存');
          that.setData({
            product_number: list[0].goods_number,//商品数量初始化
          })
        } else {
          that.setData({
            product_number: list[0].goods_number,//商品数量初始化
          })
        }
      }
      //console.log(that.data.productdata)
      if (that.data.productdata == null || that.data.productdata == "" || that.data.productdata[0].goods_id != goods_id) {
        that.setData({
          productdata: list,
          goods_attr_price: list[0].shop_price,//价格初始化
        })
        //console.log(that.data.productdata)
      }

      if (response == false) {
        wx.showModal({
          title: '提示',
          content: '您的网络有异常，下拉刷新试试看~~~',
          showCancel: false,
          success: function (res) {
          }
        })
        return;
      }
      if (response.is_error) {
        wx.showModal({
          title: '提示',
          content: '获取数据出错，' + response.ErrMsg,
          showCancel: false,
          success: function (res) {
          }
        })
        return;
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})