const app = getApp();
Page({
	data:{
		price:"",
		name:"",
		type:"",
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
			id:params.id,
			effect:effect
    	})
    }
})