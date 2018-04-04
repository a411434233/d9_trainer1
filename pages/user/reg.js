const util = require('../../utils/util.js');
const app = getApp();
Page({
	data:{
		agree:"unChose",
		mobile:'',
		code:'',
		time:60,
		disable:'',
		countdown:0,
		txt:"获取",
		mobileFocus:true,
		codeFocus:false
	},
	mobileInput:function(e){
		let mobile = e.detail.value;
		this.setData({
			mobile:mobile
		})
	},
	codeInput:function(e){
		let code = e.detail.value;
		this.setData({
			code:code
		})
	},
	choseAgree:function(e){
		let agreeState = this.data.agree;
		let state = agreeState === "unChose"?"chose":"unChose";
		this.setData({
			agree:state
		})
	},
	sendMsg:function(e){
		var that = this,
	    countdown;
		var params = new Object();
		params.mobileNo = that.data.mobile;
		params.type = "bindMobile";
		params.accessToken =  wx.getStorageSync("accessToken");
		if(this.data.mobile==""){
			wx.showToast({
		        title: '请输入号码',
		        icon: 'none',
		    	duration: 2000
		    })
			that.setData({
		    	mobileFocus:true
		    })
		    return false;
		}
		wx.request({
	      url: app.apiServerURL + "/user/checkCode.htm",
	      data: params,
	      success: function (res) {
	      	if (res.data.retCode == '0') {
		        that.setData({
				    disable: "disable",
				    time: 60
				}) 
				countdown = setInterval(function() {
				    var time = that.data.time;
				    if (time == 1) {
				        clearInterval(that.data.countdown);
				        that.setData({
				            disable: "",
				            txt:"获取"
				        })
				    } else {
				        that.setData({
				            time: --time,
				            txt:time+"s"
				        })
				    }
				},1000) 
				that.setData({
				    countdown: countdown
				})
		    }else {
	          that.setData({
	            disable: "",
	            txt:"获取"
	          })
	          wx.showToast({
			        title: res.data.errorMsg,
			        icon: 'none',
			    	duration: 2000
			    })
	        }
	       },
	      fail: function () {
	        util.errorCallback();
	        that.setData({
	          disable: ""
	        })
	      } 
	    })
	},
	bindMobile:function(){
		var that = this;
		var params = new Object();
		params.mobileNo = that.data.mobile;
		params.checkCode = that.data.code;
		params.accessToken =  wx.getStorageSync("accessToken");
		if(that.data.mobile==""){
			wx.showToast({
		        title: '请输入号码',
		        icon: 'none',
		    	duration: 2000
		    })
			that.setData({
		    	mobileFocus:true
		    })
		    return false;
		}
		if(that.data.code==""){
			wx.showToast({
		        title: '请输入验证码',
		        icon: 'none',
		    	duration: 2000
		    })
			that.setData({
		    	codeFocus:true
		    })
		    return false;
		}
		if(that.data.agree=="unChose"){
			wx.showToast({
		        title: '请勾选用户协议',
		        icon: 'none',
		    	duration: 2000
		    })
		    return false;
		}
		wx.request({
	      url: app.apiServerURL + "/user/bindMobileNo.htm",
	      data: params,
	      success: function (res) {
	      	if (res.data.retCode == '0') {
		        wx.navigateTo({
			    	url: '../main/main'
			    })
		    }else {
	            wx.showToast({
			        title: res.data.errorMsg,
			        icon: 'none',
			    	duration: 2000
			    })
	        }
	      },
		  fail: function () {
			util.errorCallback();
		  } 
	    })
	}
})