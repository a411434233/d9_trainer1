const app = getApp();
Page({
	data: {
	    coachLish:[],
	    pageNum: 0
	},
	"enablePullDownRefresh":true,
	onLoad:function(){
		let that = this;
		wx.showNavigationBarLoading();
		ajaxLoad(0,this);
	},
	onReachBottom:function(){
		let that = this;
		wx.showNavigationBarLoading();
		ajaxLoad(that.data.pageNum,this);
	},
	detail:function(e){
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
	    	url: '../coach/detail?id='+id
	    })
	}
})
var ajaxLoad = function(pageNum,that){
	wx.request({
      url: app.apiServerURL + "/coach/list.htm",
      data: {accessToken:wx.getStorageSync("accessToken"),pageNum:pageNum},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
      		if(res.data.data.coachList ==null || res.data.data.coachList ==undefined ||res.data.data.coachList.length==0){
      			wx.showToast({
			        title: "没有更多数据",
			        icon: 'none',
			    	duration: 2000
			    });
			    return;
      		}
      		let coachLish = that.data.coachLish.concat(res.data.data.coachList);
      		console.log(coachLish);
	        that.setData({
	        	coachLish:coachLish,
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