//获取应用实例
var app = getApp();
var ECApiHelper = require('../../utils/ECApiHelper');
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    swiperData: [],
    listData: [],
    goods_id: 0,
    isShow: false,//加载提示
    navlist: [],//商品类型列表
  },

  /**
   * 获取收藏列表
   */
  GetCollectGoodsList: function () {
    var user_id = '';
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        user_id = res.data;
      },
    })
    var is_attention = 0;//1关注 0收藏
    ECApiHelper.CollectGoodsListGet(user_id, 0, function (res) {
      console.log('收藏列表')
      console.log(res.Body);
    })
  },

  /**
   * 所有商品
   */
  allgoods: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/goods/list/list',
    })
  },

  /**
   * 导航菜单接口
   */
  NavListGet: function () {
    var that = this;
    ECApiHelper.NavListGet(function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      that.setData({
        navlist: list
      })
      wx.setStorageSync('navlist', list)
    })
  },

  /**
    * 页面首次加载
    */
  onLoad: function () {
    var that = this;
    this.AdsListGet();
    this.GoodsListGet();
    that.setData({
      isShow: true
    })
    that.NavListGet();
    that.GetCollectGoodsList();
  },

  /* 生命周期函数--监听页面显示*/
  onShow: function () {

    wx.login({
      success: function (res) {
        ECApiHelper.UserLogin(res.code, function (response) {
          var user = JSON.parse(response.Body);
          var user_id = user.content.user_id;
          var open_id = user.content.openid; //open_id
        })
      }
    })

    //读取本地缓存数据
    var swiperData = wx.getStorageSync('swiperData');
    var listData = wx.getStorageSync('listData');
    var navlist = wx.getStorageSync('navlist');
    if (navlist.length > 0) {
      this.setData({
        navlist: navlist
      })
    }
    this.setData({
      swiperData: swiperData,
      listData: listData
    })
  },

  toCoupon: function () {
    wx.navigateTo({
      url: '../goods/coupon/coupon'
    })
  },

  toAbout: function () {
    wx.navigateTo({
      url: '../help/about/about'
    })
  },

  toStoresmap: function () {
    wx.navigateTo({
      url: '../help/storesmap/storesmap'
    })
  },

  toQuery: function () {
    wx.navigateTo({
      url: '../goods/query/query'
    })
  },

  toValidate: function () {
    wx.navigateTo({
      url: '../goods/validate/validate'
    })
  },

  toTester: function () {
    wx.navigateTo({
      url: '../test/test'
    })
  },

  toVip: function () {
    wx.navigateTo({
      url: '../goods/vip/vip'
    })
  },
  CouponJump: function () {
    wx.navigateTo({
      url: '/pages/goods/coupon/coupon',
    })
  },
  //分类专区1
  AreaOneJump: function () {
    wx.navigateTo({
      url: '/pages/goods/list/list?goods_type=0',
    })
  },
  //分类专区2
  AreaTwoJump: function () {
    wx.navigateTo({
      url: '/pages/goods/list/list?goods_type=9',
    })
  },
  //分类专区3
  AreaThreeJump: function () {
    wx.navigateTo({
      url: '/pages/goods/list/list?goods_type=11',
    })
  },
  //分类专区4 
  AreaFourJump: function () {
    wx.navigateTo({
      url: '/pages/goods/list/list?goods_type=12',
    })
  },
  //分类专区5
  AreaFiveJump: function () {
    wx.navigateTo({
      url: '/pages/goods/list/list?goods_type=13',
    })
  },
  //分类专区6
  AreaSixJump: function () {
    wx.navigateTo({
      url: '/pages/help/about/about',
    })
  },
  /*用户点击右上角分享*/
  onShareAppMessage: function () {
    return {
      title: maintitle,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 跳转商品详情页
   */
  goodsLoad: function (res) {
    var goods_id = res.currentTarget.dataset.goods_id
    //console.log(goods_id);  调试成功
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },

  /**
   * 获取首页轮播图
   */
  AdsListGet: function () {
    var that = this;
    ECApiHelper.AdsListGet(null, function (response) {
      //console.log(response.Body);
      var adsList = JSON.parse(response.Body);
      //缓存数据到本地
      try {
        wx.setStorageSync('swiperData', adsList)
      } catch (e) {
        wx.showToast({
          title: '数据出错!',
        })
      }
      that.setData({
        swiperData: adsList
      })
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
   * 获取商品列表
   */
  GoodsListGet: function () {
    var that = this;
    ECApiHelper.GoodsListGet(null, null, null, null, null, null, null, null, null, 1, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      //缓存数据到本地
      try {
        wx.setStorageSync('listData', list)
      } catch (e) {
        wx.showToast({
          title: '数据出错!',
        })
      }
      that.setData({
        listData: list,
      })
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
   * 首页轮播图跳转
   */
  swiperload: function (e) {
    var that = this;
    var ad_id = e.currentTarget.dataset.id;
    //铂金钻饰
    if (ad_id == 54) {
      var goods_type = 9;
      wx.navigateTo({
        url: '/pages/goods/list/list?goods_type=' + goods_type,
      })
    } else if (ad_id == 55) {
      var goods_type = 11;
      wx.navigateTo({
        url: '/pages/goods/list/list?goods_type=' + goods_type,
      })
    } else if (ad_id == 56) {
      var goods_type = 13;
      wx.navigateTo({
        url: '/pages/goods/list/list?goods_type=' + goods_type,
      })
    } else if (ad_id == 57) {
      wx.navigateTo({
        url: '/pages/help/storesmap/storesmap',
      })
    }
  },

  /**
   * 初次渲染
   */
  onReady: function () {

  }
})