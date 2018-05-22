//获取应用实例
var app = getApp();
var ECApiHelper = require('../../../utils/ECApiHelper');

Page({
  data: {
    list: [ ],
    listData: [],//帮助中心文章列表
  },

  /**
   * 获取帮助中心列表
   */
  HelpCenterListGet: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.login({
      success: function (res) {
        ECApiHelper.UserLogin(res.code, function (response) {
          var user = JSON.parse(response.Body);
          var user_id = user.content.user_id;
          var open_id = user.content.openid; //open_id
          //console.log(user_id)
          ECApiHelper.HelpCenterListGet(51, null, null, function (responses) {
            //console.log('帮助中心列表')
            //console.log(responses)
            //console.log(responses.Body)
            var list = JSON.parse(responses.Body);
            for (var i = 0; i < list.length; i++) {
              console.log(list[i]["open"] = false)
            }
            that.setData({
              listData: list
            })
            wx.hideLoading();
          })
        })
      }
    })
  },

  onLoad: function () {
    this.HelpCenterListGet();
  },

  widgetsToggle: function (e) {
    var that = this;
    var id = e.currentTarget.id, listData = that.data.listData;
    for (var i = 0, len = listData.length; i < len; ++i) {
      if (listData[i].article_id == id) {
        listData[i].open = !listData[i].open;
      } else {
        listData[i].open = false;
      }
    }
    this.setData({
      listData: listData
    });
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  }
})
