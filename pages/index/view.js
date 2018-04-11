const app = getApp();
Page({
	data: {
	     goodsPictureList:[
	     	'https://img.d9.konggeek.com/intro/1.jpg',
	     	'https://img.d9.konggeek.com/intro/2.jpg',
	     	'https://img.d9.konggeek.com/intro/3.jpg',
	     	'https://img.d9.konggeek.com/intro/4.jpg',
	     	'https://img.d9.konggeek.com/intro/5.jpg',
	     	'https://img.d9.konggeek.com/intro/6.jpg',
	     	'https://img.d9.konggeek.com/intro/7.jpg',
	     	'https://img.d9.konggeek.com/intro/8.jpg',
	     	'https://img.d9.konggeek.com/intro/9.jpg',
	     	'https://img.d9.konggeek.com/intro/10.jpg',
	     	'https://img.d9.konggeek.com/intro/11.jpg',
	     	'https://img.d9.konggeek.com/intro/12.jpg',
	     	'https://img.d9.konggeek.com/intro/13.jpg',
	     	'https://img.d9.konggeek.com/intro/14.jpg',
	     	'https://img.d9.konggeek.com/intro/15.jpg'
	     ]
	},  
	"enablePullDownRefresh": false,
	imgZoom: function(event) {
		var that = this;
		var imgList = that.data.goodsPictureList; //获取data-list
		var src = imgList[event.currentTarget.dataset.id]; //获取data-src
		//图片预览
		console.log(src);
		wx.previewImage({
			current: src,
			urls: imgList// 需要预览的图片http链接列表
		})
	}
})