// pages/validate/validate.js
var app = getApp();
Page({
  data: {
    barcodeid: '',//商品条形码
    
  },
  //获取用户输入的条形码
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
        title: '请输入条形码',
      })
    } else {
      wx.navigateTo({
        url: 'valResult/valResult?barcodeid=' + this.data.barcodeid,
      })
    }

  },
})