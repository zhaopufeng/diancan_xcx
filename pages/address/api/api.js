// pages/address/api/api.js
var app = getApp();
Page({
  data: {
    latitude: 37.464387,
    longitude: 121.45949,
    addressName:'',
    cartId: 0,
    data:{},
    markers: [{
      iconPath: "../../../images/marker_red.png",
      id: 0,
      latitude: 37.464387,
      longitude: 121.45949,
      width: 15,
      height: 30
    }],
    selectlatitude:'',
    selectlongitude:''
  },  
  regionchange(e) {
    //console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  onLoad: function(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          addressName: res.address,
          selectlatitude: res.latitude,
          selectlongitude: res.longitude
        })
      }
    })
  },
  selectMap: function(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          addressName: res.address,
          selectlatitude: res.latitude,
          selectlongitude: res.longitude
        })
      }
    })
  },
  formSubmit: function(e){
    var that = this
    var address = e.detail.value.address
    var cartId = this.data.cartId
    
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_distance',
      method: 'post',
      data: {
        selectlatitude: that.data.selectlatitude,
        selectlongitude: that.data.selectlongitude,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if (status == 1) {
          wx.redirectTo({
            url: '/pages/address/address?cartId=' + cartId + '&address=' + address
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  }
})

  
