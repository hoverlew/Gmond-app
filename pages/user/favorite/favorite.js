// pages/user/favorite/favorite.js
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favoriteData: [],//收藏列表
    listData: [],//商品列表
    user_id: '',//用户Id
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
    var that = this;
    wx.showLoading({
      title: '获取中...',
    })
    that.GetCollectGoodsList();
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
   * 获取收藏列表
   */
  GetCollectGoodsList: function () {
    var that = this;
    var is_attention = 0;//1关注 0收藏
    var user_id = that.data.user_id;
    if (user_id == null || user_id == "") {
      wx.login({
        success: function (res) {
          ECApiHelper.UserLogin(res.code, function (response) {
            var user = JSON.parse(response.Body);
            var user_id = user.content.user_id;
            var open_id = user.content.openid; //open_id
            //获取收藏列表
            ECApiHelper.CollectGoodsListGet(user_id, null, 0, function (respon) {
              console.log(respon)
              var list = JSON.parse(respon.Body);
              console.log(list);
              that.setData({
                favoriteData: list
              })
              wx.hideLoading();
            })
          })
        }
      })
    } else {
      //获取收藏列表
      ECApiHelper.CollectGoodsListGet(user_id, null, 0, function (respon) {
        console.log(respon)
        var list = JSON.parse(respon.Body);
        console.log(list);
        that.setData({
          favoriteData: list
        })
        wx.hideLoading();
      })
    }
  },

  /**
   * 跳转商品
   */
  goodsLoad: function (e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },

  /**
   * 删除收藏
   */
  goodsDelete: function (e) {
    var that = this;
    var user_id = that.data.user_id;
    var goods_id = e.currentTarget.dataset.goods_id;
    var rec_id = e.currentTarget.dataset.rec_id;
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: function (res) {
        if (res.confirm) {
          //删除收藏
          console.log(user_id)
          ECApiHelper.CollectGoodsInfoSet(user_id, rec_id, goods_id, 0, 'delete', function (response) {
            console.log(response.Body);
            var list = JSON.parse(response.Body);
            if (list.error == 0) {

              wx.showToast({
                title: list.msg,
              })
              that.GetCollectGoodsList();
            } else {
              wx.showModal({
                title: '提示',
                content: list.msg,
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  }
})