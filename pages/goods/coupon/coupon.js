// pages/coupon/coupon.js
var ECApiHelper = require('../../../utils/ECApiHelper');
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  /*页面的初始数据*/
  data: {
    userInfo: {}, //用户信息
    user_id: '',//用户id
    reseiveData: [],//所有优惠卷
    myreseiveData: [],//个人优惠卷
    couponIs: true,//优惠卷使用状态
    userLoad: true,//用户登录状态
    user_id: '',
  },

  /** 
   * 页面首次加载
   */
  onLoad: function () {
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
    this.useridload();
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      //在没有 open-tyoe=getUserInfo版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    if (that.data.user_id == null || that.data.user_id == '') {
      that.setData({
        userLoad: false
      })
    } else {
      that.setData({
        userLoad: true
      })
    }
  },

  /**
   * 获取用户id和个人优惠卷
   */
  useridload: function () {
    var that = this;
    var user_id = that.data.user_id;
    //加载个人优惠卷
    ECApiHelper.FavourableCouponListGet(user_id, null, 0, null, function (responses) {
      //console.log(responses.Body)
      var list2 = JSON.parse(responses.Body);
      //领取状态
      that.setData({
        myreseiveData: list2
      })
      wx.hideLoading();
    })
  },

  /**
   * 领取优惠卷
   */
  SetFavourableCoupon: function (coupon_id) {
    var that = this;
    var user_id = that.data.user_id;
    //领取优惠卷
    ECApiHelper.FavourableCouponSet(user_id, coupon_id, function (responses) {
      //console.log(responses.Body);
      var list = JSON.parse(responses.Body);
      wx.hideLoading();
      if (list.content == null || list.content == '') {
        wx.showModal({
          title: '提示',
          content: list.msg,
        })
      } else {
        wx.showToast({
          title: '领取成功!',
        })
        //加载个人优惠卷
        ECApiHelper.FavourableCouponListGet(user_id, null, 0, null, function (responses) {
          //console.log(responses.Body)
          var list2 = JSON.parse(responses.Body);
          //领取状态
          that.setData({
            myreseiveData: list2
          })
        })
      }
    })

  },
  /**
   * 领取优惠卷
   */
  couponLoad: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    //判断是否已经登录
    var that = this;
    //未登录
    if (that.data.userInfo.nickName == null) {
      //提示请求登录
      wx.showToast({
        title: '请登录!',
      })
    } else {
      //console.log(e)
      this.SetFavourableCoupon(e.currentTarget.dataset.couponid);
    }
  },

  /**
   * 显示所有优惠卷列表
   */
  AllFavourableCouponListGet: function () {
    var that = this;
    //优惠卷列表
    ECApiHelper.FavourableCouponListGet(null, null, 0, null, function (response) {
      //console.log(response.Body);
      //console.log('所有优惠卷列表')
      var Couponlist = JSON.parse(response.Body);
      var datatime = util.formatTime(new Date());
      for (var i = 0; i < Couponlist.length; i++) {
        Couponlist[i].start_time = Couponlist[i].start_time.substring(0, 11);
        Couponlist[i].end_time = Couponlist[i].end_time.substring(0, 11);
        if (Couponlist[i].end_time < datatime) {
          console.log(Couponlist[i].end_time)
          console.log(datatime)
          Couponlist.splice(i, 1);
          console.log(Couponlist);
        }
      }
      that.setData({
        reseiveData: Couponlist
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
          content: '获取数据出错，' + response.Errmsg,
          showCancel: false,
          success: function (res) {
          }
        })
        return;
      }
    })
  },

  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    this.AllFavourableCouponListGet();
  }
})