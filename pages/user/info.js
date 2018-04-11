const app = getApp();
Page({
	data:{
		user:null
	},
	nameInput:function(e){
		let user = this.data.user;
		user.nickName =e.detail.value;
		this.setData({
			user:user
		})
	},
	bindDateChange:function(e){
		let user = this.data.user;
		user.birthday =e.detail.value;
		this.setData({
			user:user
		})
	},
	signInput:function(e){
		let user = this.data.user;
		user.signature =e.detail.value;
		this.setData({
			user:user
		})
	},
	choseGender:function(e){
		let user = this.data.user;
		user.gender = e.currentTarget.dataset.type;
		this.setData({
			user:user
		})
	},
	onLoad:function(){
		let accessToken = wx.getStorageSync("accessToken");
		let that = this;
		wx.request({
	      url: app.apiServerURL + "/user/query.htm",
	      data: {accessToken:accessToken},
	      success: function (res) {
	      	if (res.data.retCode == '0') {
		        that.setData({
				    user: res.data.data
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
	        wx.showToast({
		        title: "网络异常",
		        icon: 'none',
		    	duration: 2000
		    })	
	      } 
	    })
	},
	upload:function(){
		let that = this;
		wx.chooseImage({
		  count: 1, // 默认9
		  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		  success: function (res) {
		    let tempFilePaths = res.tempFilePaths;
		    wx.showLoading({
		      title: '正在上传',
		      mask: true
		    }) 
		    wx.uploadFile({ 
		    	url:  app.apiServerURL + "/user/uploadAvatar.htm",
		    	filePath: tempFilePaths[0],
		    	name: 'avatar_temp',
		    	success: function(res){
		    		let resDate = JSON.parse(res.data);
		            if (resDate.retCode != '0') {
		              wx.showToast({
			              title: '上传失败',
			              icon: 'none',
			              duration: 2000
			            })
		              wx.hideLoading();
		              return;
		            }
			        let data = resDate.data;
			        let user = that.data.user;
			        user.avatarUrl = data;
			        that.setData({
                		user: user
				    })
				    updataUserInfo(user);
				    wx.hideLoading();
			    }
		    })
		  }
		})
	},
	submit:function(){
		let user = this.data.user;
		if(user.nickName==''){
			wx.showToast({
		        title: "昵称不能为空",
		        icon: 'none',
		    	duration: 2000
		    })
			return;
		}	
		updataUserInfo(user);	
	}
})
var updataUserInfo =  function(user){
	wx.request({
      url: app.apiServerURL + "/user/updateUserInfo.htm",
      data: user,
      success: function (res) {
      	console.log(res.data.data);
      	if (res.data.retCode == '0') {
	        wx.showToast({
		        title: "修改成功",
		        icon: 'none',
		    	duration: 2000
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
        wx.showToast({
	        title: "网络异常",
	        icon: 'none',
	    	duration: 2000
	    })	
      } 
    })
}