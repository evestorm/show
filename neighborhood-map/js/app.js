var script = document.createElement('script');
// script.type="text/javascript";
script.onerror = function(evt){
	alert('地图载入失败！');
};
script.src = 'https://webapi.amap.com/maps?v=1.3&key=655ef4fcc102bc461e3ee6ae96059f5c&callback=init';
document.getElementsByTagName('head')[0].appendChild(script);

var map, geolocation, lpoint, placeSearch;
function init() {
	map = new AMap.Map("container", {
		resizeEnable: true,
		mapStyle: 'amap://styles/whitesmoke' //样式URL
	});
	map.plugin('AMap.Geolocation', function() {
		geolocation = new AMap.Geolocation({
			enableHighAccuracy: true,//是否使用高精度定位，默认:true
			timeout: 10000,		  //超过10秒后停止定位，默认：无穷大
			buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			zoomToAccuracy: true,	  //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			buttonPosition:'LB'
		});
		map.addControl(geolocation);
		geolocation.getCurrentPosition();
		AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
		AMap.event.addListener(geolocation, 'error', onError);	  //返回定位出错信息
	});
	//解析定位结果
	function onComplete(data) {
		ViewModel.lng(data.position.getLng());
		ViewModel.lat(data.position.getLat());
		// 创建点位点
		lpoint = [data.position.getLng(),data.position.getLat()];
		// 按钮绑定搜索poi
		$("#all").click(function(){poi(lpoint[0],lpoint[1]);});
		$("#zs").click(function(){poi(lpoint[0],lpoint[1],'中式')});
		$("#rs").click(function(){poi(lpoint[0],lpoint[1],'日式')});
		$("#xs").click(function(){poi(lpoint[0],lpoint[1],'西式')});
		$("#kc").click(function(){poi(lpoint[0],lpoint[1],'快餐')});
		//调用搜索poi
		poi(lpoint[0],lpoint[1]);

		if(data.accuracy){
			ViewModel.accuracy(data.accuracy + '米');
		}//如为IP精确定位结果则没有精度信息
		ViewModel.isConverted(data.isConverted ? '是' : '否');
		//ajax获取ip定位城市
		var url = "https://restapi.amap.com/v3/ip?ip="+ returnCitySN.cip +"&output=json&key=8903b3d054ec85241b5c1e62da1e7961";
		$.getJSON(url,function(data){
			ViewModel.city(data.city);
		}).fail(function(e){
			alert("ip定位失败！");
		});
	}
	// 解析定位错误信息
	function onError(data) {
		document.getElementById('tip').innerHTML = '定位失败';
	}
	AMap.service(["AMap.PlaceSearch"], function() {
		placeSearch = new AMap.PlaceSearch({ //构造地点查询类
			pageSize: 10, //每页数量
			type: '餐饮服务',//兴趣点类别
			// pageIndex: 1, //页码
			map: map,//Map对象
			panel: panel,//结果容器id
			showCover: true,//结果范围
			autoFitView: true//自动调整地图
		});
	});
	//poi搜索
	function poi(lng,lat,type){
		var cpoint = [lng,lat]; //中心点坐标
		var type = type||"";
		placeSearch.searchNearBy(type, cpoint, 2000, function(status, result) {
			placeSearch.L.pageIndex=1;
			$(".poibox").click(function(){
				ViewModel.menu();
			});
		});
	};
}
// window.onload = loadJScript;  //异步加载地图
var ViewModel = {
	city:ko.observable(),
	lng:ko.observable(),
	lat:ko.observable(),
	accuracy:ko.observable(),
	isConverted:ko.observable(),
	//菜单显示切换
	menu:function(){
		$("#menu").toggleClass("active");
		$("#tip").toggleClass("active");
		$("#btnspan").toggleClass("glyphicon-chevron-left");
		$("#btnspan").toggleClass("glyphicon-chevron-right");
	},
	active:function(data,event){
		$(event.target).siblings().toggleClass("active",false);
		$(event.target).toggleClass("active",true);
	}
};
ko.applyBindings(ViewModel);