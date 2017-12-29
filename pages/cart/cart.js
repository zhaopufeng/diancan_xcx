// pages/cart/cart.js
var app = getApp()
Page({
  data: { 
    cartListShow: true,
    showModal: false,
    total: 0,
    carts: []
  },
  onLoad: function (options) {
    this.loadProductData();
   
    if (this.data.carts.length < 1) { 
      this.setData({
        showModal: true
      });
    }
  },
  plus: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var num = that.data.postList[index].num;
    if (num > 1) {
      num--;
    } else {
      wx.showModal({
        title: '',
        content: '是否删除此菜品?',
        success: function (res) {
          if (res.confirm) {
            carts.splice(index, 1);
            that.setData({
              postList: carts
            });
            if (that.data.postList.length < 1) {
              that.setData({
                cartListShow: false,
                showModal: true
              });
            }
          } else if (res.cancel) {
            return;
          }
        }
      })
    }
    var carts = that.data.postList;
    carts[index].num = num;
    that.setData({
      postList: carts
    });
    //this.data.postList[index].num;
  },
  bindMinus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/up_cart',
      method: 'post',
      data: {
        user_id: app.d.userId,
        num: num,
        cart_id: cart_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var carts = that.data.carts;
          carts[index].num = num;
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
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
  bindPlus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].num;
    // 自增
    num++;
    console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/up_cart',
      method: 'post',
      data: {
        user_id: app.d.userId,
        num: num,
        cart_id: cart_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          // 购物车数据
          var carts = that.data.carts;
          carts[index].num = num;
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
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
  removeShopCard: function (e) {
    var that = this;
    var cardId = e.currentTarget.dataset.cartid;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Shopping/delete',
          method: 'post',
          data: {
            cart_id: cardId,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            if (data.status == 1) {
              //that.data.productData.length =0;
              that.loadProductData();
            } else {
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
            }
          },
        });
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
  bindCheckout: function () {
    // 初始化toastStr字符串
    var toastStr = '';
    // 遍历取出已勾选的cid
    for (var i = 0; i < this.data.carts.length; i++) {
      
        toastStr += this.data.carts[i].id;
        toastStr += ',';
      
    }
    if (toastStr == '') {
      wx.showToast({
        title: '购物车为空！',
        duration: 2000
      });
      return false;
    }
    //存回data
    wx.navigateTo({
      url: '../order/pay?cartId=' + toastStr,
    })
  },
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
     
        total += carts[i].num * carts[i].price;
      
    }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: '¥ ' + total
    });
  },
  onShow: function () {

    this.loadProductData();
    
  },
  // 数据案例
  loadProductData: function () {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/index',
      method: 'post',
      data: {
        user_id: app.d.userId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var cart = res.data.cart;
        var total = res.data.total;
        that.setData({
          carts: cart,
          total: '￥' + total
        });
        //endInitData
      },
    });
  },
})