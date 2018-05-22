//获取应用实例
var util = require('../../../utils/util.js')
var RequestEntity = require('../../../utils/ECommerceRequest.js')
var Base64 = require('../../../libs/js-base64/base64.modified.js');
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({
  /*页面的初始数据*/
  data: {
    SelectIndex: 0,
    catelist: [],
    winWidth: 0,
    winHeight: 0,
    bottomHeight: 0,
    //左侧栏分类列表数据
    tabLeftData: [],
    // Tab切换
    currentTab: 0,
    partData1: [],
    partData2: [],
    partData3: [],
    partData4: [],
  },
  toSearchResult: function (e) {
    wx.navigateTo({
      url: '../searchResult/searchResult',
    })
  },


  /*获取系统信息*/
  onLoad: function (res) {
    var that = this;
    wx.getSystemInfo({
      success: function (windows) {
        that.setData({
          winWidth: windows.windowWidth,
          winHeight: windows.windowHeight,
          bottomHeight: windows.windowHeight - 120,
        });
      },
    })
    setTimeout(function () {
      that.CategoryListGet();
    }, 200)
  },

  /*滑动切换tab */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    //console.log(e.detail.current)
  },

  /* 点击tab切换 */
  switchNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  OnSelectCate: function (e) {
    var index = e.target.dataset.idx;
    //console.log(e);
    if (index != null && index !== '') {
      //console.log(index);
      this.setData({
        SelectIndex: index,
      });
    }
  },

  OnCatePro: function (e) {
    //console.log(e);
    var cateid = e.currentTarget.id;
    console.log(cateid)
    wx.navigateTo({
      url: '../../goods/list/list?id=' + cateid,
    })
  },
  /**
   * 获取分类列表
   */
  CategoryListGet: function () {
    var that = this;
    ECApiHelper.CategoryListGet(0, function (response) {
      //console.log(response.Body);
      var cateList = JSON.parse(response.Body);
      try {
        wx.setStorageSync('cateList', cateList)
      } catch (e) {
        wx.showToast({
          title: '数据出错!',
        })
      }
      that.setData({
        tabLeftData: cateList,
        partData1: cateList,
        partData2: cateList,
        partData3: cateList,
        partData4: cateList
      })
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
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          bottomHeight: res.windowHeight - 120,
        });
      },
    })
    //从本地历史获取缓存
    var cateList = wx.getStorageSync('cateList')
    if (cateList.length < 1) {
      that.CategoryListGet();
    } else {
      that.setData({
        tabLeftData: cateList,
        partData1: cateList,
        partData2: cateList,
        partData3: cateList,
        partData4: cateList
      })
    }
  }
})
