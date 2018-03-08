//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
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
            "code": res.code
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.retCode != '0') {
              if (res.data.retCode == '30006') {
                wx.redirectTo({
                  url: '/pages/frozen/frozen',
                })
              } else {
                util.errorMsg(that, res);
              }
              return;
            }
            var user = res.data.data.user;
            var accessToken = user.accessToken;
            console.log('accessToken before:' + accessToken)
            wx.setStorageSync('accessToken', accessToken);
            console.log('accessToken after:' + wx.getStorageSync("accessToken"))
            that.setData({
              user: user
            })
            // 获取用户信息
            app.requestAndUpdateUserInfo();
            //加载第一页数据
            // ajaxPage(that, 0);
          }
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '登录小程序失败',
        })
      }
    })
  },
})
