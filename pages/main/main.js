const app = getApp();
var getQRCodeToken = function(that){
	wx.request({
      url: app.apiServerURL+"/user/myQRCode.htm",
      data: {accessToken:wx.getStorageSync("accessToken")},
      success: function (res) {
      	that.setData({
          qrcode:app.apiServerURL+"/user/myQRCode.htm?accessToken="+wx.getStorageSync("accessToken")
        })
      },
      fail:function(res){}
    })
}
Page({
	data:({
		curView:"card",
		tabView:"card",
		user:null,
		membershipCardList:null,
		qrcode:'',
		openQrcode:'',
		option:'',
		apply:false,
		orderList:[]
	}),
	jump:function (e) {
		let target = e.currentTarget.dataset.id;
		this.setData({
	      curView: target,
	      tabView:target
	    })
	},
	openQrcode:function(){
		let that = this;
		this.setData({
	      openQrcode: true,
	      option:''
	    })
	    getQRCodeToken(that); 
		var t1 = setInterval(function(){
			let option = that.data.option;
			if(option=="cancle"){
				clearInterval(t1);
				return;
			}
			wx.request({
		      url: app.apiServerURL + "/user/getQRCodeToken.htm",
		      data: {accessToken:wx.getStorageSync("accessToken")},
		      success: function (res) {
		      	wx.hideLoading();
		      	if (res.data.retCode == '0') {
			        if(res.data.data!=undefined){
			        	if(res.data.data.state=="used"){
			        		clearInterval(t1);
				        	var t2 = setInterval(function(){
				        		wx.request({
							      url: app.apiServerURL + "/order/queryUnpaidOnetimeOrder.htm",
							      data: {accessToken:wx.getStorageSync("accessToken")},
							      success: function (res) {
							      	wx.hideLoading();
							      	if (res.data.retCode == '0') {
							      		clearInterval(t2);
								        if(res.data.data){
								        	let orderSn = res.data.data.orderSn;
									        const url = app.apiServerURL + '/order/singlePay.htm';
									        let accessToken = wx.getStorageSync("accessToken");
									        wx.showLoading({
									          title: '正在加载',
									          mask: true
									        }) 
									        wx.request({
									          url: url,
									          data: {
									            accessToken: accessToken,
									            orderSn: orderSn,
									          },
									          success: function (data) {
									            wx.hideLoading();
									            console.log(data)
									            if (data.data.retCode == '0') {
									              wx.showToast({
									                title: '正在支付',
									              });
									              var responseData = data.data.data;
									              wx.requestPayment({
									                'timeStamp': responseData.timeStamp,
									                'nonceStr': responseData.nonceStr,
									                'package': responseData.package,
									                'signType': 'MD5',
									                'paySign': responseData.sign,
									                'success': function (res) {
									                  that.setData({
												      	openQrcode: ''
												      })
									                },
									                'fail': function (res) {
									                  wx.showToast({
									                      title: '支付失败',
									                      icon: 'none',
									                      duration: 2000
									                  })
									                }
									              })
									            } else {
									              wx.hideLoading();
									              util.errorMsg(that, data);
									            }
									          },
									          fail: function () {
									            wx.hideLoading();
									            util.errorCallback();
									          }
									        })
								        }else{
								        	that.setData({
										      	openQrcode: ''
										      })
								        	wx.showToast({
										        title: "扫码成功",
										        icon: 'none',
										    	duration: 2000
										    })
								        }
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
									wx.hideLoading();
								  } 
							    })  
				        	},3000)
						}
			        }else{
			        	getQRCodeToken(that);
			        }
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
				wx.hideLoading();
			  } 
		    })  
		},3000);
	},
	closeQrcode:function(){
		this.setData({
	      openQrcode: '',
	      option:'cancle'
	    })
	},
	viewIntro:function(){
		wx.navigateTo({
	    	url: '../index/view'
	    })
	},
	cardList:function(){
		wx.navigateTo({
	    	url: '../card/list'
	    })
	},
	order:function(){
		wx.navigateTo({
	    	url: '../order/list'
	    })
	},
	apply: function() {
		var apply = this.data.apply;
	    if(apply){
	      wx.navigateTo({
	        url: '../index/success'
	      })
	    }else{
	      wx.navigateTo({
	        url: '../apply/apply'
	      })
	    }
	},
	detail:function(e){
		let orderSn = e.currentTarget.dataset.sn;
		wx.navigateTo({
	    	url: '../order/detail?orderSn='+orderSn
	    })
	},
	coach:function(){
		wx.navigateTo({
			url: '../coach/list'
		})
	},
	setting:function(){
		wx.navigateTo({
			url: '../user/info'
		})
	},
	lesson:function(){
		wx.navigateTo({
			url: '../teamLesson/list'
		})
	},
	onShow:function(){
		let that = this;
		wx.showLoading({
	      title: '正在加载',
	      mask: true
	    }) 
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
			              wx.showToast({
					          title: res.data.errorMsg,
					        })
			              return;
			            } 
			            let user = res.data.data.user;
			            let apply = res.data.data.apply;
			            if(user.mobileNo==""|| user.mobileNo==undefined){
			            	wx.navigateTo({
						    	url: '../user/reg'
						    })
			            }
			            let accessToken = user.accessToken;
			            wx.setStorageSync('accessToken', accessToken);
			            that.setData({
			              user: user,
			              apply:apply,
			              qrcode:app.apiServerURL+"/user/myQRCode.htm?accessToken="+wx.getStorageSync("accessToken")
			            })
			            wx.request({
						      url: app.apiServerURL + "/index/index.htm",
						      data: {accessToken:wx.getStorageSync("accessToken")},
						      success: function (res) {
						      	wx.hideLoading();
						      	if (res.data.retCode == '0') {
							        console.log(res.data.data)
							        that.setData({
							        	membershipCardList:res.data.data.membershipCardList,
							        	orderList:res.data.data.orderCourseList
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
								wx.hideLoading();
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