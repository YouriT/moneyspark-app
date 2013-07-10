/*global device*/
var resizeProduct = function (obj) {
	var anaHeight = $(window).height() - $('.ana > .text', obj.target).offset().top - ($(window).height()*0.04+118+(0.62+0.75*16))/16*parseInt($('body').css('font-size'),10);
	$(".ana .text", obj.target).height(anaHeight);
	$(".ana .text", obj.target).niceScroll();
};

var globalLocale = "fr_BE";

function loader() {

	var loader = $('<div id="main-loader" class="loader big"><i class="icon-refresh icon-spin"></i></div>');
	loader.width($(window).width()*5);
	loader.css('left',-($(window).width()*2)+'px');
    $('body').prepend(loader);

    $('#page').css('-webkit-filter','blur(3px)');

	$(window).one('pageLoaded', function () {
		if (navigator.userAgent.indexOf('Apple') == -1)
			$('#page').css('-webkit-filter', 'blur(0px)');
		else
			$('#page').css('-webkit-filter', '');
		$('#main-loader').remove();
	});
}

function checkLocale() {
      navigator.globalization.getLocaleName(
        function (locale) { globalLocale = locale.value; }
      );
}
  		
function onDeviceReady() {
	if (device.platform.name !== undefined) {
		navigator.splashscreen.hide();
		checkLocale();
	}
	
}

document.addEventListener("deviceready", onDeviceReady, false);
$(window).load(function () {
	$(window).bind('resize-product', resizeProduct);
});	
$(window).ready(function () {
	loader();
});