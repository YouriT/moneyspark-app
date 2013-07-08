$(function(){
	/*global device*/
	/*global console*/
	var resize = function(){
		var windowHeight = $(window).height();
		var diff = windowHeight - $(".ana .text",this).offset().top - (windowHeight - $('.bordertop:last',this).offset().top) - $('.bottom-menu').height();
console.debug(diff);
		if(diff > 0) {
			$(".ana .text",this).height(diff);

			
			// if(device && device.platform === "Android" && parseInt(device.version, 10) < 3) {
			// 	$(".ana .text",this).niceScroll();
			// }
			// else {
				$(".ana .text",this).css("overflow-y", "scroll");
			// }
		}
		else {
			var heightDiff = $(window).height() - $('.ensemble-pagenum-bottom-menu').position().top - $('.ensemble-pagenum-bottom-menu').height() - parseInt($('.ensemble-pagenum-bottom-menu').css('marginTop'), 10) - parseInt($('.ensemble-pagenum-bottom-menu').css('marginBottom'), 10);
			$(".ana .text",this).height($(".ana .text",this).height()+heightDiff);
		}
	};

	function onDeviceReady() {
		navigator.splashscreen.hide();
	}
	
	document.addEventListener("deviceready", onDeviceReady, false);
	$(window).load(function () {
		$(document).bind('resize', resize);
	});
});