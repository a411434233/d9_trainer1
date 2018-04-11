const app = getApp();
Page({
	data:{
		coachCommentList:[],
	    pageNum: 0,
	    coachId:''
	},
	"enablePullDownRefresh":true,
	onLoad:function(option){
		this.setData({
			coachId : option.id
		})
		wx.showNavigationBarLoading();
		ajaxLoad(0,this);
	},
	onReachBottom:function(){
		wx.showNavigationBarLoading();
		ajaxLoad(this.data.pageNum,this);
	}
})
var ajaxLoad = function(pageNum,that){
	wx.showNavigationBarLoading();
	wx.request({
      url: app.apiServerURL + "/coach/commentList.htm",
      data: {accessToken:wx.getStorageSync("accessToken"),id:that.data.coachId,pageNum:that.data.pageNum},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	console.log(res.data.data);
      	if (res.data.retCode == '0') {
      		if(res.data.data ==null || res.data.data ==undefined ||res.data.data.length==0){
      			wx.showToast({
			        title: "没有更多数据",
			        icon: 'none',
			    	duration: 2000
			    });
			    return;
      		}
      		let coachCommentList = that.data.coachCommentList.concat(res.data.data);
      		that.setData({
				coachCommentList:res.data.data
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