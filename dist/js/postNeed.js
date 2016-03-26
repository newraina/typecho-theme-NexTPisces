/* ========================================================================
* Bootstrap: scrollspy.js v3.3.2
* http://getbootstrap.com/javascript/#scrollspy
* ========================================================================
* Copyright 2011-2015 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */

/**
 * Custom by iissnan
 *
 * - Add a `clear.bs.scrollspy` event.
 * - Esacpe targets selector.
 */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.2'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(NexT.utils.escapeSelector(href)) // Need to escape selector.

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })


  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      $(this.selector).trigger('clear.bs.scrollspy')  // Add a custom event.
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

$(document).ready(function () {
    var tocSelector = '.post-toc';
    var $tocSelector = $(tocSelector);
    var activeCurrentSelector = '.active-current';

    $tocSelector
      .on('activate.bs.scrollspy', function () {
        var $currentActiveElement = $(tocSelector + ' .active').last();

        removeCurrentActiveClass();
        $currentActiveElement.addClass('active-current');

        $tocSelector[0].scrollTop = $currentActiveElement.position().top;
      })
      .on('clear.bs.scrollspy', function () {
        removeCurrentActiveClass();
      });

    function removeCurrentActiveClass () {
      $(tocSelector + ' ' + activeCurrentSelector)
        .removeClass(activeCurrentSelector.substring(1));
    }

    function processTOC () {
      getTOCMaxHeight();
      toggleTOCOverflowIndicators();
    }

    function getTOCMaxHeight () {
      var height = $('.sidebar').height() -
                   $tocSelector.position().top -
                   $('.post-toc-indicator-bottom').height();

      $tocSelector.css('height', height);

      return height;
    }

    function toggleTOCOverflowIndicators () {
      tocOverflowIndicator(
        '.post-toc-indicator-top',
        $tocSelector.scrollTop() > 0 ? 'show' : 'hide'
      );

      tocOverflowIndicator(
        '.post-toc-indicator-bottom',
        $tocSelector.scrollTop() >= $tocSelector.find('ol').height() - $tocSelector.height() ? 'hide' : 'show'
      )
    }

    $(document).on('sidebar.motion.complete', function () {
      processTOC();
    });

    $('body').scrollspy({ target: tocSelector });
    $(window).on('resize', function () {
      if ( $('.sidebar').hasClass('sidebar-active') ) {
        processTOC();
      }
    });

    onScroll($tocSelector);

    function onScroll (element) {
      element.on('mousewheel DOMMouseScroll', function (event) {
          var oe = event.originalEvent;
          var delta = oe.wheelDelta || -oe.detail;

          this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
          event.preventDefault();

          toggleTOCOverflowIndicators();
      });
    }

    function tocOverflowIndicator (indicator, action) {
      var $indicator = $(indicator);
      var opacity = action === 'show' ? 1 : 0;
      $indicator.velocity ?
        $indicator.velocity('stop').velocity({
          opacity: opacity
        }, { duration: 100 }) :
        $indicator.stop().animate({
          opacity: opacity
        }, 100);
    }

  });

  $(document).ready(function () {
    var html = $('html');
    var TAB_ANIMATE_DURATION = 200;
    var hasVelocity = $.isFunction(html.velocity);

    $('.sidebar-nav li').on('click', function () {
      var item = $(this);
      var activeTabClassName = 'sidebar-nav-active';
      var activePanelClassName = 'sidebar-panel-active';
      if (item.hasClass(activeTabClassName)) {
        return;
      }

      var currentTarget = $('.' + activePanelClassName);
      var target = $('.' + item.data('target'));

      hasVelocity ?
        currentTarget.velocity('transition.slideUpOut', TAB_ANIMATE_DURATION, function () {
          target
            .velocity('stop')
            .velocity('transition.slideDownIn', TAB_ANIMATE_DURATION)
            .addClass(activePanelClassName);
        }) :
        currentTarget.animate({ opacity: 0 }, TAB_ANIMATE_DURATION, function () {
          currentTarget.hide();
          target
            .stop()
            .css({'opacity': 0, 'display': 'block'})
            .animate({ opacity: 1 }, TAB_ANIMATE_DURATION, function () {
              currentTarget.removeClass(activePanelClassName);
              target.addClass(activePanelClassName);
            });
        });

      item.siblings().removeClass(activeTabClassName);
      item.addClass(activeTabClassName);
    });

    $('.post-toc a').on('click', function (e) {
      e.preventDefault();
      var targetSelector = NexT.utils.escapeSelector(this.getAttribute('href'));
      var offset = $(targetSelector).offset().top;
      hasVelocity ?
        html.velocity('stop').velocity('scroll', {
          offset: offset  + 'px',
          mobileHA: false
        }) :
        $('html, body').stop().animate({
          scrollTop: offset
        }, 500);
    });
  });

menu={};
$('h2,h3').each(function(){
  if ($(this).attr('id')){
    return;
  }
  $(this).attr('id',$(this).text().replace(/ /g,''));
  if ($(this).is('h2')){
    if (menu[$(this).text()] ==undefined){
      menu[$(this).text()]=[];
    }
    menu.last=$(this).text();
  }
  if ($(this).is('h3')){
    menu[menu.last].push($(this).text());
  }
});
//组织目录
if (menu.last){
  var ii=0;
  h2List=$('<ol class="nav"></ol>');
  for (i in menu){
    h2=menu[i];
    if (typeof(menu[i]) =='string'){
      continue;
    }
    ii++;
    h2Node=$('<li class="nav-item nav-level-2"><a class="nav-link" href="#'+(i.replace(/ /g,''))+'"><span class="nav-number">'+(ii).toString()+'.</span> <span class="nav-text">'+i+'</span></a></li>');
    if (h2.length){
      jj=0;
      h3List=$('<ol class="nav-child"></ol>');
      for (j in h2){
        jj++;
        h3=h2[j];
        h3Node=$('<li class="nav-item nav-level-3"><a class="nav-link" href="#'+(h3.replace(/ /g,''))+'"><span class="nav-number">'+(ii).toString()+'.'+(jj).toString()+'</span> <span class="nav-text">'+h3+'</span></a></li>')
        h3List.append(h3Node);
      }
      if(h3List.text().length){
        h2Node.append(h3List);
      }
    }
    h2List.append(h2Node);
  }
  if (h2List.text()){
    $('.post-toc').html('<div class="post-toc-content">'+h2List[0].outerHTML+'</div>')
  }else {
    $('.post-toc').html('');
  }
}
