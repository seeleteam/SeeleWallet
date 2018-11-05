/* 
author: Miya_yang
date:2018.10.30
*/
(function ($) {
  $.fn.togglePassword = function (options) {
    var s = $.extend($.fn.togglePassword.defaults, options),
      input = $(this)

    $(s.el).bind(s.ev, function () {
      var flag = 'password' == $(input).attr('type')
      flag ? $(input)[0].type = 'text' : $(input)[0].type = 'password'
    });
  };
  $.fn.togglePassword.defaults = {
    ev: 'click'
  };
}(jQuery))