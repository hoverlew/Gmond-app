//index.js
//获取应用实例
const NO_ORDER = 0;
const ASC_ORDER = 1;
const DESC_ORDER = -1;
const SELECTED_COLOR = '#f6827a';
const NORMAL_COLOR = '#A9A9A9';
const ASC_CLZ_NAME = 'filter-order-asc';
const DESC_CLZ_NAME = 'filter-order-desc';

const OLD_ORDERS = [{
  orderBy: 'comment',
  order: 'desc',
  color: NORMAL_COLOR,
  clzName: ''
}, {
  orderBy: 'all_case',
  order: 'desc',
  color: NORMAL_COLOR,
  clzName: ''
}, {
  orderBy: 'work_start_year',
  order: 'asc',
  color: NORMAL_COLOR,
  clzName: ''
}];

var ECApiHelper = require('../../../utils/ECApiHelper');
var util = require('../../../utils/util.js');
var app = getApp();
var canMove = false;
var hasLifeCycleOnShow = false;
var prevOrderIndex = -1;

Page(
  {
    data: {
      userInfo: {},
      list: [],
      footerText: '正在加载...',
      right: 16,
      bottom: 16,
      isSearchVisible: false,
      currentCatIndex: 0,
      filterMap: [],
      orders: OLD_ORDERS.slice(),
      keyWord: '',
      fabAnimation: {},
      coverAlphaAnim: {},
      goods_type: '', //商品类型ID
      id: 0, //商品分类Id
      listData: [],
      page_index: 1,//请求数据时第几页
      page_size: 8,//每页的数据大小
      hasMoreData: true,//用于上拉的时候是不是要继续请求数据
      goods_name: '',//商品名称
      sore_state: 0,  //0 没有排序 1销量排序 2价格降序 3价格升序 4新品排序
      loadhidden: false,//加载
      minprice: 0,//最低价
      maxprice: 9999999999,//最高价
      is_screen: false,//是否启用筛选
      listshow: true,//商品列表是否显示
      noCartImgSrc: '/images/sp.png',
      noCartTxt: '-暂时没有你想要的商品-',
      key_workds: null,//商品关键字
      is_Online: 0,//是否线上专款
    },

    /**
     * 跳转到筛选页面
    */
    bindSearch: function () {
      var that = this;
      if (that.data.goods_name == null) {
        var goods_name = '';
      } else {
        var goods_name = that.data.goods_name;
      }
      if (that.data.goods_type == null) {
        var goods_type = '';
      } else {
        var goods_type = that.data.goods_type;
      }
      if (that.data.id == null) {
        var id = '';
      } else {
        var id = that.data.id;
      }
      wx.navigateTo({
        url: '../filter/filter?goods_name=' + goods_name + '&goods_type=' + goods_type + '&id=' + id,
      })
    },

    onLoad: function (res) {
      var that = this;
      //绑定专区goods_type数据
      that.setData({
        goods_type: res.goods_type,
        id: res.id == 1233 ? null : res.id,
        cat_id: res.cat_id,
        goods_name: res.goods_name,
        minprice: res.minprice,
        maxprice: res.maxprice,
        key_workds: res.key_workds,
        is_screen: res.is_screen,
        minprice: parseInt(res.minprice),
        maxprice: parseInt(res.maxprice),
        is_Online: res.is_Online,
      })
      if (that.data.is_screen == true) {
        that.setData({
          page_size: 15
        })
      }
    },

    onShow: function (e) {
      var that = this;
      var sore_state = that.data.sore_state;//排序状态
      if (sore_state == 0) {
        this.getGoodsListinfo();
      } else if (sore_state == 1) {
        that.salesGetGoodsList('sales_count', 'desc', null);
      } else if (sore_state == 2) {
        that.salesGetGoodsList('shop_price', 'desc', null);
      } else if (sore_state == 3) {
        that.salesGetGoodsList('shop_price', 'asc', null);
      } else if (sore_state == 4) {
        that.salesGetGoodsList(null, null, 1);
      }
    },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
    onPullDownRefresh: function () {
      this.data.page_index = 1;
      var that = this;
      var sore_state = that.data.sore_state;//排序状态
      if (sore_state == 0) {
        this.getGoodsListinfo();
      } else if (sore_state == 1) {
        that.salesGetGoodsList('sales_count', 'desc', null);
      } else if (sore_state == 2) {
        that.salesGetGoodsList('shop_price', 'desc', null);
      } else if (sore_state == 3) {
        that.salesGetGoodsList('shop_price', 'asc', null);
      } else if (sore_state == 4) {
        that.salesGetGoodsList(null, null, 1);
      }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      var that = this;
      //console.log('下一页');
      if (this.data.hasMoreData) {
        var sore_state = that.data.sore_state;//排序状态
        if (sore_state == 0) {
          this.getGoodsListinfo();
        } else if (sore_state == 1) {
          that.salesGetGoodsList('sales_count', 'desc', null);
        } else if (sore_state == 2) {
          that.salesGetGoodsList('shop_price', 'desc', null);
        } else if (sore_state == 3) {
          that.salesGetGoodsList('shop_price', 'asc', null);
        } else if (sore_state == 4) {
          that.salesGetGoodsList(null, null, 1);
        }
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

    },

    /**
    * 商品分页显示
    */
    getGoodsListinfo: function () {
      var that = this;
      let goods_type = that.data.goods_type == null ? null : that.data.goods_type;
      let cat_id = that.data.id;
      let page_index = that.data.page_index;
      let page_size = that.data.page_size;
      let goods_name = that.data.goods_name == null ? null :
        that.data.goods_name;
      let key_workds = that.data.key_workds == null ? null : that.data.key_workds;
      let is_Online = that.data.is_Online == null ? null : that.data.is_Online;
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        listshow: true
      })
      /**
       * 分类专区商品
       */
      //console.log(cat_id, goods_type, null, goods_name, page_index, page_size)
      ECApiHelper.GoodsListGet(cat_id, goods_type, null, goods_name, key_workds, page_index, page_size, null, null, null, 1, is_Online, function (response) {
        console.log(response)
        console.log(response.Body)
        var list = JSON.parse(response.Body);
        var listshow = true;
        //console.log(list)
        if (list.length < 1 && page_index < 2) {
          listshow = false;
        }
        that.setData({
          listshow: listshow,
        })
        var contentlistTem = that.data.listData;
        var heightsize = that.data.heightsize;
        if (response.Body != null) {
          if (that.data.page_index == 1) {
            contentlistTem = []
          }
          var listData = list;
          //每页的数量小于应该显示的数量
          if (listData.length < that.data.page_size) {
            //console.log(listData)
            that.setData({
              listData: contentlistTem.concat(listData),
              hasMoreData: false
            })
            wx.hideLoading();
          } else {
            that.setData({
              listData: contentlistTem.concat(listData),
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
      })

    },

    /**
     * 排序
     */
    salesGetGoodsList: function (orderby_fields, orderby_type, is_now) {
      var that = this;
      let goods_type = this.data.goods_type;
      let cat_id = this.data.id;
      let page_index = this.data.page_index;
      let page_size = this.data.page_size;
      let goods_name = this.data.goods_name;
      let key_workds = that.data.key_workds == null ? null : that.data.key_workds;
      let is_Online = that.data.is_Online == null ? null : that.data.is_Online;
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        listshow: true
      })
      ECApiHelper.GoodsListGet(cat_id, goods_type, null, goods_name, key_workds, page_index, page_size, orderby_fields, orderby_type, is_now, 1, is_Online, function (response) {
        var list = JSON.parse(response.Body);
        var contentlistTem = that.data.listData;
        var heightsize = that.data.heightsize;
        if (response.Body != null) {
          if (that.data.page_index == 1) {
            contentlistTem = []
          }
          var listData = list;
          //每页的数量小于应该显示的数量
          if (listData.length < that.data.page_size) {
            that.setData({
              listData: contentlistTem.concat(listData),
              hasMoreData: false
            })
            wx.hideLoading();
          } else {
            that.setData({
              listData: contentlistTem.concat(listData),
              hasMoreData: true,
              page_index: that.data.page_index + 1
            })
          }
          wx.hideLoading();
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
      })

    },
    /**
     * 清空list
     */
    clearlist: function () {
      var that = this;
      that.setData({
        listData: [],
        page_index: 1,

      })
    },

    /**
     * 点击排序条件
     * @return {[type]} [description]
     */
    bindOrderTap: function (e) {
      // console.log(e);
      var that = this;
      var orders = this.data.orders;
      var index = this.dataOf(e, 'index');
      if (prevOrderIndex == index) { // 切换价格排序
        var order = orders[index];
        if (index == 0) {
          that.clearlist();
          that.salesGetGoodsList('sales_count', 'desc', null);
        } else if (index == 1) {
          if (order.clzName == DESC_CLZ_NAME) {
            //切换升序
            that.setData({
              sore_state: 3
            })
            that.clearlist();
            that.salesGetGoodsList('shop_price', 'asc', null);
            order.clzName = ASC_CLZ_NAME;
            order.order = index == 2 ? 'desc' : 'asc';
          } else {
            //切换降序
            that.setData({
              sore_state: 2
            })
            that.clearlist();
            that.salesGetGoodsList('shop_price', 'desc', null);
            order.clzName = DESC_CLZ_NAME;
            order.order = index == 2 ? 'asc' : 'desc';
          }
        } else if (index == 2) {
          //新品
          that.clearlist();
          that.salesGetGoodsList(null, null, 1);
        }
      } else {
        prevOrderIndex = index;//上次点击的排序下标
        if (index == 0) {
          that.setData({
            sore_state: 1
          })
          that.clearlist();
          that.salesGetGoodsList('sales_count', 'desc', null);
        } else if (index == 1) {
          that.setData({
            sore_state: 2
          })
          that.clearlist();
          that.salesGetGoodsList('shop_price', 'desc', null);
        } else if (index == 2) {
          //新品
          that.setData({
            sore_state: 4
          })
          that.clearlist();
          that.salesGetGoodsList(null, null, 1);
        }
        //改变排序导航栏颜色
        var orders = orders.map(function (value, i) {
          if (index == i) {
            value.color = SELECTED_COLOR;
            value.clzName = DESC_CLZ_NAME;
          } else {
            value.color = NORMAL_COLOR;
            value.clzName = '';
          }
          value.order = index == 2 ? 'asc' : 'desc';
          return value;
        });
      }
      var orderObj = orders[index];
      this.setData({
        page_index: 1,
        hasMoreData: true,
        orders: orders,
        footerText: '正在加载...'
      });
    },
    dataOf: function (e, name) {
      return e.currentTarget.dataset[name];
    },

    toSearchResult: function () {
      wx.navigateTo({
        url: '../../categorys/searchResult/searchResult',
      })
    },

  }
);