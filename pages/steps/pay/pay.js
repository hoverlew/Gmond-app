// pages/pay/pay.js
var ECApiHelper = require('../../../utils/ECApiHelper');
var md5 = require('../../../libs/js-md5/md5');
var app = getApp()
Page({

  /**
   * 页面的初始数据  
   */
  data: {
    cartlist: [],//购物车列表
    userName: '', //收货人姓名
    userPhone: '',//收货人手机号码 
    detailInfo: '',//收货门牌地址
    userAddress: '',//小程序显示详细地址
    province: '',//省
    city: '',//市 
    district: '',//地区
    zip_code: '',//邮政编码
    is_address: true,//服务器收货地址状态
    address_id: '',//收货地址Id
    coupon_name: '使用优惠券',//优惠卷
    coupon_id: null,//优惠卷Id
    coupon_price: '',//优惠卷优惠金额
    Remarks: '',//购买商品备注
    productdata: [],
    pay_summoney: 0,
    address: '',
    remark: '',
    buyway: 0,
    order_id: 0,
    rec_id: '',//购物车列表Id
    code: '',//
    user_id: '',//用户Id
    order_sn: '',//订单号Id
    order_amount: '',//订单总金额
    open_id: '',
    address: '',//统一下单通知地址
    isload: true,//是否重新授权微信我的地址
    buynow: false,//用于确认页是否立即购买
    isload: true,//是否可以点击
    user_id: '',
    open_id: '',
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
        //默认选中收货地址
        ECApiHelper.UserAddressListGet(res.data, null, null, null, null, null, function (res) {
          //console.log(res.Body);
          if (res.Body.length > 0) {
            var address = JSON.parse(res.Body);
            that.setData({
              userName: address[0].consignee, //姓名
              userPhone: address[0].mobile,
              userAddress: address[0].address,
              address_id: address[0].address_id
            })
            wx.setStorageSync('address_id', address[0].address_id)
          }
        })
      },
    });
    wx.getStorage({
      key: 'open_id',
      success: function (res) {
        that.setData({
          open_id: res.data
        })
      },
    });
    wx.setStorageSync('isUse', true);//是否使用过优惠卷

    that.setData({
      coupon_id: options.coupon_id,
      coupon_name: options.coupon_name,
      coupon_price: options.coupon_price,
      buynow: options.buynow
    })
    var cartlistCash = [];
    if (that.data.buynow) {
      //console.log('立即购买')
      cartlistCash = wx.getStorageSync('cartlist');
      wx.setStorageSync('buynow', that.data.buynow);
      console.log(cartlistCash)
    } else {
      //console.log('不是立即购买')
      cartlistCash = wx.getStorageSync('cartlistCash');
    }
    wx.setStorageSync('buynow', that.data.buynow);//
    that.setData({
      cartlist: cartlistCash,
    })
    //console.log(that.data.cartlist)
    that.AllMoney();
    that.GetListRecId();
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
    var total_fee = that.data.order_amount <= 0 ? 10 : that.data.order_amount * 100;//标价金额
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
            that.setData({
              isload: true
            })
            //修改订单状态
            ECApiHelper.OrderPaySuccess(that.data.order_id, that.data.order_sn, function (res) {
              //console.log(res.Body);
            });
            //setTimeout(function () {
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
              // setTimeout(function () {
              wx.redirectTo({
                url: '/pages/user/orderlist/orderlist',
              })
              //  }, 1500)
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
    wx.clearStorageSync('cartlist');
    wx.clearStorageSync('cartlistCash');
    wx.setStorageSync('selectall', 0);
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //缓存选择的收货地址
    var userName = wx.getStorageSync('userName');
    var userPhone = wx.getStorageSync('userPhone');
    var userAddress = wx.getStorageSync('userAddress');
    if (userName != null && userName != "") {
      that.setData({
        userName: userName,
        userPhone: userPhone,
        userAddress: userAddress,
      })
    } else {
      wx.getStorage({
        key: 'user_id',
        success: function (res) {
          //默认选中收货地址
          ECApiHelper.UserAddressListGet(res.data, null, null, null, null, null, function (res) {
            //console.log(res.Body);
            if (res.Body.length > 0) {
              var address = JSON.parse(res.Body);
              that.setData({
                userName: address[0].consignee, //姓名
                userPhone: address[0].mobile,
                userAddress: address[0].address,
                address_id: address[0].address_id
              })
              wx.setStorageSync('address_id', address[0].address_id)
            }
          })
        },
      })
    }
    var coupon_price = that.data.coupon_price;
    //判断是否有使用优惠卷
    var isUse = wx.getStorageSync('isUse');
    if (isUse) {
      //不使用优惠卷
      if (coupon_price == '' || coupon_price == null || coupon_price == 0) {
        var pay_summoney = that.data.pay_summoney;
        that.setData({
          pay_summoney: pay_summoney
        })
        wx.setStorageSync('isUse', true)
      } else {
        var pay_summoney = parseFloat(that.data.pay_summoney) - parseFloat(coupon_price);
        if (pay_summoney < 0) {
          that.setData({
            pay_summoney: 0
          })
        } else {
          that.setData({
            pay_summoney: pay_summoney.toFixed(2)
          })
        }
        wx.setStorageSync('isUse', false)
      }
    }
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
   * 获取订单列表Id
   */
  GetListRecId: function () {
    var that = this;
    var list = that.data.cartlist;
    var rec_id = that.data.rec_id;
    //console.log(list)
    if (that.data.buynow) {
      rec_id = list.rec_id;
      that.setData({
        rec_id: rec_id
      })
    } else {
      for (var i = 0; i < list.length; i++) {
        if (list[i].is_select == true) {
          rec_id = rec_id + list[i].rec_id + ",";
        }
      }
      rec_id = rec_id.substring(0, rec_id.length - 1);
      that.setData({
        rec_id: rec_id
      })
    }

  },

  /**
   * 添加订单
   */
  OrderInfoAdd: function () {
    var that = this;
    var user_id = that.data.user_id;
    var rec_id = that.data.rec_id;//购物车Id
    var order_status = 1;//订单状态
    var address_id = wx.getStorageSync('address_id');//收货地址Id
    var couponuse_id = that.data.coupon_id;//优惠卷Id
    var flow_type = null;//商品类型
    var payment = 12;//付款方式 -微信支付
    var post_script = that.data.Remarks;//订单留言
    var shipping = 10;//配送方式
    //添加订单
    ECApiHelper.OrderInfoAdd(user_id, rec_id, order_status, address_id, couponuse_id, flow_type, payment, post_script, shipping, function (responses) {
      //console.log(responses.Body);
      var list = JSON.parse(responses.Body);
      //console.log('订单总金额' + list.content.order_amount)
      that.setData({
        order_id: list.content.order_id,//订单Id
        order_sn: list.content.order_sn,//订单号
        order_amount: list.content.order_amount,//订单总金额
        address: list.content.address,
      })
      wx.hideLoading();
      if (list.error != 0) {
        if (list.error == 3) {
          wx.showModal({
            title: '提示',
            content: '请重新选择地址!',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: list.msg,
          })
        }
      } else if (list.error == 0) {
        if (list.content.order_amount <= 0) {
          //修改订单状态
          ECApiHelper.OrderPaySuccess(that.data.order_id, that.data.order_sn, function (res) {
            //console.log(res.Body);
            wx.showToast({
              title: '购买成功!',
            })
            that.setData({
              isload: true
            })
            wx.clearStorageSync();
            ///setTimeout(function () {
            wx.navigateTo({
              url: '/pages/user/orderlist/orderlist',
            })
            //}, 1000)
          });
        } else {
          //添加订单成功 调用微信支付
          that.wxpay();
        }
      }
    })
  },

  /**
   * 图片跳转
   */
  imgload: function (e) {
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },

  /**
   * 名称跳转
   */
  nameload: function (e) {
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },
  /**
   * 使用优惠卷
   */
  OnFav: function () {
    var that = this;
    var pay_summoney = that.data.pay_summoney;
    wx.navigateTo({
      url: '../couponlist/couponlist?pay_summoney=' + pay_summoney,
    })
  },

  /**
   * 计算商品总金额
  */
  AllMoney: function () {
    var that = this;
    var cartlist = that.data.cartlist;
    var pay_summoney = 0;//总金额
    if (that.data.buynow) {
      pay_summoney = parseFloat(cartlist.goods_price) * parseFloat(cartlist.goods_number);
    } else {
      //console.log('加入购物车')
      for (var i = 0; i < cartlist.length; i++) {
        if (cartlist[i].is_select == 1) {
          var goods_price = parseFloat(cartlist[i].goods_price) * parseFloat(cartlist[i].goods_number);
          pay_summoney += goods_price;
        }
      }
    }
    that.setData({
      pay_summoney: pay_summoney.toFixed(2),
    })
  },

  /**
   * 设置收货地址
   */
  OnAddress: function () {
    var that = this;
    var isload = that.data.isload;
    if (isload == true) {
      wx.chooseAddress({
        success: function (res) {
          res.telNumber
          // console.log('调用成功~')
          // console.log(res)
          var list = res;
          that.setData({
            userName: list.userName, //姓名
            userPhone: list.telNumber,//手机号码
            detailInfo: list.detailInfo,//详细地址
            province: list.provinceName,//省
            city: list.cityName,//市 
            district: list.countyName,//地区
            zip_code: list.postalCode,//邮政编码
            userAddress: list.provinceName + list.cityName + list.countyName + list.detailInfo,//小程序显示的详细地址
          })
          wx.setStorageSync('userName', list.userName); //姓名
          wx.setStorageSync('userPhone', list.telNumber);//电话
          wx.setStorageSync('userAddress', that.data.userAddress);//详细地址
          that.UserAddressListGet();
        },
        fail: function (res) {
          //console.log('调用失败~')
          that.setData({
            isload: false,//
          })
        }
      })
    } else {
      wx.openSetting({
        success: function () {
          //console.log('重新设置权限')
          that.setData({
            isload: true,
          })
        }
      })
    }
    wx.chooseAddress({
      success: function (res) {
        res.telNumber
        //console.log('调用成功~')
        //console.log(res)
        var list = res;
        that.setData({
          userName: list.userName, //姓名
          userPhone: list.telNumber,//手机号码
          detailInfo: list.detailInfo,//详细地址
          province: list.provinceName,//省
          city: list.cityName,//市 
          district: list.countyName,//地区
          zip_code: list.postalCode,//邮政编码
          userAddress: list.provinceName + list.cityName + list.countyName + list.detailInfo,//小程序显示的详细地址
        })
        wx.setStorageSync('userName', list.userName); //姓名
        wx.setStorageSync('userPhone', list.telNumber);//电话
        wx.setStorageSync('userAddress', that.data.userAddress);//详细地址
        that.UserAddressListGet();
      }
    })
  },

  /**
   * 添加服务器收货地址
   */
  InsertAddress: function () {
    var that = this;
    var userName = that.data.userName;//联系人姓名
    var userPhone = that.data.userPhone;//手机号码
    var detailInfo = that.data.province + that.data.city + that.data.district + that.data.detailInfo;//详细地址
    var zip_code = that.data.zip_code;//邮政编码
    var province = that.data.province;//省
    var city = that.data.city;//市
    var district = that.data.district;//地区
    var user_id = that.data.user_id;
    //添加地址
    ECApiHelper.UserAddressInfoSet(null, user_id, userName, detailInfo, zip_code, userPhone, 1, province, city, district, 'insert', function (responses) {
      var list = JSON.parse(responses.Body);
      //console.log(list)
      that.setData({
        address_id: list.content,
      })
      wx.setStorageSync('address_id', list.content);
    })
  },

  /**
   * 获取服务器收货地址
   */
  UserAddressListGet: function () {
    var that = this;
    var user_id = that.data.user_id;
    ECApiHelper.UserAddressListGet(user_id, null, null, null, null, null, function (res) {
      //console.log(res.Body);
      var address = JSON.parse(res.Body);
      //判断服务器是否有相同的收货地址 有则返回收货地址Id 没有则添加收货地址并返回Id
      if (address.length == 1) {
        wx.setStorageSync('address_id', address[0].address_id);
        that.UpdateAddress();
      } else {
        that.InsertAddress();
      }
    })
  },

  //收货地址初始化
  UserLoadAddressGet: function () {
    var that = this;
    var user_id = that.data.user_id;
    ECApiHelper.UserAddressListGet(user_id, null, null, null, null, null, function (res) {
      var address = JSON.parse(res.Body);
      var userName = address[0].consignee;//联系人姓名
      var userPhone = address[0].mobile;//手机号码
      var detailInfo = address[0].address;//详细地址
      //获取省市地区
      var province = that.data.province;//省
      var city = that.data.city;//市
      var district = that.data.district;//地区
      //判断是否w为空
      if (address.length == 1) {
        wx.setStorageSync('address_id', address[0].address_id);
        that.setData({
        })
      }
    })
  },

  /**
   * 修改服务器收货地址
   */
  UpdateAddress: function () {
    var that = this;
    var user_id = that.data.user_id;
    var userName = that.data.userName;//联系人姓名
    var userPhone = that.data.userPhone;//手机号码
    var detailInfo = that.data.province + that.data.city + that.data.district + that.data.detailInfo;//详细地址
    var zip_code = that.data.zip_code;//邮政编码
    var province = that.data.province;//省
    var city = that.data.city;//市
    var district = that.data.district;//地区
    var address_id = wx.getStorageSync('address_id');//收货地址Id
    //修改地址
    ECApiHelper.UserAddressInfoSet(address_id, user_id, userName, detailInfo, zip_code, userPhone, 1, province, city, district, 'update', function (responses) {
      var list = JSON.parse(responses.Body);
      //console.log(list)
    })
  },

  /**
   * 购买留言
   */
  OnRemark: function (e) {
    var that = this;
    var Remarks = e.detail.value;
    if (Remarks.length > 50) {
      wx.showModal({
        title: '提示',
        content: '您输入的留言过长！',
      })
    }
    that.setData({
      Remarks: Remarks
    })
    //console.log(that.data.Remarks)

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 立即支付
   */
  OnPay: function () {
    var that = this;
    if (that.data.isload) {
      that.setData({
        isload: false
      })
      //判断收货地址是否为空
      if (that.data.userName == null || that.data.userName == '') {
        wx.showToast({
          title: '请选择收货地址',
        })
        that.setData({
          isload: true
        })
      } else {
        wx.showLoading({
          title: '调起微信支付...',
        })
        that.OrderInfoAdd();
      }
    }
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