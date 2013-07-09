$(function(){
	/*global device*/
	var resizeProduct = function (obj) {
		var anaHeight = $(window).height() - $('.ana > .text', obj.target).offset().top - ($(window).height()*0.04+118+(0.62+0.75*16))/16*parseInt($('body').css('font-size'),10);
		$(".ana .text", obj.target).height(anaHeight);
		$(".ana .text", obj.target).niceScroll();
	};

	function onDeviceReady() {
		if (device.platform.name === '') {
			navigator.splashscreen.hide();
		}
	}
	
	document.addEventListener("deviceready", onDeviceReady, false);
	$(window).load(function () {
		$(window).bind('resize-product', resizeProduct);
	});
});