// pages/vip/vip.js
var app = getApp();
Page({
  data: {
    barcodeid: ''
  },
  //获取用户输入的手机号码
  barcodeInput: function (e) {
    this.setData({
      barcodeid: e.detail.value
    })
  },
  /* button点击事件监听*/
  toSearch: function () {
    var that = this;
    if (that.data.barcodeid == null || that.data.barcodeid == '') {
      wx.showToast({
        title: '请输入手机号码',
      })
    } else {
      wx.navigateTo({
        url: 'vipResult/vipResult?barcodeid=' + this.data.barcodeid,
      })
    }
  },
})