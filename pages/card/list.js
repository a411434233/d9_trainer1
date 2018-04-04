const app = getApp();
Page({
	data: {
	     cardList:null
	},
	onLoad:function(){
		var that = this;
		wx.request({
	      url: app.apiServerURL + "/index/memberCardList.htm",
	      data: {accessToken:wx.getStorageSync("accessToken")},
	      success: function (res) {
	      	if (res.data.retCode == '0') {
		        that.setData({
		        	cardList:res.data.data
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
	},
	detail:function(e){
		let params = new Object();
		params.id = e.currentTarget.dataset.id;
		params.price = e.currentTarget.dataset.price;
		params.type = e.currentTarget.dataset.type;
		params.name =  e.currentTarget.dataset.name;
		let paramsJson = JSON.stringify(params)
		wx.navigateTo({
	    	url: '../card/detail?params='+paramsJson
	    })
	}
})