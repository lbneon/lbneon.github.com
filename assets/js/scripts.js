$(function(){
	
	//Timeline
	$('.timeline-item-trigger span').click(function(){
		if($(this).hasClass('glyphicon-leaf')){$(this).removeClass('glyphicon-leaf').addClass('glyphicon-pushpin');}
		else{$(this).removeClass('glyphicon-pushpin').addClass('glyphicon-leaf');}
	});
});

//sliders autoplay
  //intro slider
  $('#carousel_fade_intro').carousel({
    interval: 2500,
    pause: "false"
  })

//make section height of window
	$(function(){
		$('#intro').css({'height':($(window).height())+'px'});
		$(window).resize(function(){
		$('#intro').css({'height':($(window).height())+'px'});
		});
	});