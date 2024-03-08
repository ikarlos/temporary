function visible($t) {
  if (!$t || !$t.length) return false;  // Check if $t is undefined or has zero length
  var $w = jQuery(window),
      viewTop = $w.scrollTop(),
      viewBottom = viewTop + $w.height(),
      _top = $t.offset().top,
      _bottom = _top + $t.height();

  return (_bottom <= viewBottom) && (_top >= viewTop) && $t.is(':visible');
}

$(window).scroll(function() {
  if (visible($('.count-digit'))) {
      if ($('.count-digit').hasClass('counter-loaded')) return;
      $('.count-digit').addClass('counter-loaded');

      $('.count-digit').each(function() {
          var $this = $(this);
          jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
              duration: 3000,
              easing: 'swing',
              step: function() {
                  $this.text(Math.ceil(this.Counter));
              }
          });
      });
  }
});
