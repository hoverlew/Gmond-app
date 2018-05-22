//获取应用实例 
var app = getApp();
var ECApiHelper = require('../../utils/ECApiHelper');
Page({
  data: {
    Height: '',
    indicatorDots: false,
    circular: true,
    vertical: false,
    autoplay: true,
    interval: 10000,
    duration: 1000,
    Diamondscurrent: 0,
    goldcurrent: 0,
    Kgoldcurrent: 0,
    Platinumcurrent: 0,
    swiperData: [],
    listData: [],
    goods_id: 0,
    isShow: false,//加载提示
    navlist: [],//商品类型列表
    DiamondsData: [],//钻石
    goldData: [],//黄金
    KgoldData: [],//K金
    PlatinumData: [],//铂金
    couponimg: '',//优惠卷图片
    couponid: '',//优惠卷Id
    imgUrl: '/images/no_picture.gif',//默认显示图片
    is_Online: 0,//是否线上专款
  },

  /*轮播设置高度*/
  adaptionImg: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth;//获取当前屏幕的宽度
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      Height: swiperH//设置高度
    })
  },

  /**
    * 显示所有优惠卷列表
    */
  AllFavourableCouponListGet: function () {
    var that = this;
    //优惠卷列表
    ECApiHelper.FavourableCouponListGet(null, null, 0, null, function (response) {
      console.log(response.Body);
      //console.log('所有优惠卷列表')
      var Couponlist = JSON.parse(response.Body);
      console.log(Couponlist)
      for (var i = 0; i < Couponlist.length; i++) {
        if (Couponlist[i].act_name == "无门槛优惠券") {
          that.setData({
            //couponimg: "http://192.168.88.70:81/" + Couponlist[i].act_mobile_img,
            couponimg: "http://www.gmond.com/" + Couponlist[i].act_mobile_img,
            couponid: Couponlist[i].act_id
          })
          console.log(that.data.couponid)
        }
      }
    })
  },

  /**
   * 拨打客服电话
   */
  CallPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '400-8866-355',
    })
  },

  /**
   * 商品轮播图商品跳转
   */
  goodsdetail: function (e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.id;
    //console.log(goods_id);
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },

  /**
   * 钻石数组
   */
  Diamonds: function () {
    var that = this;
    ECApiHelper.GoodsListGet(null, 9, null, null, null, 1, 9, null, null, null, 1, null, function (response) {
      var list = JSON.parse(response.Body);
      var DiamondsData = that.data.DiamondsData;
      //改变数组形态
      DiamondsData.push(list.slice(0, 3));
      DiamondsData.push(list.slice(3, 6));
      DiamondsData.push(list.slice(6, 9));
      that.setData({
        DiamondsData: DiamondsData
      })
      that.gold();
      wx.setStorageSync('DiamondsData', DiamondsData)
    })
  },

  /**
   * 黄金数组
   */
  gold: function () {
    var that = this;
    ECApiHelper.GoodsListGet(null, 11, null, null, null, 1, 9, null, null, null, 1, null, function (response) {
      var list = JSON.parse(response.Body);
      var goldData = that.data.goldData;
      //改变数组形态
      goldData.push(list.slice(0, 3));
      goldData.push(list.slice(3, 6));
      goldData.push(list.slice(6, 9));
      that.setData({
        goldData: goldData
      })
      that.Kgold();
      wx.setStorageSync('goldData', goldData)
    })
  },

  /**
   * K金数组
   */
  Kgold: function () {
    var that = this;
    ECApiHelper.GoodsListGet(null, 12, null, null, null, 1, 9, null, null, null, 1, null, function (response) {
      var list = JSON.parse(response.Body);
      var KgoldData = that.data.KgoldData;
      //改变数组形态
      KgoldData.push(list.slice(0, 3));
      KgoldData.push(list.slice(3, 6));
      KgoldData.push(list.slice(6, 9));
      that.setData({
        KgoldData: KgoldData
      })
      wx.hideLoading();
      that.Platinum();
      wx.setStorageSync('KgoldData', KgoldData)
    })
  },


  /**
   * 铂金数组
   */
  Platinum: function () {
    var that = this;
    ECApiHelper.GoodsListGet(null, 13, null, null, null, 1, 9, null, null, null, 1, null, function (response) {
      var list = JSON.parse(response.Body);
      var PlatinumData = that.data.PlatinumData;
      //改变数组形态
      PlatinumData.push(list.slice(0, 3));
      PlatinumData.push(list.slice(3, 6));
      PlatinumData.push(list.slice(6, 9));
      that.setData({
        PlatinumData: PlatinumData
      })

      wx.setStorageSync('PlatinumData', PlatinumData)
    })
  },


  /*轮播按钮点击事件*/
  // 跳转下一页\
  DiamondsnextImg: function () {
    var that = this;
    let Diamondscurrent = that.data.Diamondscurrent;
    Diamondscurrent++;
    if (Diamondscurrent > this.length) {
      Diamondscurrent = 0;
    };
    that.setData({
      Diamondscurrent: Diamondscurrent
    })
    var DiamondsData = that.data.DiamondsData;
    if (Diamondscurrent >= DiamondsData.length) {
      that.setData({
        Diamondscurrent: 0
      })
    }
  },

  /*轮播按钮点击事件*/
  // 跳转下一页\
  goldnextImg: function () {
    var that = this;
    let goldcurrent = that.data.goldcurrent;
    goldcurrent++;
    if (goldcurrent > this.length) {
      goldcurrent = 0;
    };
    that.setData({
      goldcurrent: goldcurrent
    })
    var goldData = that.data.goldData;
    if (goldcurrent >= goldData.length) {
      that.setData({
        goldcurrent: 0
      })
    }
  },

  /*轮播按钮点击事件*/
  // 跳转下一页\
  KgoldnextImg: function () {
    var that = this;
    let Kgoldcurrent = that.data.Kgoldcurrent;
    Kgoldcurrent++;
    if (Kgoldcurrent > this.length) {
      Kgoldcurrent = 0;
    };
    that.setData({
      Kgoldcurrent: Kgoldcurrent
    })
    var KgoldData = that.data.KgoldData;
    if (Kgoldcurrent >= KgoldData.length) {
      that.setData({
        Kgoldcurrent: 0
      })
    }
  },

  /*轮播按钮点击事件*/
  // 跳转下一页\
  PlatinumnextImg: function () {
    var that = this;
    let Platinumcurrent = that.data.Platinumcurrent;
    Platinumcurrent++;
    if (Platinumcurrent > this.length) {
      Platinumcurrent = 0;
    };
    that.setData({
      Platinumcurrent: Platinumcurrent
    })
    var PlatinumData = that.data.PlatinumData;
    if (Platinumcurrent >= PlatinumData.length) {
      that.setData({
        Platinumcurrent: 0
      })
    }
  },

  // 钻石跳转上一页
  DiamondsprevImg: function () {
    var that = this;
    let Diamondscurrent = that.data.Diamondscurrent;
    Diamondscurrent--;
    if (Diamondscurrent < this.length) {
      Diamondscurrent = 0;
    };
    that.setData({
      Diamondscurrent: Diamondscurrent
    })
    var DiamondsData = that.data.DiamondsData;
    if (Diamondscurrent <= 0) {
      that.setData({
        Diamondscurrent: DiamondsData.length - 1
      })
    }
  },

  // 跳转上一页
  goldprevImg: function () {
    var that = this;
    let goldcurrent = that.data.goldcurrent;
    goldcurrent--;
    if (goldcurrent < this.length) {
      goldcurrent = 0;
    };
    that.setData({
      goldcurrent: goldcurrent
    })
    var goldData = that.data.goldData;
    if (goldcurrent <= 0) {
      that.setData({
        goldcurrent: goldData.length - 1
      })
    }
  },

  // 跳转上一页
  KgoldprevImg: function () {
    var that = this;
    let Kgoldcurrent = that.data.Kgoldcurrent;
    Kgoldcurrent--;
    if (Kgoldcurrent < this.length) {
      Kgoldcurrent = 0;
    };
    that.setData({
      Kgoldcurrent: Kgoldcurrent
    })
    var KgoldData = that.data.KgoldData;
    if (Kgoldcurrent <= 0) {
      that.setData({
        Kgoldcurrent: KgoldData.length - 1
      })
    }
  },

  // 跳转上一页
  PlatinumprevImg: function () {
    var that = this;
    let Platinumcurrent = that.data.Platinumcurrent;
    Platinumcurrent--;
    if (Platinumcurrent < this.length) {
      current = 0;
    };
    that.setData({
      Platinumcurrent: Platinumcurrent
    })
    var PlatinumData = that.data.PlatinumData;
    if (Platinumcurrent <= 0) {
      that.setData({
        Platinumcurrent: PlatinumData.length - 1
      })
    }
  },


  /**
  * 页面首次加载
  */
  onLoad: function () {
    var that = this;
    wx.clearStorageSync();
    wx.clearStorage();
    wx.showLoading({
      title: '加载中...',
    })
    this.AdsListGet();
    that.AllFavourableCouponListGet();
    //this.GoodsListGet();
    var DiamondsData = wx.getStorageSync('DiamondsData');
    var goldData = wx.getStorageSync('goldData');
    var KgoldData = wx.getStorageSync('KgoldData');
    var PlatinumData = wx.getStorageSync('PlatinumData');
    if (DiamondsData.length <= 1 || goldData.length <= 1 || KgoldData.length <= 1 || PlatinumData.length <= 1) {
      that.Diamonds();
    } else {
      that.setData({
        DiamondsData: DiamondsData,
        goldData: goldData,
        KgoldData: KgoldData,
        PlatinumData: PlatinumData,
      })
      wx.hideLoading();
    }
    that.setData({
      isShow: true
    })
    that.NavListGet();
  },

  /**
   * 所有商品
   */
  allgoods: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/goods/list/list'
    })
  },

  /**
   * 导航菜单接口
   */
  NavListGet: function () {
    var that = this;
    ECApiHelper.NavListGet(function (response) {
      console.log(response.Body);
      var list = JSON.parse(response.Body);
      that.setData({
        navlist: list
      })
      wx.setStorageSync('navlist', list)
    })
  },



  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;
    //console.log('重新加载')
    wx.login({
      success: function (res) {
        ECApiHelper.UserLogin(res.code, function (response) {
          var user = JSON.parse(response.Body);
          var user_id = user.content.user_id;
          var open_id = user.content.openid; //open_id
          wx.setStorage({
            key: 'user_id',
            data: user_id,
          })
          wx.setStorage({
            key: 'open_id',
            data: open_id,
          })
        })
      }
    })
    //读取本地缓存数据
    var swiperData = wx.getStorageSync('swiperData');
    var listData = wx.getStorageSync('listData');
    var navlist = wx.getStorageSync('navlist');
    if (swiperData.length > 0) {
      that.setData({
        swiperData: swiperData
      })
    } else {
      that.AdsListGet();
    }
    if (listData.length > 0) {
      that.setData({
        listData: listData
      })
    } else {
      that.GoodsListGet();
    }
    if (navlist.length > 0) {
      that.setData({
        navlist: navlist
      })
    } else {
      that.NavListGet();
    }
    that.setData({
      swiperData: swiperData,
      listData: listData
    })
    var DiamondsData = wx.getStorageSync('DiamondsData');
    var goldData = wx.getStorageSync('goldData');
    var KgoldData = wx.getStorageSync('KgoldData');
    var PlatinumData = wx.getStorageSync('PlatinumData');
    if (DiamondsData.length <= 1 || goldData.length <= 1 || KgoldData.length <= 1 || PlatinumData.length <= 1) {
      that.Diamonds();
    } else {
      that.setData({
        DiamondsData: DiamondsData,
        goldData: goldData,
        KgoldData: KgoldData,
        PlatinumData: PlatinumData,
      })
      wx.hideLoading();
    }
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

  toStoresmap: function (e) {
    wx.navigateTo({
      url: '/pages/help/storesmap/storesmap',
    })
  },

  //导航分类跳转
  tonavlist: function (e) {
    var id = e.currentTarget.dataset.cid;
    var goods_name = e.currentTarget.dataset.name;
    //console.log(id, goods_name)
    if (goods_name == null || goods_name == "") {
      wx.navigateTo({
        url: '/pages/goods/list/list?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/list/list?key_workds=' + goods_name + '&id=' + id
      })
    }
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

  //领取首页优惠卷
  CouponJump: function () {
    var that = this;
    wx.showLoading({
      title: '领取中...',
    })
    var coupon_id = that.data.couponid;
    if (coupon_id == null || coupon_id == "") {
      wx.showToast({
        title: '暂无优惠券!',
        mask: true
      })
    } else {
      //领取优惠卷
      wx.login({
        success: function (res) {
          ECApiHelper.UserLogin(res.code, function (response) {
            var user = JSON.parse(response.Body);
            var user_id = user.content.user_id;
            var open_id = user.content.openid; //open_id
            ECApiHelper.FavourableCouponSet(user_id, coupon_id, function (responses) {
              //console.log(responses.Body);
              var list = JSON.parse(responses.Body);
              wx.hideLoading();
              if (list.content == null || list.content == '') {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: list.msg,
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '领取成功!',
                })
              }
            })
          })
        }
      })
    }
  },
  //分类专区1
  AreaOneJump: function () {
    wx.navigateTo({
      url: '/pages/goods/list/list?is_Online=0',
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
    //PositionId=12 头部轮播图 PositionId=18 分区图
    ECApiHelper.AdsListGet("12,18", function (response) {
      console.log(response.Body);
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
    ECApiHelper.GoodsListGet(null, null, null, null, null, null, null, null, null, null, 1, null, function (response) {
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
    })
  },
  /**
   * 首页轮播图跳转
   */
  swiperload: function (e) {
    var that = this;
    var ad_id = e.currentTarget.dataset.id;
    var ad_name = e.currentTarget.dataset.ad_name;
    //铂金钻饰
    if (ad_name == "铂金系列") {
      var goods_type = 13;
      wx.navigateTo({
        url: '/pages/goods/list/list?goods_type=' + goods_type,
      })
    } else if (ad_name == "门店预约") {
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