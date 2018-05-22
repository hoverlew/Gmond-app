// pages/pay/pay.js
var ECApiHelper = require('../../../utils/ECApiHelper');
var md5 = require('../../../libs/js-md5/md5');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',//订单Id
    orderlist: [],//订单数据
    userName: '', //收货人姓名
    userPhone: '',//收货人联系电话
    userAddress: '',//收货人地址
    address: '', //地址
    order_sn: '',//订单号
    order_amount: '',//金额
    address: '',//地址
    Remarks: '',//订单留言
    Number: '',//快递单号
    user_id: '',
    open_id: '',
  },

  /**
   * 立即支付
   */
  OnPay: function () {
    this.wxpay();
  },

  /**
   * 生成随机数
   */
  getNonceStr: function () {
    var random1 = Math.random().toString(32).substr(2, 10);
    var random2 = Math.random().toString(32).substr(2, 10);
    var random3 = Math.random().toString(32).substr(2, 10);
    var random4 = Math.random().toString(32).substr(2, 2);
    return random1 + random2 + random3 + random4;
  },

  // 时间戳产生函数  
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  },

  /**
   * 调起微信支付
   */
  wxpay: function () {
    var that = this;
    var user_id = that.data.user_id;
    var open_id = that.data.open_id;
    var device_info = 'WEB';//设备号 自定义参数，可以为终端设备号(门店号或收银设备ID)，PC网页或公众号内支付可以传"WEB"
    var nonce_str = that.getNonceStr();//随机字符串
    var sign_type = 'MD5';//签名类型
    var body = '吉盟珠宝';//商品描述
    var detail = null;//商品详情
    var attch = '小程序订单';//附加数据
    var outtrade_no = that.data.order_sn;//商户订单号
    var fee_type = 'CNY';//标价币种
    var total_fee = that.data.order_amount * 100;//标价金额
    var spbillcreate_ip = '';//终端iP
    var timestart = that.createTimeStamp();//交易起始时间
    var timeexpice = null;//交易结束时间
    var goodstag = null;//订单优惠标记
    var notifyurl = that.data.address;//通知地址
    var trade_type = 'JSAPI';//交易类型
    var limit_pay = null;//指定支付方式
    var product_id = null;//商品Id
    //统一下单
    ECApiHelper.UnifiedOrderPay(open_id, device_info, nonce_str, sign_type, body, detail, attch, outtrade_no, fee_type, total_fee, spbillcreate_ip, timestart, timeexpice, goodstag, notifyurl, trade_type, limit_pay, product_id, function (responses) {
      //console.log(responses.Body);
      var list = JSON.parse(responses.Body);
      var prepay_id = list.prepay_id;
      var nonce_str = list.nonce_str;
      var return_msg = list.return_msg;
      var timeStamp = that.createTimeStamp();
      var paySign = md5.hexMD5("appId=wxdcd7d9f1fac8787b&nonceStr=" + nonce_str + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + timeStamp + "&key=citynm1234567890citynm1234567890").toUpperCase();
      if (return_msg == 'OK') {
        //微信支付API
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonce_str,
          package: 'prepay_id=' + prepay_id,
          signType: 'MD5',
          paySign: paySign,
          success: function (res) {
            //console.log(res)
            wx.showToast({
              title: '支付成功',
            })
            //修改订单状态
            ECApiHelper.OrderPaySuccess(that.data.order_id, that.data.order_sn, function (res) {
              //console.log(res.Body);
            });
            // setTimeout(function () {
            wx.clearStorageSync();
            wx.redirectTo({
              url: '/pages/user/orderlist/orderlist',
            })
            // }, 1500)
          },
          fail: function (res) {
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({
                title: '取消支付!',
              })
              //  setTimeout(function () {
              wx.clearStorageSync();
              wx.redirectTo({
                url: '/pages/user/orderlist/orderlist',
              })
              // }, 1500)
            } else {
              wx.showModal({
                title: '错误',
                content: res.err_desc,
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '统一下单失败',
        })
      }
    })
  },

  //点击图片跳转
  imgload: function (e) {
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },

  //点击名称跳转
  nameload: function (e) {
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
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
    wx.getStorage({
      key: 'open_id',
      success: function (res) {
        that.setData({
          open_id: res.data
        })
      },
    })
    //获取订单Id
    that.setData({
      order_id: options.order_id,
    })
    this.GetOrderList();
  },

  /**
   * 加载订单详情 
   */
  GetOrderList: function () {
    var that = this;
    var order_id = that.data.order_id;
    //console.log(order_id)
    ECApiHelper.OrderListGet(null, null, order_id, null, null, null, null, function (response) {
      //console.log(response.Body)
      var list = JSON.parse(response.Body);
      if (list[0].order_status == 5) {
        var list_Number = list[0].invoice_no.split("<br>");
        var Number = list_Number[0];
        that.setData({
          Number: Number
        })
      }
      that.setData({
        orderlist: list,
        order_sn: list[0].order_sn,
        order_amount: list[0].order_amount,
        address: list[0].address,
        Remarks: list[0].postscript,
      })
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