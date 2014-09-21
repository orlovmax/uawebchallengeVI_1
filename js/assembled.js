/** 
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.0
 *
 */
 // Damn it! tis part isn't "linted"
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "src",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;
      
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                $self.attr("src", settings.placeholder);
            }
            
            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {
                            var original = $self.data(settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);
                            
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.data(settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });
              
        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });
        
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);

// lazyload settings
$(".js-lazy").lazyload({ effect : "fadeIn", threshold : 300 });

/* 
 * navigation script: sticky nav, anchor smooth scrolling, selecting current nav item 
*/
$(function () {
  'use strict';
    //Sticky navbar. We take offset top of navbar and compare with top scroll, in result - add or remove .is-fixed class
    var NavTopOffset = $('.js-nav').offset().top,
    anchor = $(".js-link"),
    navLinks = $(".js-link"),
    aArray = [],
    i;
    $(window).scroll(function () {
    var topScroll = $(window).scrollTop();

    if (topScroll > NavTopOffset) {
      $('.js-nav').addClass('is-fixed');
    } else {
      $('.js-nav').removeClass('is-fixed');
    }
    });

    //Smooth anchor scroll, targeted to our nav links with .js-link class... Actually this thing was modified on csstricks
  anchor.click(function () {

    if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html,body").animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  //Highlight nav list item when current section visible
  //Originally this way is belong to http://www.callmenick.com
    for (i = 0; i < navLinks.length; i += 1) {
        var link = navLinks[i],
      ahref = $(link).attr('href');
        aArray.push(ahref);
    } // this for loop fills the aArray with attribute href values

    $(window).scroll(function () {
        var windowPos = $(window).scrollTop(), // get the offset of the window from the top of page
      windowHeight = $(window).height(), // get the height of the window
      docHeight = $(document).height(),
      navHeight = $(".js-nav.is-fixed").height(),
            navActiveCurrent = $(".is-active").attr("href");

        for (i = 0; i < aArray.length; i += 1) {
            var theID = aArray[i],
        sectPos = $(theID).offset().top - navHeight, // get the offset of the div from the top of page + except nav height
        sectHeight = $(theID).height(); // get the height of the div in question
            if (windowPos >= sectPos && windowPos < (sectPos + sectHeight)) {
                $(".js-link[href='" + theID + "']").addClass("is-active");
            } else {
                $(".js-link[href='" + theID + "']").removeClass("is-active");
            }
        }
    //highlight last nav list item on last section
        if (windowPos + windowHeight === docHeight) {
            if (!$(".js-nav").find("li:last-child").find(".js-link").hasClass("is-active")) {
                $(".js-link[href='" + navActiveCurrent + "']").removeClass("is-active");
                $(".js-nav").find("li:last-child").find(".js-link").addClass("is-active");
            }
        }

    //highlight first nav item when first section has some top offset
    if (windowPos < $("#biography").offset().top) {
            if (!$(".js-nav").find("li:first-child").find(".js-link").hasClass("is-active")) {
                $(".js-link[href='" + navActiveCurrent + "']").removeClass("is-active");
                $(".js-nav").find("li:first-child").find(".js-link").addClass("is-active");
            }
        }
    });
});
/*
 * Simple slider with counter. We need more sliders! For each slider on the page we count total slides, current slide and animate them
*/
(function($){
    $.fn.slideThis = function(o){        
        var defaults = {
            slide: ".js-slide",
            next: ".js-next",
            prev: ".js-prev",
            current: ".js-current",
            total: ".js-total"
        },
        options = $.extend({}, defaults, o);
                
        return this.each(function(){
            var $this = $(this),
                $slide = $this.find(options.slide),
                $next = $this.find(options.next),
                $prev = $this.find(options.prev),
                $currentCount = $this.find(options.current),
                $totalCount = $this.find(options.total),
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
    }
})(jQuery);

// Slider settings
$(".js-slider").slideThis();