//获取应用实例
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['--请选择--', '仅退款(未发货)', '仅退款(已发货)', '退货退款(已发货)'],
    objectArray: [
      {
        id: 0,
        name: '--请选择--'
      },
      {
        id: 1,
        name: '仅退款(未发货)'
      },
      {
        id: 2,
        name: '仅退款(已发货)'
      },
      {
        id: 3,
        name: '退货退款(已发货)'
      }
    ],
    arrayindex: 0,//选中的下标
    refund_type: 1,//退款类型
    order_id: '',//退款的订单id
    totalfee: 0,//退款订单金额
    refund_number: 0,//退款订单商品数量
    refund_explain: '',
    refund_express: '',
    refund_invoiceno: '',
    refund_amount: 0,
    user_id: '',
  },

  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      arrayindex: e.detail.value,
      refund_type: e.detail.value,
    })
  },

  //退款原因
  refundexplain: function (e) {
    var that = this;
    that.setData({
      refund_explain: e.detail.value
    })
  },

  //退款快递公司
  refundexpress: function (e) {
    var that = this;
    that.setData({
      refund_express: e.detail.value
    })
  },

  //退款快递单号
  refundinvoiceno: function (e) {
    var that = this;
    that.setData({
      refund_invoiceno: e.detail.value
    })
  },

  //退款金额
  refundamount: function (e) {
    var that = this;
    that.setData({
      refund_amount: e.detail.value
    })
  },

  /**
   * 申请退款
   */
  loadrefund: function () {
    var that = this;
    var refund_explain = that.data.refund_explain;//退款原因
    var refund_express = that.data.refund_express;//退款快递公司
    var refund_invoiceno = that.data.refund_invoiceno;//退款快递单号
    var refund_amount = that.data.refund_amount;//退款金额
    var totalfee = that.data.totalfee;//订单金额
    var refund_type = that.data.refund_type;//退款类型
    if (refund_type == 0) {
      wx.showToast({
        title: '请选择退款类型',
      })
    } else if (refund_amount == null || refund_amount == "") {
      wx.showToast({
        title: '请输入退款金额',
      })
    } else if (refund_amount > totalfee) {
      wx.showModal({
        title: '提示',
        content: '退款金额不能大于实际支付金额！',
      })
    } else {
      that.ReturnGoods();
    }
  },

  /**
   * 退款处理
   */
  ReturnGoods: function () {
    var that = this;
    var order_id = that.data.order_id;//订单Id
    var refund_amount = that.data.refund_amount;//退款金额
    var refund_number = that.data.refund_number;//退款商品数量
    var refund_explain = that.data.refund_explain;//退款原因
    var refund_express = that.data.refund_express;//退款快递公司
    var refund_invoiceno = that.data.refund_invoiceno;//退款快递单号
    var totalfee = that.data.totalfee;//订单金额
    var refund_type = that.data.refund_type;//退款类型
    var user_id = that.data.user_id;
    wx.showModal({
      title: '提示',
      content: '确定要申请退货吗？',
      success: function (res) {
        if (res.confirm) {
          var refund_reason = '七天无理由退换货';
          //申请退货
          ECApiHelper.OrderInfoRefundApply(user_id, order_id, null, refund_amount, refund_number, refund_explain, refund_express, refund_invoiceno, refund_type, refund_reason, totalfee, function (responses) {
            //console.log(responses.Body)
            var list = JSON.parse(responses.Body)
            if (list.error == 0) {
              wx.hideLoading();
              wx.showToast({
                title: '申请退货成功!',
              })
              wx.clearStorageSync();
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/user/orderlist/orderlist',
                })
              }, 500)
            } else {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: list.message,
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取order_di
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        })
      },
    })
    var objectArray = that.data.objectArray
    var array = []
    for (var i = 0; i < objectArray.length; i++) {
      array.push(objectArray[i].name, )
    }
    that.setData({
      array: array,
      refund_type: objectArray[that.data.arrayindex].id,
    })
    that.setData({
      order_id: options.order_id,
      totalfee: options.totalfee,
      refund_number: options.refund_number,
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
})