var Base64 = require('../libs/js-base64/base64.modified.js');
var md5 = require('../libs/js-md5/md5.js');
var util = require('util.js');
const hashKey = require('../utils/config').HashKey;
const url = require('../utils/config').requestUrl;

//----------------------------------接口函数-------------------------------------------
//数据接口函数：设置收藏
function CollectGoodsInfoSet(user_id, rec_id, goods_id, is_attention, operation_type, callback) {
  var CollectGoodsInfoRequest = {
    UserId: user_id,//用户Id
    RecId: rec_id,//收藏Id
    GoodsId: goods_id,//商品Id
    IsAttention: is_attention,//是否关注
    OperationType: operation_type,//修改类型
  };
  var postData = initRequest('CollectGoodsInfoSet', CollectGoodsInfoRequest);
  Post(postData, callback);
}


//数据接口函数：获取收藏
function CollectGoodsListGet(user_id, goods_id, is_attention, callback) {
  var CollectGoodsListRequest = {
    UserId: user_id,//
    GoodsId: goods_id,//商品
    IsAttention: is_attention,//是否关注 1关注，0收藏
  };
  var postData = initRequest('CollectGoodsListGet', CollectGoodsListRequest);
  Post(postData, callback);
}

//数据接口函数：获取省市
function RegionListGet(parent_id, callback) {
  var RegionListGetRequest = {
    ParentId: parent_id,//父类Id
  };
  var postData = initRequest('RegionListGet', RegionListGetRequest);
  Post(postData, callback)
}

//数据接口函数：登录接口
function UserLogin(Code, callback) {
  var UserLoginRequest = {
    Code: Code
  };
  var postData = initRequest("UserLogin", UserLoginRequest);
  Post(postData, callback)
}

//数据接口函数：预约门店
function DeptReservationAdd(res_deptid, red_deptname, res_name, res_tel, res_email, res_conten, res_date, res_startTime, res_endtime, callback) {
  var DeptReservationAddRequest = {
    ResDeptId: res_deptid,//预约门店Id
    ResDeptName: red_deptname,//预约门店名称
    ResName: res_name,//预约名称
    ResTel: res_tel,//预约人电话
    ResEmail: res_email,//预约人邮箱
    ResConten: res_conten,//预约内容
    ResDate: res_date,//预约日期
    ResStartTime: res_startTime,//预约开始时间
    ResEndTime: res_endtime,//预约结束时间
  };
  var postData = initRequest('DeptReservationAdd', DeptReservationAddRequest);
  Post(postData, callback);
}

//数据接口函数：帮助中心
function HelpCenterListGet(cat_id, article_id, title, callback) {
  var HelpCenterListGetRequest = {
    CatId: cat_id,//文章类型Id
    ArticleId: article_id,//文章Id
    Title: title,//文章标题
  };
  var postData = initRequest('HelpCenterListGet', HelpCenterListGetRequest);
  Post(postData, callback)
}

//数据接口函数：改变订单状态
function OrderPaySuccess(order_id, out_tradeNo, callback) {
  var OrderPaySuccessRequest = {
    OderId: order_id,//订单Id
    OutTradeNo: out_tradeNo,//订单号
  }
  var postData = initRequest('OrderPaySuccess', OrderPaySuccessRequest);
  Post(postData, callback)
}

//数据接口函数：获取首页轮播图列表
function AdsListGet(PositionId, callback) {
  //传递查询参数
  var AdsListRequest = {
    PositionId: PositionId
  };
  //获取需要Post的数据
  var postData = initRequest("AdsListGet", AdsListRequest);
  //Post查询参数，结果回调
  Post(postData, callback)
}

//数据接口函数：获取会员门店列表 
function DepartmentListGet(close_date, Type, is_close, address, states, city, page_index, page_size, callback) {
  var DepartmentListRequest = {
    CloseDate: close_date, //关店时间
    Type: Type,//门店类型  门店-事务所
    IsClose: is_close,//是否关闭
    Address: address,//地址查询
    States: states,//省Id
    City: city,//市Id
    Pageindex: page_index, //下标页
    PageSize: page_size,  //每页大小
  };
  var postData = initRequest('DepartmentListGet', DepartmentListRequest);
  Post(postData, callback)
}


//数据接口函数：获取正品查询数据
function JustqueryInfoGet(order_sh, callback) {
  var JustqueryInfoRequest = {
    OrderSn: order_sh,//款号
  };
  var postData = initRequest('JustqueryInfoGet', JustqueryInfoRequest);
  Post(postData, callback)
}

//数据接口查询：获取查金价数据
function GoldPriceListGet(gold_type, callbak) {
  var GoldPpriceListRequest = {
    GoldType: gold_type,
  };
  var postData = initRequest('GoldPriceListGet', GoldPpriceListRequest);
  Post(postData, callbak)
}

//数据接口函数：获取优惠卷页列表
function FavourableCouponListGet(user_id, rec_status, act_status, coupon_type, callback) {
  var FavourableCouponListRequest = {
    UserId: user_id,//用户Id
    RecStatus: rec_status, // 领取状态 1 已领取 2未领取
    ActStatus: act_status, //活动状态（这个字段还未用到）  0 正常，1 已删除，2  已关闭
    CouponType: coupon_type,//优惠劵类型 0 自领，1 连接 
  };
  var postData = initRequest("FavourableCouponListGet", FavourableCouponListRequest);
  Post(postData, callback)
}

//数据接口函数：领取个人优惠卷
function FavourableCouponSet(user_id, coupon_id, callback) {
  var FavourableCouponRequest = {
    UserId: user_id,
    CouponId: coupon_id
  };
  var postData = initRequest("FavourableCouponSet", FavourableCouponRequest);
  Post(postData, callback)
}

//数据接口函数：获取个人积分查询
function IntegralqueryInfoGet(phone, callback) {
  var IntegralqueryInfoRequest = {
    Phone: phone,//会员手机号码
  };
  var postData = initRequest("IntegralqueryInfoGet", IntegralqueryInfoRequest);
  Post(postData, callback)
}

//数据接口函数：获取商品列表 
function GoodsListGet(cate_id, goods_type, goods_id, goods_name, key_workds, page_index, page_size, orderby_fields, orderby_type, is_new, is_onsale, is_Online, callback) {
  var GoodsListRequest = {
    CatId: cate_id, //分类Id
    GoodsType: goods_type,//商品类型分类Id 
    GoodsId: goods_id,//商品Id
    GoodsName: goods_name,//商品名称
    KeyWords: key_workds,//商品关键字
    PageIndex: page_index, //页码
    PageSize: page_size,//每页大小
    OrderbyFields: orderby_fields,//排序字段
    OrderbyType: orderby_type,//排序类型 desc asc
    IsNew: is_new,//是否新品
    IsOnSale: is_onsale,//是否上架
    IsOnline: is_Online,//是否线上专款
  };
  var postData = initRequest("GoodsListGet", GoodsListRequest);
  Post(postData, callback)
}

//数据接口函数：获取商品属性列表
function AttributeListGet(cat_id, attr_id, callback) {
  var AttributeListRequest = {
    CId: cat_id,//属性Id
    AttrId: attr_id,
  };
  var postData = initRequest("AttributeListGet", AttributeListRequest);
  Post(postData, callback)
}

//数据接口函数：获取产品属性-产品库存
function ProductInfoGet(goods_id, goods_attr_id, callback) {
  var ProductInfoRequest = {
    GoodsId: goods_id,//商品Id
    GoodsAttr: goods_attr_id,//商品属性
  };
  var postData = initRequest('ProductInfoGet', ProductInfoRequest);
  Post(postData, callback)
}

//数据接口函数：获取分类列表
function CategoryListGet(parent_id, callback) {
  //传递查询参数
  var CategoryListRequest = {
    Parent_Id: parent_id
  };
  //获取需要Post的数据
  var postData = initRequest("CategoryListGet", CategoryListRequest);
  //Post查询参数，结果回调
  Post(postData, callback);
}

//数据接口函数：获取商品详情页评论
function GoodsCommentListGet(goods_id, callback) {
  var GoodsCommentListRequest = {
    Goods_id: goods_id
  };
  var postData = initRequest('GoodsCommentListGet', GoodsCommentListRequest);
  Post(postData, callback)
}

//数据接口函数：获取收货地址
function UserAddressListGet(user_id, country, province, city, district, address, callback) {
  var UserAddressListGetRequest = {
    UserId: user_id,//用户Id
    Country: country,//国家
    Province: province,//省
    City: city,//市
    District: district,//地区
    Address: address,//详细地址
  }
  var postData = initRequest('UserAddressListGet', UserAddressListGetRequest);
  Post(postData, callback)
}

//数据接口函数：更新收货地址
function UserAddressInfoSet(address_id, user_id, consignee, address, zip_code, mobile, country, province, city, district, operation_type, callback) {
  var UserAddressInfoSetRequest = {
    AddressId: address_id,//地址Id
    UserId: user_id,//用户Id
    Consignee: consignee,//联系人名称
    Address: address,//详细地址
    ZipCode: zip_code,//邮政编码
    Mobile: mobile,//手机号码
    Country: country,//国家
    Province: province,//省
    City: city,//市
    District: district,//地区
    OperationType: operation_type,//修改状态
  };
  var postData = initRequest('UserAddressInfoSet', UserAddressInfoSetRequest);
  Post(postData, callback)
}

//数据接口函数：上传商品用户评论
function GoodsCommentSet(goods_id, user_id, callback) {
  var GoodsCommentSetRequest = {
    Goods_id: goods_id,
    User_id: user_id
  }
  var postData = initRequest('GoodsCommentSet', GoodsCommentSetRequest);
  Post(postData, callback)
}

//数据接口函数：上传详情页加入购物车
function GoodsAddCartListSet(goods_id, user_id, attribute, callback) {
  var GoodsAddCartListSetRequest = {
    Goods_id: goods_id,
    User_id: user_id,
    Attribute: attribute
  }
  var postData = initRequest('GoodsAddCartListSet', GoodsAddCartListSetRequest);
  Post(postData, cakb);
}

//数据接口函数：上传详情页立即购买
function GoodsBuyListSet(goods_id, attribute, user_id, callback) {
  var GoodsBuyListSetRequest = {
    Goods_id: goods_id,
    Attribute: attribute,
    User_id: user_id
  };
  var postData = initRequest('GoodsBuyListSet', GoodsBuyListSetRequest);
  Post(postData, callback)
}
//数据接口函数：获取购物车-购物清单
function CartListGet(user_id, orderby_fields, orderby_type, page_index, page_size, callbcak) {
  var CartListRequest = {
    UserId: user_id,//用户Id
    OrderbyFields: orderby_fields,//排序字段
    OrderbyType: orderby_type,//排序类型 desc/asc
    PageIndex: page_index,//页码
    PageSize: page_size,//页大小
  };
  var postData = initRequest('CartListGet', CartListRequest);
  Post(postData, callbcak)
}

//数据接口函数：购物车-更新购物车
function CartInfoSet(user_id, rec_id, goods_number, goods_attr, OperationType, callback) {
  var CartInfoSetRequest = {
    UserId: user_id,//用户ID
    RecId: rec_id,//购物车记录ID
    GoodsNumber: goods_number,//购买数量
    GoodsAttr: goods_attr,//商品属性
    OperationType: OperationType,//修改类型
  };
  var postData = initRequest('CartInfoSet', CartInfoSetRequest);
  Post(postData, callback)
}

//数据接口函数：购物车-添加商品到购物车
function CartInfoAdd(user_id, rec_id, goods_id, goods_number, goods_attr, callback) {
  var CartInfoAddRequest = {
    UserId: user_id,//用户Id
    RecId: rec_id,//购物车记录Id
    GoodsId: goods_id,//商品Id
    GoodsNumber: goods_number,//商品数量
    GoodsAttr: goods_attr,//商品属性
  };
  var postData = initRequest('CartInfoAdd', CartInfoAddRequest);
  Post(postData, callback)
}

//数据接口函数：购物车-结算-添加订单
function OrderInfoAdd(user_id, rec_id, order_status, address_id, coupon_use_id, flow_type, payment, post_script, shipping, callback) {
  var OrderInfoAddRequest = {
    UserId: user_id,//用户Id
    RecId: rec_id,//购物车列表Id 11,22,33
    OrderStatus: order_status,//订单状态 0未确认 1已确认 2已取消 3无效 4退货（未审批） 5已分单（已发货） 6部分分单 7退货（已审批）
    AddressId: address_id,//收货地址Id
    CouponUseId: coupon_use_id,//优惠卷使用ID
    FlowType: flow_type,//商品类型
    Payment: payment,//付款方式
    PostScript: post_script,//订单留言
    Shipping: shipping,//配送方式
  };
  var postData = initRequest('OrderInfoAdd', OrderInfoAddRequest);
  Post(postData, callback)
}

//数据接口函数：取消订单
function OrderInfoCancel(user_id, order_id, callback) {
  var OrderInfoCancelRequest = {
    UserId: user_id,
    OrderId: order_id
  }
  var postData = initRequest('OrderInfoCancel', OrderInfoCancelRequest);
  Post(postData, callback)
}

//数据接口函数：上传购物车-选择优惠卷
function FavourableCouponOrderUseListGet(count, amount, goods_id, coupon_use_id, user_id, callback) {
  var FavourableCouponOrderUseListRequest = {
    Count: count,//商品数量
    Amount: amount,//商品金额
    GoodsId: goods_id,//商品Id
    CouponUseIds: coupon_use_id,//优惠卷使用Id
    UserId: user_id //用户Id
  };
  var postData = initRequest('FavourableCouponOrderUseListGet', FavourableCouponOrderUseListRequest);
  Post(postData, callback)
}

//数据接口函数：上传购物车-结算订单
function GoodsBuyOrderSet(goods_id, coupon_id, price, address, user_id, callback) {
  var GoodsBuyOrderSetRequest = {
    Goods_id: goods_id,
    Coupon_id: coupon_id,
    Price: price,
    Address: address,
    User_id: user_id
  };
  var postData = initRequest('GoodsBuyOrderSet', GoodsBuyOrderSetRequest);
  Post(postData, callback)
}

//数据接口函数：获取个人中心-我的订单
function OrderListGet(user_id, order_status, order_id, orderby_fields, orderby_type, page_index, page_size, callback) {
  var OrderListRequest = {
    UserId: user_id,//用户Id
    OrderStatus: order_status,//订单状态
    OrderId: order_id,//订单Id
    OrderbyFields: orderby_fields,//排序字段
    OrderbyType: orderby_type,//排序类型 desc/asc
    PageIndex: page_index,//页码
    PageSize: page_size,//页大小
  };
  var postData = initRequest('OrderListGet', OrderListRequest);
  Post(postData, callback)
}

//数据接口函数：获取个人中心-我的订单
function MyCollectionListGet(user_id, callback) {
  var MyCollectionListRequest = {
    User_id: user_id
  };
  var postData = initRequest('MyCollectionListGet', MyCollectionListRequest);
  Post(postData, callback)
}

//数据接口函数：获取个人中心-我的订单
function CustomerServiceSet(user_id, message, callback) {
  var CustomerServiceSetRequest = {
    User_id: user_id,
    Message: message
  };
  var postData = initRequest('CustomerServiceSet', CustomerServiceSetRequest);
  Post(postData, callback)
}

//数据接口函数：订单退货申请
function OrderInfoRefundApply(user_id, order_id, rec_id, refund_amount, refund_number, refund_explain, refund_express, refund_invoiceno, refund_type, refund_reason, totalfee, callback) {
  var OrderInfoRefundApplyRequest = {
    UserId: user_id,    //用户Id
    OrderId: order_id,  //订单Id
    RecId: rec_id,      //订单商品购物车ID
    RefundAmount: refund_amount,//退款金额
    RefundNumber: refund_number,//退款商品数量
    RefundExplain: refund_explain,//退款原因
    RefundExpress: refund_express,//退款快递公司
    RefundInvoiceNo: refund_invoiceno,//退款快递公司订单号
    RefundType: refund_type,//退货类型
    RefundReason: refund_reason,//退款原因-七天无理由退货
    TotalFee: totalfee,//订单金额
  }
  var postData = initRequest('OrderInfoRefundApply', OrderInfoRefundApplyRequest);
  Post(postData, callback);
}

//数据接口函数：订单签收
function OrderInfoSign(order_id, user_id, rec_id, callback) {
  var OrderInfoSignRequest = {
    OrderId: order_id, //订单Id
    UserId: user_id,   //用户Id
    RecId: rec_id      //商品购物车Id
  }
  var postData = initRequest('OrderInfoSign', OrderInfoSignRequest);
  Post(postData, callback);
}

//数据接口函数：导航分类接口
function NavListGet(callback) {
  var NavListGetRequest = {

  }
  var postData = initRequest('NavListGet', NavListGetRequest);
  Post(postData, callback)
}

//数据接口函数：退货申请单


//数据接口函数：微信统一下单
function UnifiedOrderPay(open_id, device_info, nonce_str, sign_type, body, detail, attch, outtrade_no, fee_type, total_fee, spbillcreate_ip, timestart, timeexpice, goodstag, notifyurl, trade_type, limit_pay, product_id, callback) {
  var UnifiedOrderPayRequest = {
    OpenId: open_id,//用户标识
    DeviceInfo: device_info,//设备号
    NonceStr: nonce_str,//随机字符串
    SignType: sign_type,//签名类型
    Body: body,//商品描述
    Detail: detail,//商品详情
    Attach: attch,//附加数据
    OutTradeNo: outtrade_no,//商户订单号
    FeeType: fee_type,//标价币种
    TotalFee: total_fee,//标价金额
    SpbillCreateIp: spbillcreate_ip,//终端iP
    TimeStart: timestart,//交易起始时间
    TimeExpire: timeexpice,//交易结束时间
    GoodsTag: goodstag,//订单优惠标记
    NotifyUrl: notifyurl,//通知地址
    TradeType: trade_type,//交易类型
    LimitPay: limit_pay,//指定支付方式
    ProductId: product_id,//商品Id
  }
  var postData = initRequest('UnifiedOrderPay', UnifiedOrderPayRequest);
  Post(postData, callback);


}

//-----------------------------------------------------------------------------------
//初始化
function initRequest(methodName, obj) {
  var entity = require('ECommerceRequest.js');
  entity.ControlName = "Sop";
  entity.MethodName = methodName;
  entity.Body = Base64.encode(JSON.stringify(obj));
  entity.TimeStamp = util.formatTime(new Date, 'YYYYmmddHHMMSSmis');
  entity.Token = md5.hexMD5(entity.TimeStamp + hashKey).toUpperCase();

  var strJson = JSON.stringify(entity);
  var strBase64 = Base64.encode(strJson);
  var requestData = { 'RequestParams': strBase64 };
  return requestData;
}

function Post(data, cb) {
  wx.request({
    url: url,
    data: data,
    method: 'POST',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      var response = Base64.decode(res.data);
      var json = JSON.parse(response);
      return typeof cb == "function" && cb(json);
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

/**
 * 暴露模块接口
 */
module.exports = {
  UserLogin: UserLogin,                                 //登录接口
  AdsListGet: AdsListGet,                               //获取首页轮播图列表
  DepartmentListGet: DepartmentListGet,                 //获取会员门店列表
  JustqueryInfoGet: JustqueryInfoGet,                   //获取正品查询数据
  GoldPriceListGet: GoldPriceListGet,                   //获取查金价数据
  FavourableCouponListGet: FavourableCouponListGet,     //获取个人优惠卷页列表
  FavourableCouponSet: FavourableCouponSet,             //上传领取个人优惠卷
  IntegralqueryInfoGet: IntegralqueryInfoGet,           //获取个人积分查询
  GoodsListGet: GoodsListGet,                           //获取商品信息列表
  AttributeListGet: AttributeListGet,                   //获取商品属性列表
  CategoryListGet: CategoryListGet,                     //获取左侧栏分类列表
  GoodsCommentListGet: GoodsCommentListGet,             //获取商品详情页评论
  GoodsCommentSet: GoodsCommentSet,                     //上传商品用户评论
  GoodsAddCartListSet: GoodsAddCartListSet,             //上传详情页加入购物车
  GoodsBuyListSet: GoodsBuyListSet,                     //上传详情页立即购买
  CartListGet: CartListGet,                             //获取购物车-购物清单
  CartInfoSet: CartInfoSet,                             //购物车-更新购物车
  CartInfoAdd: CartInfoAdd,                             //购物车-添加商品到购物车
  OrderInfoAdd: OrderInfoAdd,                           //购物车-结算-添加订单
  FavourableCouponOrderUseListGet: FavourableCouponOrderUseListGet,
  //上传购物车-选择优惠卷
  GoodsBuyOrderSet: GoodsBuyOrderSet,                   //上传购物车-结算订单
  OrderListGet: OrderListGet,                           //获取个人中心-我的订单
  MyCollectionListGet: MyCollectionListGet,             //获取个人中心-我的订单
  CustomerServiceSet: CustomerServiceSet,               //获取个人中心-我的订单
  HelpCenterListGet: HelpCenterListGet,                 //获取个人中心-帮助中心
  UserAddressInfoSet: UserAddressInfoSet,               //更新收货地址
  UserAddressListGet: UserAddressListGet,               //获取收货地址    
  ProductInfoGet: ProductInfoGet,                       //获取产品属性         
  UnifiedOrderPay: UnifiedOrderPay,                     //微信支付
  OrderPaySuccess: OrderPaySuccess,                     //改变订单状态
  OrderInfoCancel: OrderInfoCancel,                     //取消订单
  OrderInfoRefundApply: OrderInfoRefundApply,           //退货申请
  OrderInfoSign: OrderInfoSign,                         //订单签收
  NavListGet: NavListGet,                               //导航分类菜单
  DeptReservationAdd: DeptReservationAdd,               //预约门店     
  RegionListGet: RegionListGet,                         //获取省市
  CollectGoodsListGet: CollectGoodsListGet,             //获取收藏列表
  CollectGoodsInfoSet: CollectGoodsInfoSet,             //设置收藏列表
}