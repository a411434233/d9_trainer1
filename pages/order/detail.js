const app = getApp();
Page({
	data:{
		orderCourse:null,
		couponList:null,
		qrcode:''
	},
	onLoad:function (options) {
		let that = this;
		wx.showNavigationBarLoading();
		let orderSn = options.orderSn;
		wx.request({
	      url: app.apiServerURL + "/order/detail.htm",
	      data: {accessToken:wx.getStorageSync("accessToken"),orderSn:orderSn},
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	console.log(res.data.data);
	      	if (res.data.retCode == '0') {
	      		that.setData({
					orderCourse:res.data.data.orderCourse,
					couponList:res.data.data.couponList,
					qrcode:app.apiServerURL+'/course/couponQRCode.htm?accessToken='+wx.getStorageSync("accessToken")+'&orderSn='+orderSn
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
		  	wx.hideNavigationBarLoading();
			util.errorCallback();
		  } 
	    }) 
	}

})