const app = getApp();
Page({
	data:{
		nav:"info",
		coach:null,
		courseList:[],
		coachCommentList:[]
	},
	nav:function(e){
		let nav = e.target.dataset.nav;
		this.setData({
			nav:nav
		})
	},
	"enablePullDownRefresh": false,
	onLoad:function(options){
		let that = this;
		wx.showNavigationBarLoading();
		wx.request({
	      url: app.apiServerURL + "/coach/detail.htm",
	      data: {accessToken:wx.getStorageSync("accessToken"),id:options.id},
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	console.log(res.data.data);
	      	if (res.data.retCode == '0') {
	      		that.setData({
					coach:res.data.data.coach,
					courseList:res.data.data.courseList,
					coachCommentList:res.data.data.coachCommentList
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
	},
	goLesson:function(e){
		let lessonId = e.currentTarget.dataset.id;
		let coachId = e.currentTarget.dataset.coachId;
		wx.navigateTo({
	    	url: '../lesson/detail?courseId='+lessonId+"&coachId="+coachId
	    })
	},
	goComment:function(e){
		let coachId = e.currentTarget.dataset.id;
		wx.navigateTo({
	    	url: '../coach/comment?id='+coachId
	    })
	},
	buy:function(e){
		let lessonId = e.currentTarget.dataset.id;
		let coachId = e.currentTarget.dataset.coachid;
		wx.navigateTo({
	    	url: '../lesson/buyLesson?courseId='+lessonId+"&coachId="+coachId
	    })
	}
})