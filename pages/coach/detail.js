const app = getApp();
Page({
	data:{
		nav:"info"
	},
	nav:function(e){
		let nav = e.target.dataset.nav;
		this.setData({
			nav:nav
		})
	},
	"enablePullDownRefresh": false
})