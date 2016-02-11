$(document).ready(function () {
  NexT.motion = {};

  var sidebarToggleLines = {
    lines: [],
    push: function (line) {
      this.lines.push(line);
    },
    init: function () {
      this.lines.forEach(function (line) {
        line.init();
      });
    },
    arrow: function () {
      this.lines.forEach(function (line) {
        line.arrow();
      });
    },
    close: function () {
      this.lines.forEach(function (line) {
        line.close();
      });
    }
  };

  function SidebarToggleLine(settings) {
    this.el = $(settings.el);
    this.status = $.extend({}, {
      init: {
        width: '100%',
        opacity: 1,
        left: 0,
        rotateZ: 0,
        top: 0
      }
    }, settings.status);
  }

  SidebarToggleLine.prototype.init = function () {
    this.transform('init');
  };
  SidebarToggleLine.prototype.arrow = function () {
    this.transform('arrow');
  };
  SidebarToggleLine.prototype.close = function () {
    this.transform('close');
  };
  SidebarToggleLine.prototype.transform = function (status) {
    this.el.velocity('stop').velocity(this.status[status]);
  };

  var sidebarToggleLine1st = new SidebarToggleLine({
    el: '.sidebar-toggle-line-first',
    status: {
      arrow: {width: '50%', rotateZ: '-45deg', top: '2px'},
      close: {width: '100%', rotateZ: '-45deg', top: '5px'}
    }
  });
  var sidebarToggleLine2nd = new SidebarToggleLine({
    el: '.sidebar-toggle-line-middle',
    status: {
      arrow: {width: '90%'},
      close: {opacity: 0}
    }
  });
  var sidebarToggleLine3rd = new SidebarToggleLine({
    el: '.sidebar-toggle-line-last',
    status: {
      arrow: {width: '50%', rotateZ: '45deg', top: '-2px'},
      close: {width: '100%', rotateZ: '45deg', top: '-5px'}
    }
  });

  sidebarToggleLines.push(sidebarToggleLine1st);
  sidebarToggleLines.push(sidebarToggleLine2nd);
  sidebarToggleLines.push(sidebarToggleLine3rd);

  var SIDEBAR_WIDTH = '320px';
  var SIDEBAR_DISPLAY_DURATION = 150;

  var sidebarToggleMotion = {
    toggleEl: $('.sidebar-toggle'),
    sidebarEl: $('.sidebar'),
    isSidebarVisible: false,
    init: function () {
      this.toggleEl.on('click', this.clickHandler.bind(this));
      this.toggleEl.on('mouseenter', this.mouseEnterHandler.bind(this));
      this.toggleEl.on('mouseleave', this.mouseLeaveHandler.bind(this));

      $(document)
        .on('sidebar.isShowing', function () {
          NexT.utils.isDesktop() && $('body').velocity('stop').velocity(
            {paddingRight: SIDEBAR_WIDTH},
            SIDEBAR_DISPLAY_DURATION
          );
        })
        .on('sidebar.isHiding', function () {
        });
    },
    clickHandler: function () {
      this.isSidebarVisible ? this.hideSidebar() : this.showSidebar();
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    mouseEnterHandler: function () {
      if (this.isSidebarVisible) {
        return;
      }
      sidebarToggleLines.arrow();
    },
    mouseLeaveHandler: function () {
      if (this.isSidebarVisible) {
        return;
      }
      sidebarToggleLines.init();
    },
    showSidebar: function () {
      var self = this;

      sidebarToggleLines.close();

      this.sidebarEl.velocity('stop').velocity({
          width: SIDEBAR_WIDTH
        }, {
          display: 'block',
          duration: SIDEBAR_DISPLAY_DURATION,
          begin: function () {
            $('.sidebar .motion-element').velocity(
              'transition.slideRightIn',
              {
                stagger: 20,
                drag: true,
                complete: function () {
                  self.sidebarEl.trigger('sidebar.motion.complete');
                }
              }
            );
          },
          complete: function () {
            self.sidebarEl.addClass('sidebar-active');
            self.sidebarEl.trigger('sidebar.didShow');
          }
        }
      );

      this.sidebarEl.trigger('sidebar.isShowing');
    },
    hideSidebar: function () {
      NexT.utils.isDesktop() && $('body').velocity('stop').velocity({paddingRight: 0});
      this.sidebarEl.find('.motion-element').velocity('stop').css('display', 'none');
      this.sidebarEl.velocity('stop').velocity({width: 0}, {display: 'none'});

      sidebarToggleLines.init();

      this.sidebarEl.removeClass('sidebar-active');
      this.sidebarEl.trigger('sidebar.isHiding');

      //在 post 页面下按下隐藏 sidebar 时如果当前选中的是“站点概览”，将 toc 去除 motion 效果
      //防止再次打开时会出现在“站点概览”下的 bug
      if (!!$('.post-toc-wrap')) {
        if ($('.site-overview').css('display') === 'block') {
          $('.post-toc-wrap').removeClass('motion-element');
        }
      }
    }
  };
  sidebarToggleMotion.init();

  NexT.motion.integrator = {
    queue: [],
    cursor: -1,
    add: function (fn) {
      this.queue.push(fn);
      return this;
    },
    next: function () {
      this.cursor++;
      var fn = this.queue[this.cursor];
      $.isFunction(fn) && fn(NexT.motion.integrator);
    },
    bootstrap: function () {
      this.next();
    }
  };

  NexT.motion.middleWares =  {
    logo: function (integrator) {
      var sequence = [];
      var $brand = $('.brand');
      var $title = $('.site-title');
      var $subtitle = $('.site-subtitle');
      var $logoLineTop = $('.logo-line-before i');
      var $logoLineBottom = $('.logo-line-after i');

      $brand.size() > 0 && sequence.push({
        e: $brand,
        p: {opacity: 1},
        o: {duration: 150}
      });

      NexT.utils.isMist() && hasElement([$logoLineTop, $logoLineBottom]) &&
      sequence.push(
        getMistLineSettings($logoLineTop, '100%'),
        getMistLineSettings($logoLineBottom, '-100%')
      );

      hasElement($title) && sequence.push({
        e: $title,
        p: {opacity: 1, top: 0},
        o: { duration: 150 }
      });

      hasElement($subtitle) && sequence.push({
        e: $subtitle,
        p: {opacity: 1, top: 0},
        o: {duration: 150}
      });

      if (sequence.length > 0) {
        sequence[sequence.length - 1].o.complete = function () {
          integrator.next();
        };
        $.Velocity.RunSequence(sequence);
      } else {
        integrator.next();
      }


      function getMistLineSettings (element, translateX) {
        return {
          e: $(element),
          p: {translateX: translateX},
          o: {
            duration: 300,
            sequenceQueue: false
          }
        };
      }

      /**
       * Check if $elements exist.
       * @param {jQuery|Array} $elements
       * @returns {boolean}
       */
      function hasElement ($elements) {
        $elements = Array.isArray($elements) ? $elements : [$elements];
        return $elements.every(function ($element) {
          return $.isFunction($element.size) && $element.size() > 0;
        });
      }
    },

    menu: function (integrator) {
      $('.menu-item').velocity('transition.slideDownIn', {
        display: null,
        duration: 200,
        complete: function () {
          integrator.next();
        }
      });
    },

    postList: function (integrator) {
      var $post = $('.post');
      var hasPost = $post.size() > 0;

      hasPost ? postMotion() : integrator.next();

      function postMotion () {
        var postMotionOptions = window.postMotionOptions || {
            stagger: 10,
            drag: true
          };
        postMotionOptions.complete = function () {
          integrator.next();
        };

        $post.velocity('transition.slideDownIn', postMotionOptions);
      }
    },

    sidebar: function (integrator) {
      if (CONFIG.sidebar === 'always') {
        NexT.utils.displaySidebar();
      }
      integrator.next();
    }
  };

});

/* global NexT: true */

$(document).ready(function () {

  $(document).trigger('bootstrap:before');

  NexT.utils.isMobile() && window.FastClick.attach(document.body);

  $('#posts').find('img').lazyload({
    placeholder: '/images/loading.gif',
    effect: 'fadeIn'
  });

  $('.back-to-top').on('click', function () {
    $('body').velocity('scroll');
  });

  $('.site-nav-toggle button').on('click', function () {
    var $siteNav = $('.site-nav');
    var ON_CLASS_NAME = 'site-nav-on';
    var isSiteNavOn = $siteNav.hasClass(ON_CLASS_NAME);
    var animateAction = isSiteNavOn ? 'slideUp' : 'slideDown';
    var animateCallback = isSiteNavOn ? 'removeClass' : 'addClass';

    $siteNav.stop()[animateAction]('fast', function () {
      $siteNav[animateCallback](ON_CLASS_NAME);
    });
  });


  CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox();
  NexT.utils.embeddedVideoTransformer();
  NexT.utils.addActiveClassToMenuItem();


  // Define Motion Sequence.
  NexT.motion.integrator
    .add(NexT.motion.middleWares.logo)
    .add(NexT.motion.middleWares.menu)
    .add(NexT.motion.middleWares.postList)
    .add(NexT.motion.middleWares.sidebar);

  $(document).trigger('motion:before');

  // Bootstrap Motion.
  CONFIG.motion && NexT.motion.integrator.bootstrap();

  $(document).trigger('bootstrap:after');
});

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

$(document).ready(function () {
  var $sidebar = $('#sidebar');
  var headerHeight = $('.header-inner').height();
  var footerOffset = parseInt($('.main').css('padding-bottom'), 10);
  var sidebarTop = headerHeight + 10;

  $sidebar
    .css({ 'margin-top': sidebarTop })
    .show();

  NexT.utils.isDesktop() && $('.page-post-detail .sidebar-inner').affix({
    offset: {
      top: sidebarTop,
      bottom: footerOffset
    }
  });
});

var $menu = $('#menu');
var $menuItemSearch = $menu.find('.menu-item-search');
var $siteSearch = $menu.find('.site-search');

$menuItemSearch.click(function () {
    $siteSearch.show(200);
    return false;
});

$menuItemSearch.on('mouseleave', function () {
    $siteSearch.hide(300);
});

NexT.utils = NexT.$u = {
    /**
     * Wrap images with fancybox support.
     */
    wrapImageWithFancyBox: function () {
        $('.content img').not('.group-picture img').each(function () {

            var $image = $(this);
            var imageTitle = $image.attr('title');
            var $imageWrapLink = $image.parent('a');

            if ($imageWrapLink.size() < 1) {
                $imageWrapLink = $image.wrap('<a href="' + this.getAttribute('src') + '"></a>').parent('a');
            }

            $imageWrapLink.addClass('fancybox');
            $imageWrapLink.attr('rel', 'group');

            if (imageTitle) {
                $imageWrapLink.append('<p class="image-caption">' + imageTitle + '</p>');
                $imageWrapLink.attr('title', imageTitle); //make sure img title tag will show correctly in fancybox
            }
        });

        $('.fancybox').fancybox({
            helpers: {
                overlay: {
                    locked: false
                }
            }
        });
    },

    /**
     * Transform embedded video to support responsive layout.
     * @see http://toddmotto.com/fluid-and-responsive-youtube-and-vimeo-videos-with-fluidvids-js/
     */
    embeddedVideoTransformer: function () {
        var $iframes = $('iframe');

        /*
         * Supported Players. Extend this if you need more players.
         */
        var SUPPORTED_PLAYERS = [
            'www.youtube.com',
            'player.vimeo.com',
            'player.youku.com',
            'music.163.com',
            'www.tudou.com'
        ];
        var pattern = new RegExp(SUPPORTED_PLAYERS.join('|'));

        $iframes.each(function () {
            var iframe = this;
            var $iframe = $(this);

            if (this.src.search(pattern) > 0) {
                /*
                 * Calculate the video ratio based on the iframe's w/h dimensions
                 */
                var videoRatio = ( $iframe.height() / $iframe.width() ) * 100;

                // Add height for 163 music.
                if (this.src.search('music.163.com') > 0) {
                    videoRatio += 10;
                }

                /*
                 * Replace the iframe's dimensions and position
                 * the iframe absolute, this is the trick to emulate
                 * the video ratio
                 */
                $iframe
                    .width('100%')
                    .height('100%')
                    .css({
                        position: 'absolute',
                        top: '0',
                        left: '0'
                    });

                /*
                 * Wrap the iframe in a new <div> which uses a
                 * dynamically fetched padding-top property based
                 * on the video's w/h dimensions
                 */
                var wrap = document.createElement('div');
                wrap.className = 'fluid-vids';
                wrap.style.width = '100%';
                wrap.style.position = 'relative';
                wrap.style.paddingTop = videoRatio + '%';

                /*
                 * Add the iframe inside our newly created <div>
                 */
                var iframeParent = iframe.parentNode;
                iframeParent.insertBefore(wrap, iframe);
                wrap.appendChild(iframe);
            }
        });
    },

    /**
     * Add `menu-item-active` class name to menu item
     * via comparing location.path with menu item's href.
     */
    addActiveClassToMenuItem: function () {
        var path = window.location.href;
        $('.menu-item a[href="' + path + '"]').parent().addClass('menu-item-active');
    },

    hasMobileUA: function () {
        var nav = window.navigator;
        var ua = nav.userAgent;
        var pa = /iPad|iPhone|Android|Opera Mini|BlackBerry|webOS|UCWEB|Blazer|PSP|IEMobile|Symbian/g;

        return pa.test(ua);
    },

    isTablet: function () {
        return window.screen.width < 992 && window.screen.width > 767 && this.hasMobileUA();
    },

    isMobile: function () {
        return window.screen.width < 767 && this.hasMobileUA();
    },

    isDesktop: function () {
        return !this.isTablet() && !this.isMobile();
    },

    /**
     * Escape meta symbols in jQuery selectors.
     *
     * @param selector
     * @returns {string|void|XML|*}
     */
    escapeSelector: function (selector) {
        return selector.replace(/[!"$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
    },

    displaySidebar: function () {
        if (!this.isDesktop()) {
            return;
        }
        $('.sidebar-toggle').trigger('click');
    },

    isMist: function () {
        return CONFIG.scheme === 'Mist';
    },

    isPisces: function () {
        return CONFIG.scheme === 'Pisces';
    }
};
