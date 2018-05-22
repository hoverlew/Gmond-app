// pages/goods/filter/filter.js
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minprice: '',//最低价
    maxprice: '',//最高价
    goods_name: '',
    goods_type: '',
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      goods_name: options.goods_name,
      goods_type: options.goods_type,
      id: options.id
    })
  },

  /**
   * 获取最低价
   */
  Loadminprice: function (e) {
    var that = this;
    that.setData({
      minprice: e.detail.value
    })
  },

  /**
   * 获取最高价 
   */
  Loadmaxprice: function (e) {
    var that = this;
    that.setData({
      maxprice: e.detail.value
    })
  },

  //重置
  Reset: function () {
    var that = this;
    that.setData({
      minprice: '',
      maxprice: ''
    })
  },

  //筛选商品价格
  Determine: function () {
    //判断输入是否正确
    var that = this;
    var minprice = that.data.minprice;
    var maxprice = that.data.maxprice;
    var goods_name = that.data.goods_name;
    var goods_type = that.data.goods_type;
    var id = that.data.id;
    var is_screen = true;
    if (minprice > maxprice) {
      wx.showToast({
        title: '输入不正确！',
      })
    } else if (minprice == '' || minprice == null || maxprice == '' || maxprice == null) {
      wx.showToast({
        title: '请输入价格！',
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/list/list?minprice=' + minprice + '&maxprice=' + maxprice + '&goods_name=' + goods_name + "&goods_type=" + goods_type + '&id=' + id + '&is_screen=' + is_screen,
      })
    }
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