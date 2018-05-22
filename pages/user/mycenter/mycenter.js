// pages/mycenter/mycenter.js
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    is_login: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isload: true,//是否重新获取权限
    user_id: '',
  },

  /**
   * 我的收藏
   */
  OnHistory: function () {
    wx.navigateTo({
      url: '/pages/test/test',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        })
      },
    })
    //获取用户信息
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      //在没有 open-tyoe=getUserInfo版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取本地数据缓存
    var openkey = wx.getStorageSync('openkey');
    if (openkey != null && openkey != '') {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (res) {
        //更新数据
        //console.log(res);
        that.setData({
          is_login: true,
          userInfo: res.userInfo
        })
      })
    } else {

    }
  },
  /**
   * 个人中心-立即登录
   */
  OnClickLogin: function () {
    app.onLaunch();
  },

  /**
   * 用户登录
   */
  UserLogin: function () {
    var that = this;
    app.globalData.userInfo = null;
    //console.log('用户登陆');
    app.getUserInfo(function (data) {
      //更新数据
    })
  },

  /**
   * 跳转页面
   */
  //订单
  OnOrder: function () {
    wx.navigateTo({
      url: '../orderlist/orderlist',
    })
  },
  //我的收藏
  OnFavorite: function () {
    wx.navigateTo({
      url: '../favorite/favorite',
    })
  },
  //购物车
  OnCart: function () {
    wx.switchTab({
      url: '/pages/steps/cart/cart',
    })
  },
  //我的地址
  OnAddress: function () {
    var that = this;
    var isload = that.data.isload;
    if (isload == true) {
      wx.chooseAddress({
        success: function (res) {
          //console.log('调用成功~')
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
  },
  OnHelp: function () {
    wx.navigateTo({
      url: '../../help/helplist/helplist',
    })
  },
  OnAbout: function () {
    wx.navigateTo({
      url: '../../help/about/about',
    })
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    var that = this;
    that.LoadOrderlist();

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
   * 预加载我的订单
   */
  LoadOrderlist: function () {
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        })
      },
      fail: function () {
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
            })
          }
        })
      }
    })
    console.log(that.data.user_id)
    ECApiHelper.OrderListGet(that.data.user_id, null, null, "add_time", "desc", null, null, function (responses) {
      //console.log(responses.Body);
      var list = JSON.parse(responses.Body);
      var cartsshow = true;
      if (list == null || list == [] || list == "") {
        cartsshow = false;
      }
      wx.setStorageSync('cartsshow', cartsshow);
      wx.setStorageSync('carts', list);//订单列表
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
      wx.setStorageSync('Pending', Pending);
      wx.setStorageSync('Deliver', Deliver);
      wx.setStorageSync('Already', Already);
      wx.setStorageSync('Complete', Complete);
      //console.log('缓存完毕')
    })
  },
})