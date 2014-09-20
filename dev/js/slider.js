/*
 * Simple slider with counter. We need more sliders! For each slider on the page we count total slides, current slide and animate them
*/
$('.js-slider').each(function () {
  'use strict';
  var $this = $(this),
    slide = $this.find('.js-slide'),
    next = $this.find('.js-next'),
    prev = $this.find('.js-prev'),
    count = slide.length;

  // display number of slides in slider meta
    $this.find(".js-total").text(count);

    // set display:none for all members of .js-slide class except the first
    $this.find('.js-slide:gt(0)').hide();

    // for "next" button we'll hide current slide and show next one   
    next.click(function (ev) {
    ev.preventDefault();
        // stores the currently-visible slide
        var current = $this.find('.js-slide:visible');
        if (current.is(slide.last())) {
            $this.find(".js-current").text("1");
            current.hide();
            slide.first().show();
        } else { // else, hide current slide and show the next one
            $this.find(".js-current").text(current.next().index() + 1);
            current.hide().next().show();
        }
    });

  //for "prev" button we'll hide current slide and show previous  
  prev.click(function (ev) {
    ev.preventDefault();
        // stores the currently-visible slide
        var current = $this.find('.js-slide:visible');
        if (current.is(slide.first())) {
            $this.find(".js-current").text(count);
            current.hide();
            slide.last().show();
        } else { // else, hide current slide and show the previous
            $this.find(".js-current").text(current.prev().index() + 1);
            current.hide().prev().show();
        }
    });
});