const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function errorMsg(that, data) {
  var text;
  if (typeof data == 'string') {
    text = data;
  } else if (typeof data == 'object') {
    text = data.data.errorMsg;
    if (data.data.retCode == '10002') {
      wx.removeStorageSync("accessToken")
    }
  }
  var errorMsg = {
    flag: false,
    text: text
  }
  that.setData({
    errorMsg: errorMsg
  })
  setTimeout(function () {
    var errorMsg = {
      flag: true
    }
    that.setData({
      errorMsg: errorMsg
    })
  }, 2000)
}
function errorCallback() {
  wx.showLoading({
    title: '网络异常',
    mask: true
  })
  setTimeout(function () {
    wx.hideLoading()
  }, 2000)
}
module.exports = {
  formatTime: formatTime,
  errorMsg:errorMsg,
  errorCallback:errorCallback
}
