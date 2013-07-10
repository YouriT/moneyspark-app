function iminClick () {
		$('button.letsgo').click(function () {
			$('.flip-container').toggleClass('hover');
		});
		$('.imin').click(function(){
		$('.buydeal').toggleClass('active');
		if (!$('.buydeal').hasClass('active')) {
			setTimeout(function () { $('.buydeal').css({marginTop: 0}); }, 300);
			$("body").css("overflow-y", "hidden");
		}
		else {
			$('.buydeal').css({marginTop: -10/16+'em'});
			$("body").css("overflow-y", "hidden");
		}
	});
}

function calculateFee(obj, products) {

    $minFeeRate = 0.05;
    $maxFeeRate = 0.15;

    i = parseInt(obj.parents('.deal').attr('data-product'),10);
    prod = products.item(i);

    $ratioInvested = Math.round(prod.sumInvestedAmounts/prod.requiredAmount*100)/100;
    if($ratioInvested>1)$ratioInvested=1;
    $diff = $maxFeeRate - $minFeeRate;
    $feeRate = $minFeeRate+($ratioInvested*$diff);
    $b = Math.round(parseInt(obj.val(),10)/100)*0.01;
    $feeRate-$b < $minFeeRate ? $feeRate = $minFeeRate : $feeRate = $feeRate-$b;
    $feeRate = Math.round($feeRate*100);
    
    obj.parents('.deal').find('.fees:last').html($feeRate);
}

function eventCounts(name) {
	var arr = $._data($(window)[0], 'events');
	if (arr[name] == undefined)
		return 0;
	else
		return arr[name].length;
}

(function ($) {
	$.fn.changePage = function (page, direction) {
		$.ajaxSetup ({
			cache: false
		});
		$.get(page, function (r) {
			var mult = -1;
			if (direction == undefined) {
				direction = 'left';
			}
			if (direction == 'right') {
				mult = 1;
			}

			var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im
			var body = pattern.exec(r);
			if (body != null) {
				r = body[0].replace('<body','<div').replace('</body>','</div>');
			}
			var $page = $(r).find('#page');

			$page.prop('id','page2');
			if (direction === 'left') {
				$page.css({position:'absolute',left:$(window).width()+'px'});
			} else {
				$page.css({position:'absolute',left:-$(window).width()+'px'});
			}

			$page.width($(window).width());
			$page.height($(window).height());
			$page.parent().find('script').remove();
			$('#page').before($page.parent().html());
			$('#page').css('overflow','hidden');
			var add = 0;
			if ($('body').hasClass('menuvertical-push-toright')) {
				add = parseInt($('.menuvertical-push-toright').css('left'),10);
			}
			$('#page').transition({x:mult*($(window).width()-add)});
			$('#page2').transition({x:mult*($(window).width()-add)},function () {
				var $p2 = $('#page2');
				$('body').prop('class', $p2.prop('class'));
				$('body').attr('data-url', $p2.attr('data-url'));
				$('#page').remove();
				$p2.removeAttr('style');
				$p2.prop('id','page');
				$(window).trigger('pageCreated');
                $(window).trigger('pageLoader');
			});
		}, 'html');
	};
}(jQuery));

$(window).load(function () {
	$(window).bind('imin', iminClick);
	$(window).trigger("pageCreated");
});

$(window).on('pageCreated', function(){
	console.log("Current page: "+$('body').attr("data-url"));

	//All pages
	var menuClick = function() { 
		$('a').click(function (e) {
			e.preventDefault();
			var dir = 'left';
			if ($(this).attr('data-direction') === 'right')
				dir = 'right';

			if($(this).hasClass('needConnected')){
				//Check out if user is connected
				th = $(this);
				TableConfiguration.findValueByKey('token', function(r){ $(window).changePage(th.prop('href'), dir); }, 
														   function(e){ $(window).changePage("connexion.html", dir); });
			}
			else
				$(window).changePage($(this).prop('href'), dir);
		});
	};

	//Create menu
	TableConfiguration.findValueByKey("token", function(r){
		//Menu when connected
			$('.ensemble-menu').append('<a href="cash1.html" class="needConnected"><i class="icon-user iconmenu"></i></a><div class="inter-menu"></div>');
    		$('.ensemble-menu').append('<a href="cash1.html" class="needConnected"><i class="icon-lock iconmenu"></i></a><div class="inter-menu"></div>');
   			$('.ensemble-menu').append('<a href="cash1.html" class="needConnected"><i class="icon-bolt iconmenu"></i></a>');
   			$('.ensemble-menu').append('<div class="inter-menu"></div><a href="connexion.html" class="logout"><i class="icon-home iconmenu"></i></a>');
   			menuClick();
	}, function(e){
		//Menu when not connected
			$('.ensemble-menu').append('<a href="cash1.html" class="needConnected"><i class="icon-user iconmenu"></i></a><div class="inter-menu"></div>');
    		$('.ensemble-menu').append('<a href="cash1.html" class="needConnected"><i class="icon-lock iconmenu"></i></a><div class="inter-menu"></div>');
   			$('.ensemble-menu').append('<a href="cash1.html" class="needConnected"><i class="icon-bolt iconmenu"></i></a>');
   			menuClick();
	});

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
		var products;
        var prodIndex = -1;
        function parseProduct(prod, i)
        {
            prodObj = products.item(i);
            prod.find('.title').html(prodObj.title);
            prod.find('.hf-name').html(prodObj.hedgefundTitle);
            var funded = prodObj.sumInvestedAmounts / prodObj.requiredAmount;
            var fundedNumBar = funded > 1 ? 1 : funded;
            var fundedBar = prod.find('.progress-bar-hover').width()*fundedNumBar;
            prod.find('.progress-bar-hover').width('-='+fundedBar);
            prod.find('.progress-bar-hover').css({marginLeft:fundedBar});
            prod.find('.may-funded').before(Math.round(funded*10000)/100+'% ');
            var endFundDate = new Date(prodObj.dateBeginExpected.date);
            var today = new Date();
            var left = (endFundDate.getTime()/1000 - today.getTime()/1000)/(24*3600);
            var leftText = Math.round(left) > 1 ? Math.round(left)+' d' : Math.round(left) < 1 ? Math.round(left*24) > 1 ? Math.round(left*24)+' h' : Math.round(left*24)+' h' : '1 d';
            prod.find('.lock-time').html(leftText);
            prod.find('.ana > .text').html(prodObj.description);
            var endExpect = new Date(prodObj.dateEndExpected.date);
            var dealTime = (endExpect.getTime()/1000 - endFundDate.getTime()/1000)/(24*3600);
            var dealTimeText = Math.round(dealTime) > 1 ? Math.round(dealTime)+' days' : Math.round(dealTime) < 1 ? Math.round(dealTime*24) > 1 ? Math.round(dealTime*24)+' hours' : Math.round(dealTime*24)+' hour' : '1 day';
            prod.find('.sportwatch-time').html(dealTimeText);
            prod.find('.renta-expected').html('+'+prodObj.profitsRateExpected*100+'%');
            prod.find('.loss-expected').html('-'+prodObj.lossRateExpected*100+'%');
        }
        function createProducts ()
        {
            for (var i = 0; i < products.length; i++)
            {
                var newpage = $('#deal-model').html();
                $('#deal-model').before('<div id="deal'+i+'" data-product="'+i+'" class="deal" style="width:'+$('#deal-model').width()+'px;position:absolute;right:-'+$(window).width()+'px">'+newpage+'</div>');
                parseProduct($('#deal-model').prev(), i);
                $('#deal-model').prev().trigger('resize-product', $('#deal-model'));
                $('input[name="amount"]', $('#deal-model').prev()).keyup(function (e) {
                    calculateFee($(this), products);
                });
            }
            $(window).trigger('imin');
            $('.flip-container .front').width($('#deal-container').width());
            $('.flip-container .front').height($('#deal-container').height());
            $('#deal-model').hide();
            prodIndex = -1;
            changeProduct('next');
        }
        function changeProduct (toPage)
        {
            var toIndex = toPage === 'next' ? prodIndex+1 : prodIndex-1;
            if ((toIndex >= products.length && toPage === 'next') ||
                (toIndex < 0 && toPage === 'prev'))
            {
                alert('no more dude');
                return;
            }

            if ($('body').find('#deal'+toPage).length == 0)
            {
                var mult = 1;
                var margin = 0;
                if (toPage === 'next') {
                    mult = -1;
                }
                
                var cacheIndex = prodIndex;
                $('#deal' + toIndex).show();
                
                $('.pagenum').each(function () {
                    $(this).removeClass('active');
                    if (toIndex == 0 && $(this).index() == 0)
                        $(this).addClass('active');
                    else if (toIndex == products.length-1 && $(this).index() == 2)
                        $(this).addClass('active');
                    else if (toIndex != 0 && toIndex != products.length-1 && $(this).index() == 1)
                        $(this).addClass('active');
                });

                if (toIndex >= 0 && toIndex < products.length)
                    $('#deal' + toIndex).transition({x: '+='+(mult*($(window).width()+margin))}, function () {
                        $('#deal' + cacheIndex).hide();
                    });
                if (prodIndex >= 0 && prodIndex < products.length)
                    $('#deal' + prodIndex).transition({x: '+='+(mult*($(window).width()+margin))});
                prodIndex = toIndex;
            }
        }
        $('.pagenum').click(function () {
            if ($(this).index() == 2)
                changeProduct('next');
            else if ($(this).index() == 0)
                changeProduct('prev');
        });
        
        $(window).swipe({
            swipe: function(event, direction, distance, duration, fingerCount) {
                if (distance > $(window).width()*0.07) {
                    if (direction === 'right') {
                        changeProduct('prev');
                    } else {
                        changeProduct('next');
                    }
                }
            }
        });
		if (eventCounts('productsGranted') == 0) {
			$(window).on('productsGranted', function () {
				productsDb = new TableProducts();
	            productsDb.findAll(function (r) {
					products = r;
					createProducts();
                    setTimeout(function() {$(window).trigger('pageLoaded')},2000);
	            }, function (e) {

	            });
			});
		}
		$('#page').width($(window).width());
        $('#page').height($(window).height());
        var pad = $('.deal').width() - $('.deal').innerWidth();
        $('.buydeal').css({
            marginLeft: pad/2,
            marginRight: pad/2
        });

        $('#page').removeAttr('class');

        var middle = $('.container:last').width()/2 - $('.ensemble-pagenum-bottom-menu').width()/2 - $('.button-menuvertical').width();
        $('.ensemble-pagenum-bottom-menu').css({
            marginLeft: middle+'px'
        });

        $('#showLeftPush').click(function () {
            $('.menuvertical-push').toggleClass('menuvertical-push-toright');
            $('nav').toggleClass('menuvertical-left');
        });
	}

	$(window).trigger("askRetrieve");
});