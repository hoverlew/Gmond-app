// pages/categorys/searchResult/searchResult.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',//商品关键字
    SearchHistory: [],//搜索历史
  },
  /**
   * 获取搜索关键字 
   */
  searchName: function (e) {
    var that = this;
    var searchValue = e.detail.value;
    that.setData({
      searchValue: searchValue
    })
    //console.log('输入')
    //console.log(e.detail.value)
  },

  /**
   * 搜索关键字商品跳转
   */
  searchLoad: function () {
    var that = this;
    var searchName = that.data.searchValue;
    if (searchName == null || searchName == '') {
      wx.showToast({
        title: '请输入关键字!',
      })
    } else {
      var SearchHistory = that.data.SearchHistory == null || that.data.SearchHistory == "" ? [] : that.data.SearchHistory;
      //console.log(searchName);
      //console.log(SearchHistory);
      //判断是否有相同
      var isAdd = true;
      for (var i = 0; i < SearchHistory.length; i++) {
        if (searchName == SearchHistory[i]) {
          isAdd = false;
        }
      }
      if (isAdd) {
        SearchHistory = SearchHistory.concat(searchName);
      }
      wx.setStorageSync('SearchHistory', SearchHistory)
      wx.navigateTo({
        url: '/pages/goods/list/list?goods_name=' + searchName,
      })
    }
  },

  /**
   * 点击搜索历史
   */
  textLoad: function (e) {
    var that = this;
    var searchValue = e.currentTarget.dataset.text;
    /*
    that.setData({
      searchValue: searchValue,
    })
    */
    //点击搜索历史 跳转
    wx.navigateTo({
      url: '/pages/goods/list/list?goods_name=' + searchValue,
    })
  },

  /**
   * 清除搜索历史
   */
  clearSearch: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (e) {
        if (e.confirm) {
          wx.clearStorageSync('SearchHistory')
          that.setData({
            SearchHistory: wx.getStorageSync('SearchHistory')
          })
        } else if (e.cancel) {

        }
      }

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    that.setData({
      SearchHistory: wx.getStorageSync('SearchHistory')
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

  }
})