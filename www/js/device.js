$(function(){
	/*global device*/

	var resize = function(){
		var windowHeight = window.screen.height;
		var bodyHeight = $(".ui-page-active").outerHeight();
		var diff = $(".ana .text").height() - bodyHeight - windowHeight;
		if(diff > 0) {
			
			$(".ana .text").height(diff);

			if(device.platform === "Android" && parseInt(device.version, 10) < 3){
				$(".ana .text").niceScroll();
			}
			else {
				$(".ana .text").css("overflow-y", "scroll");
			}
		}
		else {
			var heightDiff = $(window).height() - $('.ensemble-pagenum').position().top - $('.ensemble-pagenum').height() - parseInt($('.ensemble-pagenum').css('marginTop'), 10) - parseInt($('.ensemble-pagenum').css('marginBottom'), 10);
			$(".ana .text").height($(".ana .text").height()+heightDiff);
		}
	};

	function onDeviceReady() {
		navigator.splashscreen.hide();
	}
	
	document.addEventListener("deviceready", onDeviceReady, false);
	$(window).load(function () {
		resize();
	});
});