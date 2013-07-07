var resize = function(){
	windowHeight = window.screen.height;
	bodyHeight = $(".ui-page-active").outerHeight();
	diff = (bodyHeight-windowHeight);
	if(diff > 0){
		ineH = $(".ana .text").height();
		$(".ana .text").height(ineH-diff);

		
		if(device.platform == "Android" && parseInt(device.version) < 3){
			$(".ana .text").niceScroll();
			console.log(device.platform+" niceScroll");
		}
		else
		{
			$(".ana .text").css("overflow-y", "scroll");
		}
	}
}

$(function(){
	function onDeviceReady() {
		resize();
        navigator.splashscreen.hide();
     }
     document.addEventListener("deviceready", onDeviceReady, false);
});