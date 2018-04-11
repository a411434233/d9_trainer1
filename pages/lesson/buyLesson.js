const app = getApp();
const util = require('../../utils/util.js');
Page({
	data:{
		course:null,
		coach:null,
		number:0,
		price:0,
		totalPrice:0
	},
	onLoad:function(option){
		let courseId = option.courseId;
		let coachId = option.coachId;
		let that = this;
		wx.showNavigationBarLoading();
		wx.request({
	      url: app.apiServerURL + "/order/lessonInfo.htm",
	      data: {accessToken:wx.getStorageSync("accessToken"),courseId:courseId,coachId:coachId},
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	console.log(res.data.data);
	      	if (res.data.retCode == '0') {
	      		let price = 0.00;
		      	switch(res.data.data.coach.level.toUpperCase()){
		      		case "P1":price = res.data.data.course.priceP1;break;
		      		case "P2":price = res.data.data.course.priceP2;break;
		      		case "P3":price = res.data.data.course.priceP3;break;
		      		default:break;
		      	}
	      		that.setData({
					coach:res.data.data.coach,
					course:res.data.data.course,
					price:price
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
	numberInput:function(event){
		let number = event.detail.value;
		if(number<0 || number==''){
			number = 0;
		}
		let totalPrice = number*this.data.price;
		this.setData({
			number:number,
			totalPrice:totalPrice
		})
	},
	sub:function(){
		let number = this.data.number;
		number--;
		if(number<0){
			number = 0;
		}
		let totalPrice = number*this.data.price;
		this.setData({
			number:number,
			totalPrice:totalPrice
		})
	},
	add:function(){
		let number = this.data.number;
		number++;
		if(number<0){
			number = 0;
		}
		let totalPrice = number*this.data.price;
		this.setData({
			number:number,
			totalPrice:totalPrice
		})
	},
	confirm:function(){
		let that = this;
		let courseId = that.data.course.id;
		let number = that.data.number;
		if(number=='' || number==0){
			wx.showToast({
		        title: "请选择私教券数量",
		        icon: 'none',
		    	duration: 2000
		    })
		    return;
		}
		let coachId = that.data.coach.id;
        const url = app.apiServerURL + '/order/createCourseOrder.htm';
        let accessToken = wx.getStorageSync("accessToken");
        wx.showLoading({
          title: '正在发起支付',
          mask: true
        }) 
        wx.request({
          url: url,
          data: {
            accessToken: accessToken,
            courseId: courseId,
            number: number,
            coachId: coachId
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
                  	wx.navigateTo({
				    	url: '../order/list'
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
	}
})