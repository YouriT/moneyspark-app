function iminClick () {
		$('button.letsgo').click(function () {
			$('.flip-container').toggleClass('hover');
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
			var $page = $(r).find('#page');
			$page.prop('id','page2');
			$page.css({position:'absolute',left:$(window).width()+'px'});
			$page.width($(window).width());
			$page.height($(window).height());
			$('#page').before($page.parent().html());
			$('#page').css('overflow','hidden');
			var add = 0;
			if ($('body').hasClass('menuvertical-push-toright')) {
				add = parseInt($('.menuvertical-push-toright').css('left'),10);
			}
			$('#page').transition({x:-$(window).width()-add});
			$('#page2').transition({x:-$(window).width()-add},function () {
				var $p2 = $('#page2');
				$('body').prop('class',$p2.prop('class'));
				$('#page').remove();
				$p2.removeAttr('style');
				$p2.prop('id','page');
				$(window).trigger('pageCreated');
			});
		});
	};
}(jQuery));

$(window).load(function () {
	$(window).bind('imin', iminClick);
	$(window).trigger("pageCreated");
});

$(window).on('pageCreated', function(){

	console.log("Current page: "+$('body').attr("data-url"));
	//Page login
	if($('body').attr("data-url") == "login"){
		$('form[name=login]').submit(function(){
				var email = $(this).find('input[name=email]').val();
				var password = $(this).find('input[name=password]').val();
				auth = new Auth();
		        auth.login(email, password, function(){ $(window).changePage("cash1.html"); }, function(){ $('.popupLogin').fadeIn('fast'); });
		        return false;
		});
	}

	//Page deals
	if($('body').attr("data-url") == "deals"){
		$(window).on('productsGranted', function(){
			//Display products on index !
		});
	}


	$(window).trigger("askRetrieve");
});