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