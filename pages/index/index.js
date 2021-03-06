const app = getApp();
const util = require('../../utils/util.js');
Page({
  onShareAppMessage: function (res) {
  },
  data: {
     user: {},
     apply:false,
     appointment:false
  },   
  //事件处理函数
  apply: function() {
    var apply = this.data.apply;
    if(apply){
      wx.navigateTo({
        url: '../index/success'
      })
    }else{
      wx.navigateTo({
        url: '../apply/apply'
      })
    }
  },
  appointment:function(){
    var appointment = this.data.appointment;
    if(appointment){
      wx.navigateTo({
        url: '../index/success'
      })
    }else{
     wx.navigateTo({
        url: '../appointment/appointment'
      })
    }  
  },
  view:function(){
    wx.navigateTo({
      url: '../index/view'
    })
  },
  onLoad: function () {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("request code:" + res.code)
        wx.request({
          url: app.apiServerURL + "/user/wechatXcxLogin.htm",
          data: {
            version: app.version,
            code: res.code
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.retCode != '0') {
              util.errorMsg(that, res);
              return;
            }
            var user = res.data.data.user;
            var accessToken = user.accessToken;
            wx.setStorageSync('accessToken', accessToken);
            that.setData({
              user: user,
              apply:res.data.data.apply,
              appointment:res.data.data.appointment
            })
            app.requestAndUpdateUserInfo();
          }
        })
      },
      fail: function (res) { console.log(res)
        wx.showToast({
          title: '登录小程序失败',
        })
      }
    })
  }
})
