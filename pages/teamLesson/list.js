const app = getApp();
const util = require('../../utils/util.js');
Page({
	data:{
		groupList:[]
	},
	onLoad:function(){
		let that = this;
		wx.showNavigationBarLoading();
		ajaxLoad(0,this);
	},
	detail:function(e){
		let orderSn = e.currentTarget.dataset.id;
		wx.navigateTo({
	    	url: '../teamLesson/detail?id='+id
	    })
	}
})
var ajaxLoad = function(pageNum,that){
	wx.request({
	      url: app.apiServerURL + "/course/groupList.htm",
	      data: {accessToken:wx.getStorageSync("accessToken")},
			    success: function (res) {
		      	wx.hideNavigationBarLoading();
		      	console.log(res.data);
		      	if (res.data.retCode == '0') {
		      		if(res.data.data.orderCourseList ==null || res.data.data.orderCourseList ==undefined ||res.data.data.orderCourseList.length==0){
		      			wx.showToast({
					        title: "没有更多数据",
					        icon: 'none',
					    	duration: 2000
					    });
					    return;
		      		}
		      		let orderList = that.data.orderList.concat(res.data.data.orderCourseList);
			        that.setData({
			        	orderList:orderList,
			        	pageNum:pageNum+1
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