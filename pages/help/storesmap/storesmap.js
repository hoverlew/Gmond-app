// pages/index/storesmap/storesmap.js
var ECApiHelper = require('../../../utils/ECApiHelper');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brands: [],
    showphone: "暂无预约电话",
    objectArray: [
      {
        brand: "请选择",
        id: 0,
        array: ["请选择"]
      },
      {
        brand: "甘肃",
        id: 1,
        array: ["请选择", "兰州", "白银", "酒泉", "临夏", "平凉", "庆阳", "张掖"]
      },
      {
        brand: "广东",
        id: 2,
        array: ["请选择", "深圳"]
      },
      {
        brand: "广西",
        id: 3,
        array: ["请选择", "百色", "防城港", "柳州"]
      },
      {
        brand: "贵州",
        id: 4,
        array: ["请选择", "六盘水", "铜仁"]
      },
      {
        brand: "河北",
        id: 5,
        array: ["请选择", "廊坊"]
      },
      {
        brand: "黑龙江",
        id: 6,
        array: ["请选择", "哈尔滨", "佳木斯"]
      },
      {
        brand: "湖南",
        id: 7,
        array: ["请选择", "长沙", "张家界", "常德", "郴州", "衡阳", "郴州", "怀化", "娄底", "邵阳", "湘潭", "湘西", "益阳", "永州", "岳阳", "株洲"]
      },
      {
        brand: "江西",
        id: 8,
        array: ["请选择", "宜春"]
      },
      {
        brand: "辽宁",
        id: 9,
        array: ["请选择", "大连"]
      },
      {
        brand: "内蒙古",
        id: 10,
        array: ["请选择", "呼伦贝尔"]
      },
      {
        brand: "宁夏",
        id: 11,
        array: ["请选择", "银川", "固原", "石嘴山", "吴忠"]
      },
      {
        brand: "青海",
        id: 12,
        array: ["请选择", "西宁"]
      },
      {
        brand: "山东",
        id: 13,
        array: ["请选择", "东营"]
      },
      {
        brand: "陕西",
        id: 14,
        array: ["请选择", "西安"]
      },
      {
        brand: "四川",
        id: 15,
        array: ["请选择", "成都", "绵阳", "德阳", "广安", "凉山", "眉山", "南充", "遂宁", "宜宾", "自贡", "泸州"]
      },
      {
        brand: "云南",
        id: 16,
        array: ["请选择", "昭通"]
      },
      {
        brand: "重庆",
        id: 17,
        array: ["请选择", "重庆"]
      }
    ],
    objects: [],
    brandindex: 0,
    index1: 0,
    storeList: [],//门店列表
    page_index: 1,//请求数据时第几页
    page_size: 6,//每页的数据大小
    hasMoreData: true,//用于上拉的时候是不是要继续请求数据
    address: '',//地址
    storesaddress: '',//用户输入的地址
    RegionList: [],//省市列表
    States: null,//省Id
    City: null,//市Id
  },

  /**
   * 获取省市Id
   */
  GetRegionList: function () {
    var that = this;
    ECApiHelper.RegionListGet(null, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      that.setData({
        RegionList: list
      })
    })
  },

  /**
   * 预约门店
   */
  DeptReservationAdd: function () {
    var that = this;
    //预约门店
    ECApiHelper.DeptReservationAdd(res_deptid, red_deptname, res_name, res_tel, res_email, res_conten, res_date, res_startTime, res_endtime, function (response) {

    })
  },

  /**
   * 电话预约
   */
  loadstores: function (e) {
    var phone = e.currentTarget.dataset.phone;
    if (phone != null && phone != "") {
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var objectArray = this.data.objectArray
    var brands = []
    for (var i = 0; i < objectArray.length; i++) {
      brands.push(objectArray[i].brand, )
    }
    this.setData({
      brands: brands,
      objects: objectArray[this.data.brandindex].array
    })
    this.GetRegionList();
  },

  bindPickerChange0: function (e) {
    var that = this;
    var objectArray = that.data.objectArray;
    if (objectArray[e.detail.value].brand == '请选择') {

      that.setData({
        storesaddress: '',//清楚用户输入的地址
        brandindex: e.detail.value, //省份选中的下标
        index1: 0,
        objects: objectArray[e.detail.value].array,
      })
      that.setData({
        //点击选中地址
        address: "",
        States: null,
        City: null,
        storeList: [],
        page_index: 1,
        page_size: 6
      })
      //获取省份门店
      that.getDepartmentList();
    } else {
      that.setData({
        storesaddress: '',//清楚用户输入的地址
        brandindex: e.detail.value, //省份选中的下标
        index1: 0,
      })
      var objectArray = that.data.objectArray
      that.setData({
        objects: objectArray[that.data.brandindex].array,
      })
      var address = objectArray[e.detail.value].brand;
      var RegionList = that.data.RegionList;
      var States = that.data.States;
      for (var i = 0; i < RegionList.length; i++) {
        if (address == RegionList[i].region_name) {
          States = RegionList[i].region_id;
        }
      }
      //console.log(States)
      that.setData({
        //点击选中地址
        address: '',
        States: States,//省
        City: null,
        storeList: [],
        page_index: 1,
        page_size: 6
      })
      //获取省份门店
      that.getDepartmentList();
    }
  },

  bindPickerChange1: function (e) {
    var that = this;
    that.setData({
      storesaddress: '',//清楚用户输入的地址
      index1: e.detail.value
    })
    var bject = that.data.objects;
    var address = bject[e.detail.value]
    var City = that.data.City;//市
    var RegionList = that.data.RegionList;
    var States = that.data.States;
    ECApiHelper.RegionListGet(States, function (response) {
      //console.log(response.Body);
      var list = JSON.parse(response.Body);
      if (address == "请选择") {
        var address1 = that.data.objectArray[that.data.brandindex].brand;
        for (var i = 0; i < RegionList.length; i++) {
          if (address1 == RegionList[i].region_name) {
            States = RegionList[i].region_id;
          }
        }
        that.setData({
          //点击选中地址
          address: '',
          States: States,
          City: null,
          storeList: [],
          page_index: 1,
          page_size: 6
        })
        //获取省份门店
        that.getDepartmentList();
      } else {
        for (var i = 0; i < list.length; i++) {
          console.log(address)
          if (address == list[i].region_name) {
            City = list[i].region_id;
          }
        }
        console.log(City)
        that.setData({
          //点击选中地址
          address: '',
          City: City,
          storeList: [],
          page_index: 1,
          page_size: 6
        })
        //获取省份门店
        that.getDepartmentList();
      }
    })


  },

  /**
   * 模糊查询-获取用户输入
   */
  addressName: function (e) {
    this.setData({
      address: e.detail.value,
      storesaddress: e.detail.valie
    })
  },

  /**
   * 模糊查询-点击查询
   */
  addressLoad: function (e) {
    //console.log('测试点击查询')
    this.setData({
      storeList: [],
      States: null,
      City: null,
      page_index: 1,
      page_size: 6
    })
    this.getDepartmentList();
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
    this.getDepartmentList();
  },

  /**
   * 获取会员门店地址列表
   */
  getDepartmentList: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    let page_index = that.data.page_index;
    let page_size = that.data.page_size;
    var address = that.data.address;
    var States = that.data.States == null ? null : that.data.States;
    var City = that.data.City == null ? null : that.data.City;
    //console.log(address);
    //console.log(address, States, City, false, page_index, page_size);
    ECApiHelper.DepartmentListGet('9999-12-31', 'store', 0, address, States, City, page_index, page_size, function (response) {
      var list = JSON.parse(response.Body);
      var storeListItem = that.data.storeList;
      if (response.Body != null) {
        if (that.data.page_index == 1) {
          storeListItem = []
        }
        var storeList = list;
        //每页的数量小于应该显示的数量
        if (storeList.length < that.data.page_size) {
          that.setData({
            storeList: storeListItem.concat(storeList),
            hasMoreData: false
          })
          wx.hideLoading();
        } else {
          that.setData({
            storeList: storeListItem.concat(storeList),
            hasMoreData: true,
            page_index: that.data.page_index + 1
          })
          wx.hideLoading();
        }
      } else {
        wx.showToast({
          title: '加载数据出错！',
        })
      }
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
      if (that.data.storeList.length == 0) {
        wx.showToast({
          title: '暂无门店！',
        })
      } else {

        wx.hideLoading();
      }
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
    this.data.page_index = 1;
    this.getDepartmentList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (this.data.hasMoreData) {
      this.getDepartmentList();
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})