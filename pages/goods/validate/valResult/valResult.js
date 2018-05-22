// pages/goods/validate/valResult/valResult.js

var ECApiHelper = require('../../../../utils/ECApiHelper');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    barcodeid: '',//商品条形码
    goodsData: [],
    res: false
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.JustqueryInfoGet();
    var that = this;
    that.setData({
      barcodeid: options.barcodeid,
    })
    wx.showLoading({
      title: '加载中',
    })

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
    this.JustqueryInfoGet();
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
  /**
   * 查询正品
   */
  JustqueryInfoGet: function () {
    var that = this;
    console.log(that.data.barcodeid)
    ECApiHelper.JustqueryInfoGet(that.data.barcodeid, function (response) {
      var list = JSON.parse(response.Body);
      console.log(list)
      //console.log(list.content)
      if (list.content != null && list.content != "") {
        //正品
        that.setData({
          goodsData: list,
          res: true
        })
        wx.hideLoading();
        //console.log(that.data.goodsData.content.CHARG)
      } else {
        that.setData({
          res: false
        })
        wx.hideLoading();
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
  }
})