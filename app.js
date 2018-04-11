App({
  "version": "1.0",
  "apiServerURL": "https://api.d9.konggeek.com",
  //"apiServerURL": "http://local.konggeek.com:8080/d9gym/api",
  onLaunch: function (options) {
    console.log("app onLaunch")
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: function (options) {
    console.log("app onShow")
  },
  onHide: function () {
  },
  onError: function (msg) {
    console.log(msg)
  },
  requestAuthenticatedUserInfo: function () {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.requestAndUpdateUserInfo();
        }
      }
    })
  },
  requestAndUpdateUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo)
        var userInfo = res.userInfo
        wx.request({
          url: this.apiServerURL + "/user/updateUserInfo.htm",
          data: {
            "accessToken": wx.getStorageSync('accessToken'),
            "nickName": userInfo.nickName,
            "avatarUrl": userInfo.avatarUrl,
            "gender": userInfo.gender
          },
          success: function (res) {
            console.log(res.data)
          }
        })
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  }
})
