const app = getApp();
Page({
	data:({
		curView:"card",
		tabView:"card",
		user:null,
		membershipCardList:null
	}),
	jump:function (e) {
		let target = e.currentTarget.dataset.id;
		this.setData({
	      curView: target,
	      tabView:target
	    })
	},
	viewIntro:function(){
		wx.navigateTo({
	    	url: '../index/intro'
	    })
	},
	cardList:function(){
		wx.navigateTo({
	    	url: '../card/list'
	    })
	},
	apply: function() {
		wx.navigateTo({
			url: '../apply/apply'
		})
	},
	coach:function(){
		wx.navigateTo({
			url: '../coach/list'
		})
	},
	onShow:function(){
		let that = this;
		wx.login({
		    success: res => {
		        wx.request({
				    url: app.apiServerURL + "/user/wechatXcxLogin.htm",
				    data: {
				        version: app.version,
				        "code": res.code
				    },
				    success: function (res) {
			            if (res.data.retCode != '0') {
			              return;
			            } 
			            var user = res.data.data.user;
			            if(user.mobileNo==""|| user.mobileNo==undefined){
			            	wx.navigateTo({
						    	url: '../user/reg'
						    })
			            }
			            var accessToken = user.accessToken;
			            wx.setStorageSync('accessToken', accessToken);
			            that.setData({
			              user: user
			            })
			            app.requestAndUpdateUserInfo();   
			            wx.request({
						      url: app.apiServerURL + "/index/index.htm",
						      data: {accessToken:wx.getStorageSync("accessToken")},
						      success: function (res) {
						      	if (res.data.retCode == '0') {
							        console.log(res.data.data)
							        that.setData({
							        	membershipCardList:res.data.data.membershipCardList
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
			},
	        fail: function (res){
		        wx.showToast({
		          title: '登录小程序失败',
		        })
		    }
		})
	}
})