const app = getApp();
const util = require('../../utils/util.js');
Page({
	data:{
		user:null,
    	name:'',
    	mobile:'',
    	image:'../../images/upload.png',
    	serverImgUrl:'',
    	isUpload:false
	},
  	bindNameInput: function(e) {
	    this.setData({
	      name: e.detail.value
	    })
	  },
	bindMobileInput: function(e) {
	   this.setData({
	      mobile: e.detail.value
	    })
	},
	choseImg:function(){
		console.log(3);
		var that = this;
		wx.chooseImage({
		  count: 1, // 默认9
		  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		  sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
		  success: function (res) {
		    var tempFilePaths = res.tempFilePaths;
		    wx.uploadFile({ 
		    	url:  app.apiServerURL + "/user/uploadAvatar.htm",
		    	filePath: tempFilePaths[0],
		    	name: 'avatar_temp',
		    	success: function(res){
            console.log(res)
		    		var resDate = JSON.parse(res.data);
		            if (resDate.retCode != '0') {
		              wx.showToast({
			              title: '上传失败',
			              icon: 'none',
			              duration: 2000
			            })
		              return;
		            }
			        var data = resDate.data;
			        that.setData({
                image: data,
				    	isUpload:true,
				    	serverImgUrl:data
				    })
			    }
		    })
		  }
		})
	},
	apply:function() {
	    var that = this;
	    console.log(that);
	    if(that.data.name=="" || that.data.name==undefined){
	      wx.showToast({
	        title: '请输入姓名',
	        icon: 'none',
	        duration: 2000
	      })
	      that.setData({
	        nameFocus:true
	      })
	      return
	    }
	    if(that.data.serverImgUrl==""){
	    	wx.showToast({
		        title: '请选择图片',
		        icon: 'none',
		        duration: 2000
		      })
	    	return
	    }
	    if(that.data.mobile==""||that.data.mobile==undefined){
	      wx.showToast({
	        title: '请输入号码',
	        icon: 'none',
	        duration: 2000
	      })
	      that.setData({
	        mobileFocus:true
	      })
	      return
	    }
	   	 wx.request({
          url: app.apiServerURL + "/user/apply.htm",
          data: {
            version: app.version,
            accessToken: wx.getStorageSync("accessToken"),
            mobileNo:this.data.mobile,
            name:this.data.name,
            avatar:this.data.serverImgUrl,
            type:"apply"
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.retCode != '0') {
              util.errorMsg(that, res);
              return;
            }
            wx.navigateTo({
              url: '../apply/applySuccess'
            })
          },
          error:function(){
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
	}        	
})