/*
 * Simple slider with counter. We need more sliders! For each slider on the page we count total slides, current slide and animate them
*/
;(function($){
	var defaults = {
		slide: "js-slide",
		next: "js-next",
		prev: "js-prev",
		current: "js-current",
		total: "js-total"
	};
	$.fn.slideThis = function(o){        
		var options = $.extend({}, defaults, o);
				
		return this.each(function(){
			var $this = $(this),
				$slide = $this.find("." + options.slide),
				$next = $this.find("." + options.next),
				$prev = $this.find("." + options.prev),
				$currentCount = $this.find("." + options.current),
				$totalCount = $this.find("." + options.total),
				count = $slide.length;

			// display number of slides in slider meta    
			$totalCount.text(count);  

			// set display:none for all members of $slide except the first
			$slide.not(":eq(0)").hide();

			// for "next" button we'll hide current slide and show next one   
			$next.click(function (ev) {
			ev.preventDefault();
				// stores the currently-visible slide
				var $currentSlide = $slide.filter(":visible");
				if ($currentSlide.is($slide.last())) {
					$currentCount.text("1");
					$currentSlide.hide();
					$slide.first().show();
				} else { // else, hide current slide and show the next one
					$currentCount.text($currentSlide.next().index() + 1);
					$currentSlide.hide().next().show();
				}
			});
		
		  //for "prev" button we'll hide current slide and show previous  
		  $prev.click(function (ev) {
			ev.preventDefault();
				// stores the currently-visible slide
				var $currentSlide = $slide.filter(":visible");
				if ($currentSlide.is($slide.first())) {
					$currentCount.text(count);
					$currentSlide.hide();
					$slide.last().show();
				} else { // else, hide current slide and show the previous
					$currentCount.text($currentSlide.prev().index() + 1);
					$currentSlide.hide().prev().show();
				}
			});
		});
	};
})(jQuery);

// Slider settings
$(".js-slider").slideThis();