$(function(){
	
	//Timeline
	$('.timeline-item-trigger span').click(function(){
		if($(this).hasClass('glyphicon-leaf')){$(this).removeClass('glyphicon-leaf').addClass('glyphicon-pushpin');}
		else{$(this).removeClass('glyphicon-pushpin').addClass('glyphicon-leaf');}
	});

	$('.timeline-item-title').click(function(){
		$trigger = $(this).parent().parent().find('.timeline-item-trigger span');
		if($trigger.hasClass('glyphicon-leaf')){$trigger.removeClass('glyphicon-leaf').addClass('glyphicon-pushpin');}
		else{$trigger.removeClass('glyphicon-pushpin').addClass('glyphicon-leaf');}
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

$(document).ready(function(){
  $("#start").click(function(){
      var pos = $("#start-top").offset().top - 50;
      $("html,body").animate({scrollTop: pos}, 1000);
      return false;
  });
});
