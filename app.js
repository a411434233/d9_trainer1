App({
  "version": "1.0",
  "apiServerURL": "https://api.d9.konggeek.com",
  // "apiServerURL": "http://local.konggeek.com:8080/d9gym/api",
  onLaunch: function (options) {
    console.log("app onLaunch")
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: function (options) {
    // Do something when show.
    console.log("app onShow")
  },
  onHide: function () {
    // Do something when hide.
  },
  onError: function (msg) {
    console.log(msg)
  },
  requestAuthenticatedUserInfo: function () {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.requestAndUpdateUserInfo();
        }
      }
    })
  },
  requestAndUpdateUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
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

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  }
})