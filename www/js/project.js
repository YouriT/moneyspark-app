$('.imin').click(function(){

	$('.deal').addClass("a");
	$('.bordertop').before('</div>');
	$('.borderbottom').after('<div class="row-fluid deal b">');

	$('.buydeal').show();

	$('.bordertop, .borderbottom').hide();




});