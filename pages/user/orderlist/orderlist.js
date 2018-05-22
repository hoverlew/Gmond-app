// 全部订单页

//获取应用实例
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({
  /*** 页面的初始数据 */
  data: {
    //选项卡 
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    // 商品内容数据 
    carts: [],
    order_sn: '',//订单编号
    count_price: '',//订单总金额
    cartsshow: true,//全部
    Pending: false,//待付款
    Deliver: false,//待发货
    Already: false,//已发货
    Complete: false,//已完成
    sorryImgSrc: '/images/dd.png',
    sorryTxt: '-暂时没有相关订单-',
    user_id: '',
  },

  /**
   * 确认收货
   */
  GoodsReceipt: function (e) {
    var that = this;
    var user_id = that.data.user_id;
    var order_id = e.currentTarget.dataset.order_id;
    wx.showModal({
      title: '提示',
      content: '请确认是否收到货品？',
      success: function (res) {
        if (res.confirm) {
          //订单签收
          ECApiHelper.OrderInfoSign(order_id, user_id, null, function (response) {
            //console.log(response.Body);
            var list = JSON.parse(response.Body);
            wx.showModal({
              title: '提示',
              content: list.msg,
            })
            wx.clearStorageSync();
            that.AllOrderListGet();
          })
        } else if (res.cancel) {

        }
      }
    })
    wx.clearStorageSync();
    that.AllOrderListGet();
  },

  /**
   * ReturnGoods：退货处理 
   */
  ReturnGoods: function (e) {
    var that = this;
    var list = that.data.carts;
    var refund_number = 1;//订单退款商品数量
    var totalfee = 0.01;//订单金额
    var order_id = e.currentTarget.dataset.order_id;//订单Id
    for (var i = 0; i < list.length; i++) {
      if (list[i].order_id == order_id) {
        //console.log(list[i])
        totalfee = list[i].goods_amount - list[i].discount < 0 ? 0 : list[i].goods_amount - list[i].discount;//订单金额
        refund_number = list[i].OrderGoodsList.length;//订单退款商品数量
      }
    }
    wx.navigateTo({
      url: '/pages/steps/refund/refund?order_id=' + order_id + '&totalfee=' + totalfee + '&refund_number=' + refund_number,
    })
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    var that = this;
    var user_id = '';
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        })
        user_id = res.data;
      },
    })
    var order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...',
          })
          //执行取消订单操作
          //取消订单
          ECApiHelper.OrderInfoCancel(user_id, order_id, function (responses) {
            var list = JSON.parse(responses.Body);
            wx.hideLoading();
            if (list.error == 0) {
              //取消成功
              wx.showToast({
                title: list.msg,
              })
              wx.clearStorageSync();
              that.AllOrderListGet();
            } else {
              wx.showModal({
                title: '提示',
                content: list.msg,
              })
            }
          })
        }
      }
    })
    that.AllOrderListGet();
  },

  /**
   * 付款
   */
  loadpay: function (e) {
    //跳转到详情页
    var that = this;
    var order_id = e.currentTarget.dataset.id;
    var carts = that.data.carts;
    wx.navigateTo({
      url: '../orderdetail/orderdetail?order_id=' + order_id + '&carts=' + carts,
    })
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
   * 图片跳转
   */
  imgLoad: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },
  /**
   * 名称跳转
   */
  nameload: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },

  /*
   * 复制订单中的商品到购物车
   */
  copyTBL: function (e) {
    var that = this;
    var user_id = that.data.user_id;
    var list = that.data.carts;//订单列表
    var index = e.currentTarget.dataset.index;
    //console.log(index);
    var goods = list[index].OrderGoodsList;
    var msg = "";
    for (var i = 0; i < goods.length; i++) {
      var goods_id = goods[i].goods_id;
      var goods_number = goods[i].goods_number;
      var goods_attr_id = goods[i].goods_attr_id;
      ECApiHelper.CartInfoAdd(user_id, null, goods_id, goods_number, goods_attr_id, function (response) {
        // console.log(response.Body);
        var list = JSON.parse(response.Body);
        if (list.error != 0) {
          msg = list.msg;
        }
      })
    }
    //console.log(msg);
    if (msg == "") {
      wx.showModal({
        title: '提示',
        content: '复制成功，是否立即结算？',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/steps/cart/cart',
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: msg,
      })
    }
  },

  /** 
   * 滑动切换tab 
   * */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** * 点击tab切换  */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  toOrderDetail: function (e) {
    var that = this;
    //获取订单号
    var order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../orderdetail/orderdetail?order_id=' + order_id,
    })
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;

    /** * 获取系统信息  */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    wx.showLoading({
      title: '获取中...',
    })
    var cartsshow = wx.getStorageSync('cartsshow');
    var carts = wx.getStorageSync('carts');
    var Pending = wx.getStorageSync('Pending');
    var Deliver = wx.getStorageSync('Deliver');
    var Already = wx.getStorageSync('Already');
    var Complete = wx.getStorageSync('Complete');
    if (cartsshow != null && carts.length > 0 && Pending != null && Deliver != null && Already != null && Complete != null) {
      that.setData({
        cartsshow: cartsshow,
        carts: carts,
        Pending: Pending,
        Deliver: Deliver,
        Already: Already,
        Complete: Complete
      })
      wx.hideLoading();
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      that.AllOrderListGet();
    }
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    wx.showLoading({
      title: '获取中...',
    })
    var cartsshow = wx.getStorageSync('cartsshow');
    var carts = wx.getStorageSync('carts');
    var Pending = wx.getStorageSync('Pending');
    var Deliver = wx.getStorageSync('Deliver');
    var Already = wx.getStorageSync('Already');
    var Complete = wx.getStorageSync('Complete');
    if (cartsshow != null && carts.length > 0 && Pending != null && Deliver != null && Already != null && Complete != null) {
      console.log('有缓存')
      that.setData({
        cartsshow: cartsshow,
        carts: carts,
        Pending: Pending,
        Deliver: Deliver,
        Already: Already,
        Complete: Complete
      })
      wx.hideLoading();
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      console.log('无缓存，重新获取')
      that.AllOrderListGet();
    }
    if (app.globalData.currentLocation == '') {
      this.setData({
        currentTab: 0
      });
    } else {
      var i = app.globalData.currentLocation;
      this.setData({
        currentTab: i
      });
    }
  },

  /**
   * 获取个人订单
   */
  AllOrderListGet: function () {
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        console.log('获取成功')
        that.setData({
          user_id: res.data
        })
        ECApiHelper.OrderListGet(res.data, null, null, "add_time", "desc", null, null, function (responses) {
          //console.log(responses.Body);
          var list = JSON.parse(responses.Body);
          var cartsshow = that.data.cartsshow;
          if (list == null || list == [] || list == "") {
            cartsshow = false;
          }
          that.setData({
            cartsshow: cartsshow,
            carts: list,
          });
          wx.hideLoading();
          var Pending = that.data.Pending;//待付款
          var Deliver = that.data.Deliver;//待发货
          var Already = that.data.Already;//已发货
          var Complete = that.data.Complete;//已完成
          //初始化
          Pending = false;
          Deliver = false;
          Already = false;
          Complete = false;
          for (var i = 0; i < list.length; i++) {
            //待付款
            if (list[i].pay_status == 0 && list[i].order_status != 2) {
              Pending = true;//有数据
              //待发货
            } else if (list[i].order_status == 1 && list[i].shipping_status == 0 && list[i].pay_status == 2 && list[i].order_status != 2) {
              Deliver = true;
              //待收货
            } else if ((list[i].order_status == 5 || list[i].order_status == 6) && list[i].pay_status == 2 && list[i].shipping_status != 0 && list[i].order_status != 2 && list[i].shipping_status != 2) {
              Already = true;
              //已完成
            } else if ((list[i].order_status == 1 || list[i].order_status == 5) && list[i].pay_status == 2 && list[i].shipping_status == 2 && list[i].order_status != 2) {
              Complete = true;
            }
          }
          that.setData({
            Pending: Pending,
            Deliver: Deliver,
            Already: Already,
            Complete: Complete,
          })
        })
      },
      fail: function () {
        console.log('获取失败，重新获取')
        wx.login({
          success: function (res) {
            ECApiHelper.UserLogin(res.code, function (response) {
              var user = JSON.parse(response.Body);
              var user_id = user.content.user_id;
              var open_id = user.content.openid; //open_id
              wx.setStorage({
                key: 'user_id',
                data: user_id,
              })
              wx.setStorage({
                key: 'open_id',
                data: open_id,
              })
              that.setData({
                user_id: user_id
              })
              ECApiHelper.OrderListGet(user_id, null, null, "add_time", "desc", null, null, function (responses) {
                //console.log(responses.Body);
                var list = JSON.parse(responses.Body);
                var cartsshow = that.data.cartsshow;
                if (list == null || list == [] || list == "") {
                  cartsshow = false;
                }
                that.setData({
                  cartsshow: cartsshow,
                  carts: list,
                });
                wx.hideLoading();
                var Pending = that.data.Pending;//待付款
                var Deliver = that.data.Deliver;//待发货
                var Already = that.data.Already;//已发货
                var Complete = that.data.Complete;//已完成
                //初始化
                Pending = false;
                Deliver = false;
                Already = false;
                Complete = false;
                for (var i = 0; i < list.length; i++) {
                  //待付款
                  if (list[i].pay_status == 0 && list[i].order_status != 2) {
                    Pending = true;//有数据
                    //待发货
                  } else if (list[i].order_status == 1 && list[i].shipping_status == 0 && list[i].pay_status == 2 && list[i].order_status != 2) {
                    Deliver = true;
                    //待收货
                  } else if ((list[i].order_status == 5 || list[i].order_status == 6) && list[i].pay_status == 2 && list[i].shipping_status != 0 && list[i].order_status != 2 && list[i].shipping_status != 2) {
                    Already = true;
                    //已完成
                  } else if ((list[i].order_status == 1 || list[i].order_status == 5) && list[i].pay_status == 2 && list[i].shipping_status == 2 && list[i].order_status != 2) {
                    Complete = true;
                  }
                }
                that.setData({
                  Pending: Pending,
                  Deliver: Deliver,
                  Already: Already,
                  Complete: Complete,
                })
              })
            })
          }
        })
      }
    })

  },
  scrollDi: function () {
    wx.showToast({
      title: '没有更多数据!',
    })
  },

})


