$(function(){
	/*global device*/
	var resize = function(){
		var anaHeight = $(window).height() - $('.ana > .text').offset().top - ($(window).height()*0.04+118+(0.62+0.75*16))/16*parseInt($('body').css('font-size'),10);
		$(".ana .text").height(anaHeight);

		
		// if(device && device.platform === "Android" && parseInt(device.version, 10) < 3) {
			$(".ana .text").niceScroll();
		// }
		// else {
		// 	$(".ana .text").css({'overflow-y': 'scroll'});
		// }
	};

	function onDeviceReady() {
		navigator.splashscreen.hide();
	}
	
	document.addEventListener("deviceready", onDeviceReady, false);
	$(window).load(function () {
		resize();
	});
});