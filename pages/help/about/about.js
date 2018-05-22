// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    aboutdata: [],
    aboutData: [
      {
        'postId': 1,
        'aboutTitle': '品牌起源',
        'imgSrc': '/images/about1.jpg',
        'aboutContent': '2000年，GMOND吉盟珠宝品牌诞生了 。凭借对挑剔选材、精湛工艺和非凡创意的坚持，GMOND吉盟珠宝缔造了一个本土时尚品质珠宝的传奇。GMOND吉盟珠宝持续关注中国女性的内心情感需求，让珠宝在传世之外，更成为了可以伴随中国女性在不同身份、场景下展现自我魅力及时尚品味。GMOND吉盟以近三百家线下实体店及天猫、京东网络旗舰店为依托，将珠宝之美和钻石文化不断播撒给懂得美，爱护美，收藏美的顾客。',
        'aboutTitleA': '闪耀铂金钻饰',
        'imgSrcA': '/images/about2.jpg',
        'aboutContentA': '2010年，GMOND吉盟珠宝汇聚全球灵感，启用意大利设计师创作“闪耀铂金钻饰系列”，成功树立了主从钻及主副戒搭配典范，凭借非凡创意，打破曾经千篇一律的单钻婚戒设计，系列作品得到了诸多媒体和明星名流的青睐。',
      },
      {
        'postId': 2,
        'aboutTitle': '持续关注年轻消费者',
        'imgSrc': '/images/about5.jpg',
        'aboutContent': '随着GMOND吉盟珠宝对年轻人群的关注，主打萌趣风格的“吉祥人生”系列黄金饰品的诞生。该系列大胆运用3D硬黄金技术，解决黄金创意设计的同时保重了黄金的纯度。让黄金摆脱压箱底收藏的宿命，摇身成为追赶潮流的时尚必备之选。',
        'aboutTitleA': '闪耀恒久之美',
        'imgSrcA': '/images/about4.jpg',
        'aboutContentA': '16年来，GMOND吉盟珠宝一直关注中国女性的内心情感需求，并以此创作了一系列时尚的，经典的，值得信赖的珠宝作品，让珠宝除了可以传世外，更成为了可以伴随中国女性在不同身份，不同场景下，都能展现自我魅力及时尚品味的最佳选择。',
      },     
    ],
    swiperData: [
      {
        'postId': 11,
        'imgSrcB': '/images/5-10.jpg',
        'desTxt': '2012年董洁佩戴"梦幻星空"亮相中央六套首映慈善晚会',
      },
      {
        'postId': 12,
        'imgSrcB': '/images/5-9.jpg',
        'desTxt': '2012年姚星彤佩戴"爱的承诺·涟漪"系列亮相65届戛纳电影节',
      },
      {
        'postId': 13,
        'imgSrcB': '/images/5-11.jpg',
        'desTxt': '2014年张艺佩戴"心漾"拍摄网易快乐女人节大片',
      },
      {
        'postId': 14,
        'imgSrcB': '/images/5-12.jpg',
        'desTxt': '2015年陈数佩戴"意生浓情·芳馨"亮相GMOND吉盟珠宝“闪耀见证婚俗文化寻访”启动仪式',
      },
      {
        'postId': 15,
        'imgSrcB': '/images/6-11.jpg',
        'desTxt': '2017年陈乔恩佩戴"闪耀如伊·芳菲"拍摄《优家画报》封面大片',
      },
    ],
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
  
  },
  OnPreViewImg: function (e) {
    var that = this;
    var current_img = e.target.dataset.img;
    var img_urls = that.data.noticedata.notice_images;
    wx.previewImage({
      current: current_img,
      urls: img_urls,
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