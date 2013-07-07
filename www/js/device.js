var resize = function(){
	var windowHeight = window.screen.height;
	var bodyHeight = $(".ui-page-active").outerHeight();
	var diff = $(".ana .text").height() - bodyHeight - windowHeight;
	if(diff > 0){
		
		$(".ana .text").height(diff);

		if(device.platform == "Android" && parseInt(device.version) < 3){
			$(".ana .text").niceScroll();
		}
		else
		{
			$(".ana .text").css("overflow-y", "scroll");
		}
	}
	else
	{
		// cas où il faut mettre les puces en bas...
	}
}

$(function(){
	function onDeviceReady() {
		navigator.splashscreen.hide();
    }
    document.addEventListener("deviceready", onDeviceReady, false);
    $(window).load(function () {
    	resize();
    });
});