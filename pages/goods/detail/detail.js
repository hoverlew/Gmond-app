var util = require('../../../utils/util.js')
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    navTab: ["商品详情", "评价"],
    isChecked: false,
    is_checked: '/images/icon-heart.png', //已收藏
    normal: '/images/fav.png', //未收藏
    currentNavtab: "0",
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    id: 0,
    HiddenModel: true,
    is_cartorbuy: 0,
    priceindex: -1,
    attr_price: '',//属性价格
    addata: [
      "../../images/mall1.jpg",
      "../../images/mall2.jpg",
      "../../images/mall3.jpg"
    ],
    goods_weight: 0,//商品重量
    sizeData: [],
    productdata: [],
    detailData: [],
    goods_type: '',//商品类型
    attrData: [],//商品属性
    attr_list: '',
    attr_good_Data: [],//详情页商品属性名称
    attr_ids: '',//商品显示属性
    goods_id: 0,  //商品Id 
    goods_buynumber: 1,//商品购买数量
    goods_attr: [],//筛选的商品属性
    goods_attr_id: '',//商品属性筛选Id
    warnNumber: 0,//商品库存警告数量
    goods_attr_price: '',//显示价格
    shop_final_number: '',//产品库存数量
    promote_start_date: '',//上架时间
    goods_attr_id_list: '',
    evaluateData: [
      {
        'postId': 1,
        'evalName': '步行者的天空',
        'evalValue': '这个戒指非常的棒，棒棒棒',
        'evalDate': '2018-04-23'
      },
      {
        'postId': 2,
        'evalName': '科比在我这',
        'evalValue': '这个项链非常不错，值得推荐给大家，点赞',
        'evalDate': '2018-03-25'
      },
    ],
    evalNum: '30',
    evalProba: '100%',
    BuyNowLoad: true,//立即购买隐藏状态
    isload: true,//加入购物车-立即购买-是否可以点击
    user_id: '',
    rec_id: '',
  },

  /**
   * 收藏商品
   */
  toFavorite: function () {
    var that = this;
    var user_id = that.data.user_id;
    var goods_id = that.data.goods_id;
    var isChecked = that.data.isChecked;
    var rec_id = that.data.rec_id;
    var user_id = that.data.user_id;
    if (isChecked == true) {
      //获取收藏列表
      ECApiHelper.CollectGoodsListGet(user_id, goods_id, 0, function (respon) {
        var list = JSON.parse(respon.Body);
        if (list.length > 0) {
          that.setData({
            isChecked: true,
            rec_id: list[0].rec_id
          })
          //删除收藏
          ECApiHelper.CollectGoodsInfoSet(user_id, list[0].rec_id, goods_id, 0, 'delete', function (response) {
            var list = JSON.parse(response.Body);
            if (list.error == 0) {
              that.setData({
                isChecked: false
              })
            } else {
              wx.showModal({
                title: '提示',
                content: list.msg,
              })
            }
          })
        } else {
          that.setData({
            isChecked: false,
          })
        }
      })


    } else if (isChecked == false) {
      console.log(user_id, goods_id)
      //添加收藏
      ECApiHelper.CollectGoodsInfoSet(user_id, null, goods_id, 0, 'insert', function (response) {
        var list = JSON.parse(response.Body);
        if (list.error == 0) {
          that.setData({
            isChecked: true,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: list.msg,
          })
        }
      })

    }
  },


  /**
   * 初始化
   */
  loadDetail: function () {
    var that = this;
    var list = that.data.productdata;
    var goods_id = that.data.goods_id;
    //选择的属性产品 
    var goods_attr_id_list = '';//属性列表 
    for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
      if (list[0].GoodsAttrList[i].is_select == true) {
        goods_attr_id_list = goods_attr_id_list + list[0].GoodsAttrList[i].goods_attr_id + ",";
      }
    }
    goods_attr_id_list = goods_attr_id_list.substring(0, goods_attr_id_list.length - 1);
    //选择产品的库存数量
    //console.log(goods_id, goods_attr_id_list);
    ECApiHelper.ProductInfoGet(goods_id, goods_attr_id_list, function (res) {
      var list = JSON.parse(res.Body);
      //console.log(res)
      // console.log(res.Body)
      var product_number = list[0].product_number;//产品库存数量
      wx.setStorageSync("product_number", list[0].product_number);
      var shop_final_amount = list[0].goods_info.shop_final_amount; //产品价格
      var loadbool = true;
      var attributenumber = that.data.attrData.length;//规矩数量
      var selectnumber = 0;//选择的规格数量
      var goodslist = that.data.productdata;
      var attr_list = that.data.attr_list;
      for (var i = 0; i < goodslist[0].GoodsAttrList.length; i++) {
        for (var k = 0; k < attr_list.length; k++) {
          if (goodslist[0].GoodsAttrList[i].attr_id == attr_list[k]) {
            if (goodslist[0].GoodsAttrList[i].is_select == true) {
              selectnumber = selectnumber + 1;
            }
          }
        }
      }
      //console.log(selectnumber)
      //console.log(attributenumber)
      if (selectnumber >= attributenumber) {
        loadbool = true;
      } else {
        loadbool = false;
      }
      //如果选择的规格参数正确
      if (loadbool) {
        //判断商品是否有产品
        //console.log(list)
        if (list[0].product_id == "" || list[0].product_id == null) {
          that.setData({
            product_number: list[0].goods_info.goods_number, //商品库存数量
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
        }
      } else {
        that.setData({
          product_number: list[0].goods_info.goods_number, //商品库存数量
          goods_attr_price: list[0].goods_info.shop_price,//商品价格
        })
      }
    })
  },


  /**
   * 立即购买
   */
  OnBuy: function () {
    //判断是否登录
    var that = this;
    //判断是否已经登录
    var userInfo = app.globalData.userInfo;
    if (userInfo == null) {
      wx.showModal({
        title: '提示',
        content: '请先登录!',
        success: function (res) {
          //确定
          if (res.confirm) {
            //调起登录接口
            app.getUserInfo();
          } else if (res.cancel) {
            //console.log('用户取消操作')
          }
        }
      })
    } else {
      that.setData({
        BuyNowLoad: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var list =
      that.setData({
        id: id,
        goods_id: options.goods_id
      });
    //获取用户Id
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        })
      },
    })
  },

  /**
   * 详情图放大
   */
  imgsBig: function (e) {
    var that = this;
    var imgurl = [];//图片列表
    var goods_desc_list = that.data.goods_desc_list;

    for (var i = 0; i < goods_desc_list.length; i++) {
      imgurl = imgurl.concat("http://gmond.com/" + goods_desc_list[i])
    }
    wx.previewImage({
      current: "http://gmond.com/" + e.currentTarget.dataset.url,
      urls: imgurl,
    })

    /*测试
    for (var i = 0; i < goods_desc_list.length; i++) {
      imgurl = imgurl.concat("http://192.168.88.70:81/" + goods_desc_list[i])
    }
    wx.previewImage({
      current: "http://192.168.88.70:81/" + e.currentTarget.dataset.url,
      urls: imgurl,
    })
    */
  },

  /**
   * 图片预览
   */
  imgpriview: function (e) {
    var that = this;
    var imgurl = [];//图片列表
    var list = that.data.productdata;
    /* 测试
    for (var i = 0; i < list[0].GalleryList.length; i++) {
      imgurl = imgurl.concat("http://192.168.88.70:81/" + list[0].GalleryList[i].img_url)
    }
    wx.previewImage({
      current: "http://192.168.88.70:81/" + e.currentTarget.dataset.url,
      urls: imgurl,
    })
    */

    for (var i = 0; i < list[0].GalleryList.length; i++) {
      imgurl = imgurl.concat("http://gmond.com/" + list[0].GalleryList[i].img_url)
    }
    wx.previewImage({
      current: "http://gmond.com/" + e.currentTarget.dataset.url,
      urls: imgurl,
    })

  },

  //商品筛选属性
  checkboxChange: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    //console.log(e)
    var index = e.currentTarget.dataset.index;//点击的属性下标
    var goods_attr_id = e.currentTarget.dataset.id;//点击的属性Id
    var attr_id = e.currentTarget.dataset.attr_id;//点击的属性分类Id
    var attr_price = e.currentTarget.dataset.attr_price;//属性价格
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
      productdata: list,
    })
    //console.log(list)
    //缓存选择属性的集合 -用于购物车编辑页面初始化
    wx.setStorageSync('productdata', list);
    var goods_attr_id_list = '';//属性列表 
    //选择的属性产品 
    for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
      if (list[0].GoodsAttrList[i].is_select == true) {
        goods_attr_id_list = goods_attr_id_list + list[0].GoodsAttrList[i].goods_attr_id + ",";
      }
    }
    goods_attr_id_list = goods_attr_id_list.substring(0, goods_attr_id_list.length - 1);
    //选择产品的库存数量
    //console.log(goods_id, goods_attr_id_list);
    ECApiHelper.ProductInfoGet(goods_id, goods_attr_id_list, function (res) {
      var list = JSON.parse(res.Body);
      //console.log(res)
      // console.log(res.Body)
      var product_number = list[0].product_number;//产品库存数量
      wx.setStorageSync("product_number", list[0].product_number);
      var shop_final_amount = list[0].goods_info.shop_final_amount; //产品价格
      var loadbool = true;
      var attributenumber = that.data.attrData.length;//规矩数量
      var selectnumber = 0;//选择的规格数量
      var goodslist = that.data.productdata;
      var attr_list = that.data.attr_list;
      for (var i = 0; i < goodslist[0].GoodsAttrList.length; i++) {
        for (var k = 0; k < attr_list.length; k++) {
          if (goodslist[0].GoodsAttrList[i].attr_id == attr_list[k]) {
            if (goodslist[0].GoodsAttrList[i].is_select == true) {
              selectnumber = selectnumber + 1;
            }
          }
        }
      }
      //console.log(selectnumber)
      //console.log(attributenumber)
      if (selectnumber >= attributenumber) {
        loadbool = true;
      } else {
        loadbool = false;
      }
      //如果选择的规格参数正确
      if (loadbool) {
        //判断商品是否有产品
        //console.log(list)
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
        }
      } else {
        that.setData({
          product_number: list[0].goods_info.goods_number, //商品库存数量
          goods_attr_price: list[0].goods_info.shop_price,//商品价格
        })
      }
    })
    wx.hideLoading();
  },

  /**
   * 添加商品到购物车
   */
  CartInfoAdd: function () {
    var that = this;
    var goods_id = that.data.goods_id;//商品Id
    var goods_buynumber = that.data.goods_buynumber;//商品购买数量
    var goods_attr_id = '';//选择的商品属性
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
    var user_id = that.data.user_id;
    ECApiHelper.CartInfoAdd(user_id, null, goods_id, goods_buynumber, goods_attr_id, function (response) {
      // console.log(response.Body);
      var list = JSON.parse(response.Body);
      if (list.error == 0) {
        wx.showToast({
          title: '添加成功!',
        })
        that.setData({
          isload: true
        })
        setTimeout(function () {
          wx.showModal({
            title: '提示',
            content: '是否立即结算？',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/steps/cart/cart',
                })
              } else if (res.cancel) {
                that.setData({
                  HiddenModel: true
                })
              }
            }
          })
        }, 500)
      } else {
        wx.showModal({
          title: '提示',
          content: list.msg,
        })
        that.setData({
          isload: true
        })
      }
    })
  },

  /**
   * 判断商品是否有货品
   */
  isGoodsProduct: function () {
    var that = this;
    var goods_id = that.data.goods_id;//商品Id
    ECApiHelper.ProductInfoGet(goods_id, null, function (res) {
      //console.log(res.Body);
      var list = JSON.parse(res.Body);
    })
  },

  /**
   * 参数页加入购物车
   */
  OnConfirm: function () {
    //判断是否有选择属性
    var that = this;
    if (that.data.isload) {
      that.setData({
        isload: false
      })
      that.isGoodsProduct();
      var list = that.data.productdata;
      var loadbool = true;
      var attributenumber = that.data.attrData.length;//规矩数量
      var selectnumber = 0;//选择的规格数量
      var attr_list = that.data.attr_list;
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        for (var k = 0; k < attr_list.length; k++) {
          if (list[0].GoodsAttrList[i].attr_id == attr_list[k]) {
            if (list[0].GoodsAttrList[i].is_select == true) {
              selectnumber = selectnumber + 1;
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
            isload: true
          })
        } else {
          that.CartInfoAdd();
          that.setData({
            isload: true
          })
        }
      } else {
        wx.showToast({
          title: '请选择规格',
        })
        that.setData({
          isload: true
        })
      }
    }

  },

  /**
   * 立即购买
   */
  OnBuyNow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.isload) {
      that.setData({
        isload: false
      })
      //判断是否有选择属性
      var list = that.data.productdata;
      var loadbool = true;
      var attributenumber = that.data.attrData.length;//规矩数量
      var selectnumber = 0;//选择的规格数量
      var attr_list = that.data.attr_list;
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        for (var k = 0; k < attr_list.length; k++) {
          if (list[0].GoodsAttrList[i].attr_id == attr_list[k]) {
            if (list[0].GoodsAttrList[i].is_select == true) {
              selectnumber = selectnumber + 1;
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
        } else {
          //立即购买 跳转到订单确定页面
          that.GoodsBuyNow();
        }
      } else {
        wx.showToast({
          title: '请选择规格',
        })
      }
    }
  },

  /**
   * 加入购物车
   */
  GoodsBuyCart: function () {
    var that = this;
    //判断是否已经登录
    var userInfo = app.globalData.userInfo;
    if (userInfo == null) {
      wx.showModal({
        title: '提示',
        content: '请先登录!',
        success: function (res) {
          //确定
          if (res.confirm) {
            //调起登录接口
            app.getUserInfo();
          } else if (res.cancel) {
            //console.log('用户取消操作')
          }
        }
      })
    } else {
      that.setData({
        HiddenModel: false,
      })
    }
  },

  /**
   * 立即购买 订单确认
   */
  GoodsBuyNow: function () {
    var that = this;
    var goods_id = that.data.goods_id;//商品Id
    var goods_buynumber = that.data.goods_buynumber;//商品购买数量
    var goods_attr_id = '';//选择的商品属性
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
    var user_id = that.data.user_id;
    //添加商品到购物车
    ECApiHelper.CartInfoAdd(user_id, null, goods_id, goods_buynumber, goods_attr_id, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      //判断是否购买成功
      if (list.error == 0) {
        //获取购物车列表
        ECApiHelper.CartListGet(user_id, 'rec_id', 'desc', null, null, function (responses) {
          //console.log(responses.Body);
          var cartlist = JSON.parse(responses.Body);
          var cart = "";//刚添加的商品
          for (var i = 0; i < cartlist.length; i++) {
            if (cartlist[i].goods_id == goods_id && cartlist[i].goods_attr_id == goods_attr_id) {
              cart = cartlist[i];
            }
          }
          cart["is_select"] = 1; //添加属性
          //console.log(cart);
          wx.setStorageSync('cartlist', cart);
          wx.hideLoading();
          wx.navigateTo({
            url: '/pages/steps/pay/pay?buynow=' + true,
          })
          that.setData({
            isload: true
          })
        })
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: list.msg,
        })
        that.setData({
          isload: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.GoodsListGet();
    that.GetCollectGoodsList();
  },

  /**
   * 获取收藏列表
   */
  GetCollectGoodsList: function () {
    var that = this;
    var is_attention = 0;//1关注 0收藏
    var user_id = that.data.user_id;
    var goods_id = that.data.goods_id;
    if (user_id == null || user_id == "") {
      wx.login({
        success: function (res) {
          ECApiHelper.UserLogin(res.code, function (response) {
            var user = JSON.parse(response.Body);
            var user_id = user.content.user_id;
            var open_id = user.content.openid; //open_id
            //获取收藏列表
            ECApiHelper.CollectGoodsListGet(user_id, goods_id, 0, function (respon) {
              var list = JSON.parse(respon.Body);
              if (list.length > 0) {
                that.setData({
                  isChecked: true,
                  rec_id: list[0].rec_id
                })
              } else {
                that.setData({
                  isChecked: false,
                })
              }
            })
          })
        }
      })
    } else {
      //获取收藏列表
      ECApiHelper.CollectGoodsListGet(user_id, goods_id, 0, function (respon) {
        var list = JSON.parse(respon.Body);
        if (list.length > 0) {
          that.setData({
            isChecked: true,
          })
        } else {
          that.setData({
            isChecked: false,
          })
        }
      })
    }
  },

  /**
   * 显示商品详情信息
   */
  GoodsListGet: function () {
    var that = this;
    var goods_id = that.data.goods_id;
    console.log(goods_id)
    ECApiHelper.GoodsListGet(null, null, goods_id, null, null, null, null, null, null, null, null, null, function (response) {
      console.log(response)
      //console.log(response.Body)
      var list = JSON.parse(response.Body);
      //分割字符串 商品详情图
      var goods_desc_list = [];
      //console.log(list[0].goods_desc);
      var goods_desc = list[0].goods_desc.split("\"");
      //console.log(goods_desc)
      for (var i = 0; i < goods_desc.length; i++) {
        if (goods_desc[i].indexOf("images") >= 0) {
          goods_desc_list = goods_desc_list.concat(goods_desc[i]);
        }
      }
      that.setData({
        productdata: list,
      })
      setTimeout(function () {
        //商品详情图
        that.setData({
          goods_desc_list: goods_desc_list
        })
      }.bind(this), 1000)

      //上架时间
      var promote_start_date = list[0].add_time.substr(0, 10);
      that.setData({
        promote_start_date: promote_start_date
      })

      //  console.log(goods_desc_list)
      var goods_desc = list[0].goods_desc;
      var isdeng = true;
      var index = 0;
      //向数组末尾添加字段-控制商品属性
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        console.log(list[0].GoodsAttrList[i]["is_select"] = true)
      }
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
      //console.log(attr_ids)
      if (attr_ids != null) {
        var attr_list = attr_ids.split(',');
        that.setData({
          attr_list: attr_list
        })
        //console.log('筛选属性类型Id')
        //console.log(attr_list)
        for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
          for (var k = 0; k < attr_list.length; k++) {
            if (list[0].GoodsAttrList[i].attr_id == attr_list[k]) {
              list[0].GoodsAttrList[i].is_select = false;
            }
          }
        }
        //默认选中第一个属性
        var twolist = [];
        for (var i = 0; i < attr_list.length; i++) {
          var onelist = [];
          for (var k = 0; k < list[0].GoodsAttrList.length; k++) {
            if (attr_list[i] == list[0].GoodsAttrList[k].attr_id) {
              onelist = onelist.concat(list[0].GoodsAttrList[k].goods_attr_id)
              //console.log(onelist)
            }
          }
          for (var k = 0; k < list[0].GoodsAttrList.length; k++) {
            if (list[0].GoodsAttrList[k].goods_attr_id == onelist[0]) {
              list[0].GoodsAttrList[k].is_select = true;
            }
          }
        }
      } else {
        var goods_attr_id_list = '';//属性列表 
        //选择的属性产品 
        for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
          if (list[0].GoodsAttrList[i].is_select == true) {
            goods_attr_id_list = goods_attr_id_list + list[0].GoodsAttrList[i].goods_attr_id + ",";
          }
        }
        goods_attr_id_list = goods_attr_id_list.substring(0, goods_attr_id_list.length - 1);
        //没有多项可选择的属性但是有产品的商品属性组合Id
        that.setData({
          goods_attr_id_list: goods_attr_id_list
        })
      }
      var goods_attr_id = list[0].ProCategory.filter_attr;
      //规格页-获取商品属性
      ECApiHelper.AttributeListGet(cat_ids, attr_ids, function (res) {
        //console.log(res.Body)
        if (res.Body != null && res.Body != "") {
          var list = JSON.parse(res.Body);
          that.setData({
            attrData: list,
          })
        }
      })
      var good_attr_ids = '';
      var good_attr_id = '';
      for (var i = 0; i < list[0].GoodsAttrList.length; i++) {
        var isfisrt = 0;
        for (var k = 0; k < list[0].GoodsAttrList.length; k++) {
          if (list[0].GoodsAttrList[i].attr_id == list[0].GoodsAttrList[k].attr_id) {
            isfisrt = isfisrt + 1;
            good_attr_id = list[0].GoodsAttrList[i].attr_id;
          }
        }
        if (isfisrt < 2) {
          if (good_attr_ids.indexOf(good_attr_id) == -1) {
            good_attr_ids += list[0].GoodsAttrList[i].attr_id + ",";
          }
        }
      }
      if (good_attr_ids == "") {
        good_attr_ids = null;
      } else {
        good_attr_ids = good_attr_ids.substring(0, good_attr_ids.length - 1);
      }
      //详情页-获取商品属性名称-单项
      ECApiHelper.AttributeListGet(cat_ids, good_attr_ids, function (res) {
        //console.log('attr_good_Data')
        //console.log(res.Body)
        var list = JSON.parse(res.Body);
        that.setData({
          attr_good_Data: list,
        })
      })
      //获取商品筛选属性
      ECApiHelper.AttributeListGet(cat_ids, goods_attr_id, function (resd) {
        //console.log('商品筛选属性')
        //console.log(resd.Body)
        var list = JSON.parse(resd.Body);
        that.setData({
          goods_attr: list,
          goods_type: cat_ids,
          goods_attr_id: goods_attr_id
        })
      })
      that.setData({
        detailData: list,
        goods_attr_price: list[0].shop_price,//价格初始化
        product_number: list[0].goods_number,//商品数量初始化
      })
      that.loadDetail();
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



  bindswitchTap: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
  ShowModelPanel: function (e) {
    this.setData({
      is_cartorbuy: 0,
      HiddenModel: false,
    });
  },
  ColseModel: function (e) {
    this.setData({
      HiddenModel: true,
      BuyNowLoad: true,
    });
  },

  /**
   * 商品数量选择
   */

  //购买数量减少
  OnMinus: function (e) {
    var that = this;
    var goods_buynumber = that.data.goods_buynumber;//商品预购买数量
    if (goods_buynumber == 1) {

    } else {
      goods_buynumber = goods_buynumber - 1;
    }
    that.setData({
      goods_buynumber: goods_buynumber,//更新商品购买数量
    })
  },
  //购买数量增加
  OnAdd: function (e) {
    var that = this;
    that.setData({
      warnNumber: e.currentTarget.dataset.id
    })
    var goods_buynumber = that.data.goods_buynumber;
    //如果购买数量大于库存数量，友好提示
    //console.log(that.data.product_number)
    if (goods_buynumber + 1 > that.data.product_number) {
      wx.showToast({
        title: '库存数量不足！',
        icon: 'none'
      })
    } else {
      goods_buynumber = goods_buynumber + 1;
    }
    that.setData({
      goods_buynumber: goods_buynumber,//更新商品购买数量
    })
  },


  OnShop: function () {
    //返回商铺
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  OnCart: function () {
    //进入购物车
    wx.switchTab({
      url: '../../steps/cart/cart',
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
    var id = this.data.id;
    this.LoadData(id, true);
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
    var that = this;
    var productdata = that.data.productdata;
    var id = that.data.id;
    return {
      title: productdata == null ? maintitle : productdata.pro_name,
      path: '/pages/detail/detail?id=' + id,
    }
  },
})