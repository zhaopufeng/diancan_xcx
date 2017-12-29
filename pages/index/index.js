//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    status: null,
    currentPosition: "order0",
    imgUrls: [],
    productData:[],
    cart:[],
    currtype:0,
    total: {
      count: 0,
      money: 0
    },
    yingye:1,
    config:{}
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/index',
      method: 'post',
      data: {
        'type': 0,
        'userId': app.d.userId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var ggtop = res.data.ggtop;
        var prolist = res.data.prolist;
        var cart = res.data.cart;
        var yingye = res.data.yingye;
        that.setData({
          imgUrls: ggtop,
          productData: prolist,
          cart: cart,
          yingye:yingye,
          config:res.data.config
        })
        if (cart) {
          var cart_num = 0;
          var cart_money = 0;
          for (var i in cart) {
            var num = parseInt(cart[i].num)
            var money = parseFloat(cart[i].price) * num
            cart_num += num;
            cart_money += money;
          }
          that.setData({
            total: {
              count: cart_num,
              money: cart_money
            }
          })
        }
        
        console.log(that.data.total)
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },
  
  tapType: function(e){
    var that = this;
    const currType = e.currentTarget.dataset.typeId;
    that.setData({
      currtype: currType
    })
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/index',
      method: 'post',
      data: {
        'type' : that.data.currtype,
        'userId': app.d.userId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var prolist = res.data.prolist;
        that.setData({
          productData: prolist,
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },
  changeMenu: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      status: index,
      currentPosition: "order" + index
    })
  },
  addCart: function(e){
    var id = e.currentTarget.dataset.id;
    var cid = e.currentTarget.dataset.cid;
    var productData = this.data.productData;
    var list=[];
    var item=[];
    for (var i in productData){
      if (productData[i].id == cid) {
        var pro_list = productData[i].pro_list
      }
    }
   for (var j in pro_list) {
      if (pro_list[j].id == id) {
        var item = pro_list[j]
      }
    }
    item.count = parseInt(item.count);
    item.count += 1;
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/add',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: id,
        num: item.count,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data        
        var data = res.data;
        if (data.status == 1) {
          that.setData({
            productData: productData,
            total:{
              count: that.data.total.count + 1,
              money: that.data.total.money + parseFloat(item.price_yh != '' ? item.price_yh : item.price)
            }
          })
        } else {
          wx.showToast({
            title: data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  plusCart: function (e) {
    var id = e.currentTarget.dataset.id;
    var cid = e.currentTarget.dataset.cid;
    var productData = this.data.productData;
    var list = [];
    var item = [];
    for (var i in productData) {
      if (productData[i].id == cid) {
        var pro_list = productData[i].pro_list
      }
    }
    for (var j in pro_list) {
      if (pro_list[j].id == id) {
        var item = pro_list[j]
      }
    }
    if(item.count < 1){
      return;
    }
    item.count = parseInt(item.count);
    item.count -= 1;
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/plus',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: id,
        num: item.count,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data        
        var data = res.data;
        if (data.status == 1) {
          that.setData({
            productData: productData,
            total: {
              count: that.data.total.count - 1,
              money: that.data.total.money - parseFloat(item.price_yh != '' ? item.price_yh : item.price)
            }
          })
        } else {
          wx.showToast({
            title: data.err,
            duration: 2000 
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  scrollBottom: function () {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    setTimeout(function(){
      wx.hideLoading();
    },1000)
  },
  previewImages: function () {
    wx.previewImage({
      current: 'http://p1.meituan.net/460.280/deal/5cae86dd953bc50457aea6219e85287d79414.jpg@460w_280h_1e_1c',
      urls: [
        'http://p1.meituan.net/460.280/deal/5cae86dd953bc50457aea6219e85287d79414.jpg@460w_280h_1e_1c',
        'http://p1.meituan.net/460.280/deal/5cae86dd953bc50457aea6219e85287d79414.jpg@460w_280h_1e_1c',
        'http://p1.meituan.net/460.280/deal/5cae86dd953bc50457aea6219e85287d79414.jpg@460w_280h_1e_1c',
        'http://p1.meituan.net/460.280/deal/5cae86dd953bc50457aea6219e85287d79414.jpg@460w_280h_1e_1c'
      ],
    })
  }
})
