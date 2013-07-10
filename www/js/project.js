(function ($) {
    $.fn.changePage = function (page, direction) {
        $.ajaxSetup ({
            cache: false
        });
        loader();
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
                var copyClasses = $p2.prop('class');
                $p2.removeAttr('class');
                $('body').prop('class', copyClasses);
                $('body').attr('data-url', $p2.attr('data-url'));
                $('#page').remove();
                $p2.css({
                    position: '',
                    left: '',
                    transform: ''
                });
                $p2.prop('id','page');
                $(window).trigger('pageCreated');
                $(window).trigger('pageLoader');
            });
        }, 'html');
    };
}(jQuery));

var products;
function iminClick () {
        var amountInvest = 0;
        var prod;
        $('.check-little-grey:not(.no-change)').click(function () {
            $(this).toggleClass('active');
        });
        $('.validate').click(function () {
            var termsOk = true;
            $('.terms, .risk, .claim').each(function () {
                if (!$(this).hasClass('active')) {
                    termsOk = false;
                }
            });
            if (!termsOk) {
                alert('No risk, no return !');
            } else {
                new Ajax("investment", function(r) { 
                    alert(r.message);
                    $(window).changePage('user_profile.html');
                }, {amount: amountInvest, idProduct: prod.id}, 'POST');
            }
        });
		$('button.letsgo').click(function () {
            var amountText = $(this).parents('.buydeal').find('input[name=amount]').val();
            if (amountText !== '' && !isNaN(amountText) && parseInt(amountText,10) > 0) {
                $this = $(this);
                amountInvest = parseInt(amountText);
                TableConfiguration.findValueByKey('token', function(r) {
                    $back = $('.flip-container').find('.back');
                    $back.height($(window).height() - $back.offset().top - $('.bottom-menu').outerHeight() - parseInt($back.css('padding-top'),10)*2);

                    prod = products.item($('.front > .deal').index($this.parents('.deal')));
                    $('.resume-amount').text(amountInvest);
                    $('.resume-product-name').text(prod.title);
                    $('.resume-hedgefund').text(prod.hedgefundTitle);
                    $('.resume-max-loss').text(prod.lossRateExpected*100);
                    $('.resume-max-loss-amount').text(Math.round(prod.lossRateExpected*amountInvest*100)/100);
                    $('.resume-max-gain').text(prod.profitsRateExpected*100);
                    $('.resume-max-gain-amount').text(Math.round(prod.profitsRateExpected*amountInvest*100)/100);
                    $('.resume-fee').text($this.parents('.buydeal').find('.fees:last').text());
                    $('.resume-user-cash').text();

                    $('.flip-container').toggleClass('hover');
                },
                function(e) {
                    $(window).changePage("connexion.html", "left"); 
                });
            }
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

$(window).load(function () {
	$(window).bind('imin', iminClick);
	$(window).trigger("pageCreated");
});

var redirectPageAfterLogin = "index.html";
var inputObject = new Input();

$(window).on('pageCreated', function(){
	console.log("Current page: "+$('body').attr("data-url"));

	//All pages
	var menuClick = function() { 
		$('a').click(function (e) {
			e.preventDefault();
            if ($(this).prop('href').indexOf('#') !== -1)
                return false;

			var dir = 'left';
			if ($(this).attr('data-direction') === 'right')
				dir = 'right';

			if($(this).hasClass('needConnected')){
				//Check out if user is connected
				th = $(this);
				TableConfiguration.findValueByKey('token', function(r){ $(window).changePage(th.prop('href'), dir); }, 
														   function(e){
														   		redirectPageAfterLogin=th.prop('href');
														   		$(window).changePage("connexion.html", dir); 
														   });
			}
			else if($(this).hasClass('logout')){
				TableConfiguration.delete("token", function(){
					$(window).changePage("connexion.html", dir);
				});
			}
			else
				$(window).changePage($(this).prop('href'), dir);
		});
	};

	var menuCreate = function(connected){
		$('.ensemble-menu').append('<a href="signin.html" class="needConnected"><i class="icon-user iconmenu"></i></a><div class="inter-menu"></div>');
    	$('.ensemble-menu').append('<a href="cash1.html" class="needConnected"><i class="icon-lock iconmenu"></i></a><div class="inter-menu"></div>');
   		$('.ensemble-menu').append('<a href="about.html"><i class="icon-bolt iconmenu"></i></a>');
   		$('.ensemble-menu').append('<div class="inter-menu"></div><a href="index.html"><i class="icon-home iconmenu"></i></a>');
		if(connected){
			$('.ensemble-menu').append('<div class="inter-menu"></div><a href="index.html" class="logout"><i class="icon-power-off iconmenu"></i></a>');
		}

	};
	//Create menu
	TableConfiguration.findValueByKey("token", function(r){
		//Menu when connected
			menuCreate(true);
   			menuClick();
	}, function(e){
		//Menu when not connected
			menuCreate(false);
   			menuClick();
	});

	//Page login
	if($('body').attr("data-url") == "login"){
		$('form[name=login]').submit(function(){
			var email = $(this).find('input[name=email]').val();
			var password = $(this).find('input[name=password]').val();
			auth = new Auth();
	        auth.login(email, password, function(){ $(window).changePage(redirectPageAfterLogin); }, function(){ $('.popupLogin').fadeIn('fast'); });
	        return false;
		});
	}

	//Page profile
	if($('body').attr("data-url") == "profile"){
		var dealresumehgt = $(window).height() - $('#profileContainer').offset().top - $('.bottom-menu').outerHeight();
        $('#profileContainer').height(dealresumehgt);
    }


	//Page deals
	if($('body').attr("data-url") == "deals"){
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

                if (toIndex >= 0 && toIndex < products.length && $('#deal' + toIndex).length > 0)
                    $('#deal' + toIndex).transition({x: '+='+(mult*($(window).width()+margin))}, function () {
                        $('#deal' + cacheIndex).hide();
                    });
                if (prodIndex >= 0 && prodIndex < products.length && $('#deal' + prodIndex).length > 0)
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
		if (eventCounts('productsGranted') == 0) {
			$(window).on('productsGranted', function () {
				productsDb = new TableProducts();
	            productsDb.findAll(function (r) {
					products = r;
					createProducts();
                    $(window).trigger('pageLoaded');
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
	}

    //Page register
    if($('body').attr("data-url") == "register") {
        $('#signin-slider > div').width($('#signin-slider').parents('.container').width());
        $('#signin-slider > div:not(.active)').each(function () {
            $(this).css('right',-$(window).width());
        });
        function slideSignin(direction) {
            var $this = $('.slide.active');
            var margin = parseInt($this.parents('.container').css('margin-left'),10);
            var slideLength = ($(window).width() + margin);
            if ($this.next().length > 0 && direction == 'next') {
                $this.transition({x: '-='+slideLength}).removeClass('active');
                $this.next().transition({x: '-='+slideLength}).addClass('active');
            } else {
                $this.transition({x: '+='+slideLength}).removeClass('active');
                $this.prev().transition({x: '+='+slideLength}).addClass('active');
            }
            $('#signin-step > a.active').toggleClass('active');
            $('#signin-step > a').eq($('.slide').index($('.slide.active'))).toggleClass('active');
        }
        $('input[name=birthDate]').keypress(function(e){
        	t = $(this);
        	if(e.which != 13){
        		if(t.val().length == 2 || t.val().length == 5){
        			t.val(t.val()+"/");
        		}
        	}
        });

        function keyAt(obj, index) {
    		var i = 0;
    		for (var key in obj) {
        		if ((index || 0) === i++) return key;
    		}
		}

        $('button.signin').click(function () {
        	nb = $('.active').find('input').length;
        	current = 0;
        	$('.active').find('input').each(function(){
        		obj = $(this);
        		inputObject.set(obj);      	
        		if(inputObject.validate() != "good"){
        			alert("Error"+" "+obj.attr("name")+" : "+inputObject.validate());
        			return;
        		}
        		else
        		{
        			current++;
        			if(nb==current){
        				current=0;
        				//Next if not last step
        				if($('.active').index() <= 1 ){
        					slideSignin('next');
        				}
        				else //Last step !
        				{
        					//Send if last step
        					birthD = $('input[name=birthDate]').val();
        					birthDArray = birthD.split("/");
        					newBirthD = birthDArray[2]+"-"+birthDArray[1]+"-"+birthDArray[0];
        					new Ajax("Register", function(r){
        						if(r.error != undefined && r.error.code == 1000){
        							errorInputName = keyAt(r.error.message, 0);
        							errorType = keyAt(r.error.message[errorInputName], 0);
        							errorValue = r.error.message[errorInputName][errorType];
        							//Wich slide has this input ?
        							nIndexSlide = $('input[name='+errorInputName+']').parents(".slide").index();
        							nSlideEffect = 2-nIndexSlide;
        							for(i=0; i<nSlideEffect;i++){
        								slideSignin('prev');
        							}
        							alert(errorInputName+" "+errorValue);
        						}
        						else
        						{
        							$(window).changePage("index.html", "right");
        							alert("All right, you are registered !");
        						}
        						
        					}, $('input:not([name$="birthDate"])').serialize()+"&locale="+globalLocale+"&birthDate="+newBirthD, "POST");
        					
        				}
        				return;
        			}
        		}
        		
        		
        		//
        	});
            
        
        });
        $('.check').click(function () {
            $(this).toggleClass('active');
            $('.check-input').eq($('.slide .check').index($(this))).val($(this).hasClass('active') ? 1 : 0);
        });
    }
    
    // Swipe function /!\ must be at the end
    $(window).swipe({
        swipe: function (event, direction, distance, duration, fingerCount) {
            if (distance > $(window).width()*0.07) {
                // Products swipe
                if($('body').attr("data-url") == "deals") {
                    if (direction === 'right') {
                        changeProduct('prev');
                    } else if (direction === 'left') {
                        changeProduct('next');
                    }
                }
                // Signin swipe
                if($('body').attr("data-url") == "register") {
                    if (direction === 'right') {
                        slideSignin('prev');
                    } else if (direction === 'left') {
                        slideSignin('next');
                    }
                }
            }
        }
    });

    $('#showLeftPush').click(function () {
        $('.menuvertical-push').toggleClass('menuvertical-push-toright');
        $('nav').toggleClass('menuvertical-left');
    });
	$(window).trigger("askRetrieve");
});