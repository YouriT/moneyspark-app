$('.imin').click(function(){
	$('.buydeal').toggleClass('active');
	if (!$('.buydeal').hasClass('active')) {
		setTimeout(function () {$('.buydeal').css({marginTop: 0});}, 300);
		$("body").css("overflow-y", "hidden");
	}
	else {
		$('.buydeal').css({marginTop: -10/16+'em'});
		$("body").css("overflow-y", "hidden");
	}
});