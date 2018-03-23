const app = getApp();
Page({
	data:({
		curView:"card",
		tabView:"card"
	}),
	jump:function (e) {
		let target = e.currentTarget.dataset.id;
		this.setData({
	      curView: target,
	      tabView:target
	    })
	},
	/*
	scroll:function(e){
		let scrollTop = e.detail.scrollTop;
		let dataCurView = this.data.curView;
		let curView ='card';
		let scrollHeight = e.detail.scrollHeight;
		console.log(scrollHeight);
		if(scrollTop<scrollHeight/6){
			curView = 'card'
		}else if(scrollHeight/5>scrollTop && scrollTop<scrollHeight/6){
			curView = 'personalTraining'
		}else if(scrollHeight/4>scrollTop && scrollTop<scrollHeight/5){
			curView = 'lesson'
		}else if(scrollHeight/3>scrollTop && scrollTop<scrollHeight/4){
			curView = 'activity'
		}else if(scrollHeight/2>scrollTop && scrollTop<scrollHeight/1){
			curView = 'venues'
		}else{
			curView = 'my'
		}
		if(dataCurView !=curView){
			this.setData({
		      tabView: curView
		    })
		}
	},
	*/
	viewIntro:function(){
		wx.navigateTo({
	        url: '../index/intro'
	      })
	}
})