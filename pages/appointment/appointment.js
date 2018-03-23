const app = getApp();
const util = require('../../utils/util.js');
Page({
	data:{
		user:null,
    name:'',
    mobile:'',
    nameFocus:false,
    mobileFocus:false 
	},
  bindNameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindMobileInput: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
	apply:function() {
    var that = this;
    console.log(that);
    if(that.data.name=="" || that.data.name==undefined){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        nameFocus:true
      })
      return
    }
    if(that.data.mobile==""||that.data.mobile==undefined){
      wx.showToast({
        title: '请输入号码',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        mobileFocus:true
      })
      return
    }
		wx.request({
          url: app.apiServerURL + "/user/apply.htm",
          data: {
            version: app.version,
            accessToken: wx.getStorageSync("accessToken"),
            mobileNo:this.data.mobile,
            name:this.data.name,
            type:"appointment"
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.retCode != '0') {
              util.errorMsg(that, res);
              return;
            }
            wx.navigateTo({
              url: '../appointment/appointmentSuccess'
            })
          },
          error:function(){
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
	}
})