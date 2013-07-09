function iminClick () {
		$('button.letsgo').click(function () {
			$('.flip-container').toggleClass('hover');
			console.log('test');
		});
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
}
(function ($) {
	$.fn.changePage = function (page) {
		$.ajaxSetup ({
			cache: false
		});
		$.get(page, function (r) {
			console.log($(r).html());
			// // $('#page').css({position:'absolute',top:0,left:0,backfaceVisibility: 'hidden'});
			// $('body').apped($(r).html());
			// $('.deal').transition({
			// 	perspective: '1200px',
			// 	rotateY: '180deg'
			// }, function () {
			// 	// $('body').prop('class',$(r).find('#page').prop('class'));

			// 	$('.deal').transition({
			// 		perspective: '1200px',
			// 		rotateY: '180deg'
			// 	});
			// });
		});
		// $('body').load(page+ '#page', function () {
		// 	$('body').prop('class',$('#page').prop('class'));
		// 	$('body').transition({
		// 		perspective: '100px',
		// 		rotateY: '180deg'
		// 	});
		// });
	};
}(jQuery));

$(window).load(function () {
	$(window).bind('imin', iminClick);
});