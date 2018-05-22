//获取应用实例
var ECApiHelper = require('../../../utils/ECApiHelper');
var util = require('../../../utils/util.js');
var app = getApp()
Page({
  /* 页面的初始数据 */
  data: {
    bojinPrice: '',//铂金
    huangjinPrice: '',//黄金
    kjinPrice: '',//K金
    zuanshiPrice: '',//钻石
    datetime: '',//时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    var time = util.formatTime(new Date());
    this.setData({
      datetime: time
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //铂金金价
  bojin: function () {
    var that = this;
    ECApiHelper.GoldPriceListGet(13, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      that.setData({
        bojinPrice: list.content
      });
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
  //黄金金价
  huangjin: function () {
    var that = this;
    ECApiHelper.GoldPriceListGet(11, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      that.setData({
        huangjinPrice: list.content
      });
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
  //K金金价
  kjin: function () {
    var that = this;
    ECApiHelper.GoldPriceListGet(12, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      that.setData({
        kjinPrice: list.content
      });
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
  //钻石金价
  zuanshi: function () {
    var that = this;
    ECApiHelper.GoldPriceListGet(9, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      that.setData({
        zuanshiPrice: list.content
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.huangjin();
    this.kjin();
    this.bojin();
    this.zuanshi();
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

  }
})