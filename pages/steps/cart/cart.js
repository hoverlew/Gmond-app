// pages/cart/cart.js
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    cartlist: [],//购物车列表
    total_money: 0,//合计金额
    total_num: 0,
    selectall: 0,//选中全部
    is_select: 0,//商品选中图标
    listData: [],
    rec_id: 0,//购物车Id
    index: 0,//数组下标
    user_id: 0,//用户Id
    code: '',
    cartshow: true,//是否显示
    isScroll: true,
    noCartImgSrc: '/images/gwc.png',
    noCartTxt: '-购物车空空的-',
    isload: true,//是否可以点击
    user_id: '',
  },

  toEdit: function (e) {
    var that = this;
    var rec_id = e.currentTarget.dataset.id;
    var goods_number = e.currentTarget.dataset.number;
    var goods_id = e.currentTarget.dataset.goods_id
    var goods_attr_id = e.currentTarget.dataset.goods_attr_id;
    var list = that.data.cartlist;
    var goods_amount = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].rec_id == rec_id) {
        goods_amount = list[i].goods_amount;
      }
    }
    wx.setStorageSync('goods_amount', goods_amount)
    var goods_attr_price = e.currentTarget.dataset.goods_price;
    wx.navigateTo({
      url: '../edit/edit?rec_id=' + rec_id + '&goods_number=' + goods_number + '&goods_id=' + goods_id + "&goods_attr_id=" + goods_attr_id + "&goods_attr_price=" + goods_attr_price,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        })
      },
    })
    that.UserCartList();
  },

  UserCartList: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    //用户登录显示购物车列表
    that.AllCartListGet();
    that.AllMoney();
  },

  onShow: function () {
    var that = this;
    that.setData({
      isload: true
    })
    that.UserCartList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 图片商品跳转
   */
  goodsLoad: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },

  /**
   * 
   */
  nameload: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + goods_id,
    })
  },
  /**
   * 选中全部
   */
  OnSelectAll: function (e) {
    var that = this;
    //修改数组中的某一项值 
    if (that.data.selectall == 0) {
      for (var i = 0; i < that.data.cartlist.length; i++) {
        var is_select = "cartlist[" + i + "].is_select";
        this.setData({
          [is_select]: 1
        })
        wx.setStorageSync('cartlist', that.data.cartlist);
        var cartlistCash = this.data.cartlist;
        wx.setStorageSync('cartlistCash', cartlistCash)
      }
      that.setData({
        selectall: 1,
      })
    } else {
      for (var i = 0; i < that.data.cartlist.length; i++) {
        var is_select = "cartlist[" + i + "].is_select";
        this.setData({
          [is_select]: 0
        })
        wx.setStorageSync('cartlist', that.data.cartlist);
        var cartlistCash = this.data.cartlist;
        wx.setStorageSync('cartlistCash', cartlistCash)
      }
      that.setData({
        selectall: 0,
      })
    }
    this.AllMoney();
  },

  /**
 * 购物车商品图标选定 
 */
  iconTrue: function (e) {
    var that = this;
    //数组下标
    var index = e.currentTarget.dataset.current;
    //修改数组中的某一项值 
    var is_select = "cartlist[" + index + "].is_select";
    if (that.data.cartlist[index].is_select == 0) {
      this.setData({
        [is_select]: 1,//选中
      })
      wx.setStorageSync('cartlist', that.data.cartlist);
    } else {
      this.setData({
        [is_select]: 0,//未选中
        selectall: 0,//全部未选中
      })
      wx.setStorageSync('cartlist', that.data.cartlist);
      wx.setStorageSync('selectall', that.data.selectall);
    }
    //判断是否全部选中
    var isTrue = false;
    for (var i = 0; i < that.data.cartlist.length; i++) {
      if (that.data.cartlist[i].is_select == 1) {
        isTrue = true;
      } else {
        isTrue = false;
        break;
      }
    }
    if (isTrue == false) {
      that.setData({
        selectall: 0,//全部未选中
      })
      wx.setStorageSync('selectall', that.data.selectall);
    } else {
      that.setData({
        selectall: 1,//全部选中
      })
      wx.setStorageSync('selectall', that.data.selectall);
    }
    this.AllMoney();

  },
  /**
   * 计算商品总金额
   */
  AllMoney: function () {
    var cartlist = this.data.cartlist;
    var total_money = 0;//总金额
    for (var i = 0; i < cartlist.length; i++) {
      if (cartlist[i].is_select == 1) {
        //console.log(cartlist[i].goods_price)
        var goods_price = parseFloat(cartlist[i].goods_price) * parseFloat(cartlist[i].goods_number);
        total_money = parseFloat(total_money) + parseFloat(goods_price);
      }
    }
    this.setData({
      total_money: total_money.toFixed(2),
    })
  },

  /**
   * 结算跳转
   */
  OnCash: function () {
    var that = this;
    if (that.data.isload) {
      that.setData({
        isload: false
      })
      var isTrue = false; //判断是否有选择商品
      for (var i = 0; i < that.data.cartlist.length; i++) {
        if (that.data.cartlist[i].is_select == 1) {
          isTrue = true;
        }
      }
      if (isTrue) {
        var cartlistCash = this.data.cartlist;
        wx.setStorageSync('cartlistCash', cartlistCash)
        wx.navigateTo({
          url: '../pay/pay',
        })
      } else {
        wx.showToast({
          title: '请选择商品！',
        })
      }
    }
  },

  GoHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
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
    return {
      title: '购物车',
      path: '/pages/cart/cart',
    }
  },
  /**
   * 购物车删除商品
   */
  DeleteGoods: function (em) {
    var that = this;
    var user_id = that.data.user_id;
    //购物车记录Id
    that.setData({
      rec_id: em.currentTarget.dataset.id,
    })
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (e) {
        if (e.confirm) {
          var rec_id = that.data.rec_id;
          //删除购物车商品
          ECApiHelper.CartInfoSet(user_id, rec_id, null, null, 'delete', function (response) {
            var list = JSON.parse(response.Body);
            //console.log(response.Body)
            if (list.error == 0) {
              wx.showToast({
                title: '删除成功！',
              })
            } else {
              wx.showToast({
                title: '删除失败！',
              })
            }
          })
          that.onShow();
        } else if (e.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 获取购物车列表
   */
  AllCartListGet: function () {
    var that = this;
    var user_id = that.data.user_id;
    var cartshow = true;
    var cartlists = wx.getStorageSync('cartlist');
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        ECApiHelper.CartListGet(res.data, null, null, null, null, function (response) {
          console.log(response.Body);
          var list = JSON.parse(response.Body);
          if (list == null || list == [] || list == "") {
            cartshow = false;
          }
          //console.log(that.data.cartshow)
          //判断是否有新的商品加入购物车
          var isNewlist = true;
          if (cartlists != null && cartlists.length > 0) {
            if (list.length > cartlists.length || list.length < cartlists.length) {
              that.setData({
                cartlist: list,
                cartshow: cartshow,
              });
            } else {
              for (var i = 0; i < list.length; i++) {
                if (list[i].goods_number != cartlists[i].goods_number || list[i].goods_amount != cartlists[i].goods_amount) {
                  isNewlist = false;
                }
              }
              if (isNewlist) {
                that.setData({
                  cartlist: cartlists,
                  cartshow: cartshow,
                });
              } else {
                that.setData({
                  cartlist: list,
                  cartshow: cartshow,
                  selectall: 0,
                  total_money: 0
                });
              }
            }
          } else {
            that.setData({
              cartlist: list,
              cartshow: cartshow,
              selectall: 0,
              total_money: 0
            });
          }
          wx.hideLoading();
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
      },
    })
  },
})