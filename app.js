//app.js
//const requestUrl = require('/utils/config').requestUrl
//调用公共函数库
var util = require('/utils/util.js');
App({
  /**
   * 小程序初始完成时，触发onLaunch(全局只触发一次)
   */
  onLaunch: function () {
    //展示本地存储能力
    var that = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //调用API从本地缓存中获取数据
    var sysinfo = wx.getSystemInfoSync();
    console.log(sysinfo);
    if (sysinfo) {
      var width = sysinfo.windowWidth;
      var height = sysinfo.windowHeight;
      this.globalData.phoneheight = height;
      this.globalData.px2rpx = 750 / width;
      this.globalData.rpx2px = width / 750;
    }
    this.LoginUser();
  },
  /**
   * 获取用户信息
   */

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData)
    } else {
      //调用登录接口
      wx.login({
        success: function (e) {
          var code = e.code; //登录凭证
          that.globalData.code = code;

          //获取用户信息
          wx.getUserInfo({
            //获取用户信息的时候会弹出一个弹框是否允许授权
            //这里点击允许触发的方法
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              //准备数据
              var data = { encryptedData: res.encryptedData, iv: res.iv, code: code }
              //请求自己的服务器
              if (e.code) {

              } else {
                console.log('获取用户登录失败！' + e.errMsg)
              }
              typeof cb == "function" && cb(that.globalData)
            },
            //点击拒绝触发的方法
            fail: function (res2) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) {
                    //进入这里说明用户重新授权了，重新执行获取用户信息的方法
                    that.getUserInfo();
                  }
                }
              })
            }
          })
        },
        fail: function () {
          console.log('启用wx.login函数失败！')
        },
        complete: function () {
          console.log('已启用wx.login函数')
        }
      })
    }
  },
  LoginUser: function () {
    var that = this;
    this.globalData.userInfo = null;
    this.globalData.code = null;
    this.getUserInfo(function (data) {
      //更新数据
      //var url = requestUrl + '&do=user';
      var url = that.siteInfo.siteroot + '?i=' + that.siteInfo.uniacid + '&c=entry&m=kuaiwei_mall&do=user';
      var postdata = {
        'code': data.code,
        'nickname': data.userInfo.nickName,
        'avatar': data.userInfo.avatarUrl
      };
      util.Post(url, postdata, function (res) {
        //发送用户信息
        //console.log(res);
        if (res.success == 0) {
          var openkey = res.openkey;
          wx.setStorageSync('openkey', openkey)
        }

      });
    })
  },
  globalData: {
    userInfo: null,  //用户信息
    code: null, //用户登录态code
    phoneheight: null,
    px2rpx: null,
    rpx2px: null,
    getId: '',
    cartlist: [],//购物车列表
    user_id:'',
    open_id:'',
  },
  siteInfo: {
    "name": "\u829d\u9ebb\u8d85\u5e02",
    "uniacid": "162",
    "acid": "162",
    "multiid": "0",
    "version": "1.0.2",
    /*"siteroot":"https://demo.mitusky.com/app/index.php",*/
    "siteroot": "https://miniapp.yzdsoft.com/ApplicationInterface.ashx",
    "design_method": "3",
    "HashKey": "YZD@)174GmondERP"
  }
})