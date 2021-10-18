/* ----- Custom Scripts for Kaline template ----- */

jQuery(function($) {
    "use strict";


  /*-----------------------------------
  ----------- Scroll To Top -----------
  ------------------------------------*/

    $(window).scroll(function () {
      if ($(this).scrollTop() > 500) {
          $('#back-top').fadeIn();
      } else {
          $('#back-top').fadeOut();
      }
    });


//Jarallax Init//

	$('.intro').jarallax({
		speed: 0.5
	});

/*----- Preloader ----- */

    $(window).load(function() {
    		setTimeout(function() {
            $('#loading').fadeOut('slow', function() {
            });
        }, 100);
    });


/* --------- Wow Init -------*/

new WOW().init();


/*----------------------------
------- Isotope Init -------
-----------------------------*/

$(window ).load(function() {

var $container = $('.portfolio_container');
$container.isotope({
	filter: '*',
});

$('.origin-portfolio_filter a').on('click', function () {
	$('.origin-portfolio_filter .active').removeClass('active');
	$(this).addClass('active');

	var selector = $(this).attr('data-filter');
	$container.isotope({
			filter: selector,
			animationOptions: {
					duration: 500,
					animationEngine: "jquery"
			}
	});
	return false;
});

});


});
