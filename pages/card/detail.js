const app = getApp();
const util = require('../../utils/util.js');
Page({
	data:{
		price:"",
		name:"",
		type:"",
        cardType:"",
		id:"",
		effect:"",
		typeName:""
	},
	onLoad: function (options) {
    	let that = this;
    	let params = JSON.parse(options.params);
    	let effect = "";
    	let typeName = "";
    	switch(params.type){
    		case "year":effect="一年内";typeName="年卡";break;
    		case "month":effect="一月内";typeName="月卡";break;
    		case "season":effect="一季度内";typeName="季卡";break;
    		case "unlimited":effect="终身";typeName="终身卡";break;
    		default:break;
    	}
    	that.setData({
    		price:params.price,
			name:params.name,
			type:"https://img.d9.konggeek.com/card/card_"+params.type+".png",
            cardType:params.type,
			id:params.id,
			effect:effect
    	})
    },
    payNow:function(e){
        let that = this;
        const url = app.apiServerURL + '/order/createMembershipOrder.htm';
        let type = e.currentTarget.dataset.type;
        let accessToken = wx.getStorageSync("accessToken");
        wx.showLoading({
          title: '正在加载',
          mask: true
        }) 
        wx.request({
          url: url,
          data: {
            accessToken: accessToken,
            type: type,
          },
          success: function (data) {
            wx.hideLoading();
            console.log(data)
            if (data.data.retCode == '0') {
              wx.showToast({
                title: '下单成功',
              });
              var responseData = data.data.data;
              wx.requestPayment({
                'timeStamp': responseData.timeStamp,
                'nonceStr': responseData.nonceStr,
                'package': responseData.package,
                'signType': 'MD5',
                'paySign': responseData.sign,
                'success': function (res) {
                  //成功，跳转到支付成功页面
                  wx.redirectTo({
                    url: '/pages/main/main'
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
              wx.showToast({
                title: data.data.errorMsg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function () {
            wx.hideLoading();
            util.errorCallback();
          }
        })
      }
})