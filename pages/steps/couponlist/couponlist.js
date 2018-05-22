var ECApiHelper = require('../../../utils/ECApiHelper');
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  /*页面的初始数据*/
  data: {
    reseiveData: [],//优惠卷列表
    pay_summoney: '',//商品总金额
    list: [],//购物车列表
    count: 0,//商品数量
    amount: 0,//商品金额
    goods_id: '',//商品Id
    user_id: '',
  },

  /**
   * 不使用优惠卷 
   */
  backPay: function () {
    var coupon_id = 0;//优惠卷id
    var coupon_name = '使用优惠券';//优惠卷名称
    var coupon_price = '0';//优惠卷金额
    var buynow = wx.getStorageSync('buynow');
    wx.navigateTo({
      url: '/pages/steps/pay/pay?coupon_id=' + coupon_id + ' & coupon_name=' + coupon_name + ' & coupon_price=' + coupon_price + '&buynow=' + buynow,
    })
  },

  /**
   * 页面首次加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data,
        })
      },
      fail: function () {
        wx.login({
          success: function (res) {
            ECApiHelper.UserLogin(res.code, function (response) {
              var user = JSON.parse(response.Body);
              var user_ids = user.content.user_id;
              var open_id = user.content.openid; //open_id
              wx.setStorage({
                key: 'user_id',
                data: user_ids,
              })
              wx.setStorage({
                key: 'open_id',
                data: open_id,
              })
              that.setData({
                user_id: user_ids
              })

            })
          }
        })
      }
    })
    that.setData({
      pay_summoney: options.pay_summoney
    })
    that.couponlist();
    var buynow = wx.getStorageSync('buynow');
    var cartlistCash = [];
    if (that.data.buynow) {
      //console.log('立即购买')
      cartlistCash = wx.getStorageSync('cartlist');
      //console.log(cartlistCash)
    } else {
      //console.log('不是立即购买')
      cartlistCash = wx.getStorageSync('cartlistCash');
    }
    that.setData({
      list: cartlistCash
    })
  },

  /**
   * 获取个人优惠卷
   */
  couponlist: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var user_id = that.data.user_id;
    that.LoadCouponUseList();
    //加载订单优惠卷
    var count = that.data.count;//数量
    var amount = that.data.amount.toFixed(2);//金额 
    var goods_id = that.data.goods_id;//商品Id
    //console.log(count, amount, goods_id, user_id)
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        ECApiHelper.FavourableCouponOrderUseListGet(count, amount, goods_id, null, res.data, function (responses) {
          //console.log(responses.Body)
          var coupon = JSON.parse(responses.Body);
          for (var i = 0; i < coupon.length; i++) {
            coupon[i].start_time = coupon[i].start_time.substring(0, 11);
            coupon[i].end_time = coupon[i].end_time.substring(0, 11);
          }
          that.setData({
            reseiveData: coupon
          })
          wx.hideLoading();
        })
      },
    })

  },

  /**
   * 获取订单优惠卷所属信息
   */
  LoadCouponUseList: function () {
    var that = this;
    var count = that.data.count;//数量
    var amount = that.data.amount;//金额
    var goods_id = that.data.goods_id;//商品Id
    var buynow = wx.getStorageSync('buynow');
    var cartlistCash = [];
    if (that.data.buynow) {
      //console.log('立即购买')
      cartlistCash = wx.getStorageSync('cartlist');
      //console.log(cartlistCash)
    } else {
      //console.log('不是立即购买')
      cartlistCash = wx.getStorageSync('cartlistCash');
    }
    that.setData({
      list: cartlistCash
    })
    //console.log(that.data.list)
    for (var i = 0; i < cartlistCash.length; i++) {
      count = parseInt(count) + parseInt(cartlistCash[i].goods_number);
      amount = parseFloat(amount) + parseFloat(cartlistCash[i].goods_amount) * parseInt(cartlistCash[i].goods_number);
      goods_id = goods_id + cartlistCash[i].goods_id + ",";
    }
    goods_id = goods_id.substring(0, goods_id.length - 1);
    that.setData({
      count: count,
      amount: amount,
      goods_id: goods_id,
    })
  },

  /**
   * 选择优惠卷
   */
  toReseive: function (e) {
    var that = this;
    //console.log(e)
    var coupon_id = e.currentTarget.dataset.coupon_id;//优惠卷id
    var coupon_name = e.currentTarget.dataset.coupon_name;//优惠卷名称
    var coupon_index = e.currentTarget.dataset.index;//下标
    var coupon_price = e.currentTarget.dataset.price;//优惠卷金额
    var pay_summoney = that.data.pay_summoney;//商品购买总金额
    //console.log([pay_summoney])
    var reseiveData = that.data.reseiveData;//优惠卷列表
    //判断商品总金额是否能够使用优惠卷
    var time = util.formatTime(new Date());
    if (parseFloat(pay_summoney) < parseFloat(reseiveData[coupon_index].min_amount)) {
      wx.showToast({
        title: '金额不足使用！',
      })
      //判断优惠卷是否在使用时间内
    } else if (reseiveData[coupon_index].start_time > time) {
      wx.showModal({
        title: '提示',
        content: '未到优惠券使用时间!',
      })
      //不等于0表示有使用范围
    } else if (reseiveData[coupon_index].act_range != 0) {
      var list = that.data.list;//购物车列表
      var is_error = true;
      for (var i = 0; i < list.length; i++) {
        if (list[i].is_select == 1) {
          var goods_id = list[i].goods_id;
          ECApiHelper.GoodsListGet(null, null, goods_id, null, null, null, null, null, null, null, null,null, function (response) {
            //console.log(response.Body)
            var goods = JSON.parse(response.Body);
            var act_range_ext = reseiveData[coupon_index].act_range_ext.split(",");//优惠卷使用范围
            //拆分优惠卷使用范围字段
            for (var i = 0; i < act_range_ext.length; i++) {
              //分类
              if (act_range_ext[i] == goods[0].cat_id) {
                is_error = false;
                //品牌
              } else if (act_range_ext[i] == goods[0].brand_id) {
                is_error = false;
                //商品
              } else if (act_range_ext[i] == goods[0].goods_id) {
                //console.log(act_range_ext[i], goods[0].goods_id)
                is_error = false;
                //console.log(is_error)
              }
            }
            if (is_error) {
              wx.showModal({
                title: '提示',
                content: '优惠券不在使用范围内,抱歉!',
              })
            } else {
              var buynow = wx.getStorageSync('buynow');
              wx.navigateTo({
                url: '/pages/steps/pay/pay?coupon_id=' + coupon_id + '&coupon_name=' + coupon_name + '&coupon_price=' + coupon_price + '&buynow=' + buynow,
              })
            }
          })
        }
      }
    } else {
      var buynow = wx.getStorageSync('buynow');
      wx.navigateTo({
        url: '/pages/steps/pay/pay?coupon_id=' + coupon_id + '&coupon_name=' + coupon_name + '&coupon_price=' + coupon_price + '&buynow=' + buynow,
      })
    }
  },

  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;

  }
})