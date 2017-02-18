// Include body scripts in the right order
// They will be concatenated using gulp-rigger in body.min.js

//= vendor/jquery-1.10.2.min.js
//= vendor/lazyload.js
//= lib/navKit.js
//= lib/slideThis.js


// lazyload settings
$(".js-lazy").lazyload({ effect : "fadeIn", threshold : 300 });

// navKit  settings
$(".js-nav").navKit();

// Slider settings
$(".js-slider").slideThis();
