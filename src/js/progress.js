(function ($) {
    'use strict'
    $(function () {
        $.extend($.ui.slider.prototype.options, {
            animate: 'fast',
            stop: function () {
                var ident = this.id || this.className
            }
        })
        $('.progress').slider().slider({
            min: 1,
            max:100,
            stop: function (event, ui) {
                console.log(ui.value) // Gets the value of the current progress bar
            }
        }).slider('float')
    })
}(jQuery))