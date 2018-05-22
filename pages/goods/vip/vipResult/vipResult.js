// pages/goods/vip/vipResult/vipResult.js
var ECApiHelper = require('../../../../utils/ECApiHelper');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barcodeid: '',//会员手机号码
    request: false,//查询状态 true查到 false未查到
    vipnaem: '',//姓名
    vipintegral: '',//积分余额
    viplevel: '',//会员级别
    isLoad: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      barcodeid: options.barcodeid
    })
    wx.showLoading({
      title: '加载中',
    })
  },

  /**
   * 查询会员积分
   */
  IntegralqueryInfoGet: function () {
    var that = this;
    var phone = that.data.barcodeid;
    ECApiHelper.IntegralqueryInfoGet(phone, function (response) {
      console.log(response.Body);
      var list = JSON.parse(response.Body);
      if (list.content.info != null) {
        that.setData({
          request: true,
          isLoad: true,
          vipname: list.content.info.NAME1,//姓名
          vipintegral: list.content.info.KBETR,//积分余额
          viplevel: list.content.info.vtext,//会员级别
        })
        wx.hideLoading();
      } else {
        that.setData({
          request: false,
          isLoad: true,
        })
        wx.hideLoading();
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.IntegralqueryInfoGet();
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