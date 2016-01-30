<?php if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
?>
<footer id="footer" class="footer">
    <div class="footer-inner">
        <div class="copyright">
            &copy;
            <span itemprop="copyrightYear"><?php echo date('Y'); ?></span>
      <span class="with-love">
        <i class="icon-next-heart fa fa-heart"></i>
      </span>
      <span class="author" itemprop="copyrightHolder">
      <?php if ($this->options->next_name) {
          $this->options->next_name();
      } else {
          $this->options->title();
      }
      ?>
      </span>
        </div>

        <div class="powered-by">
            <a class="theme-link" href="http://www.typecho.org" target="_blank">Typecho</a>
        </div>
        <div class="theme-info">
            主题 -
            <a class="theme-link" href="https://github.com/newraina/typecho-theme-NexTPisces" target="_blank">
                NexT.Pisces
            </a>
        </div>
    </div>
</footer>
<div class="back-to-top"></div>
</div>
<script src="<?php $this->options->themeUrl('/vendors/jquery/index.js'); ?>"></script>
<script src="<?php $this->options->themeUrl('/vendors/fastclick/lib/fastclick.min.js'); ?>"></script>
<script src="<?php $this->options->themeUrl('/vendors/jquery_lazyload/jquery.lazyload.js'); ?>"></script>
<script src="<?php $this->options->themeUrl('/vendors/velocity/velocity.min.js'); ?>"></script>
<script src="<?php $this->options->themeUrl('/vendors/velocity/velocity.ui.min.js'); ?>"></script>
<script src="<?php $this->options->themeUrl('/vendors/fancybox/source/jquery.fancybox.pack.js'); ?>"></script>
<script src="<?php $this->options->themeUrl('/dist/js/main.min.js'); ?>"></script>


<?php if ($this->is('post')): ?>
    <script src="<?php $this->options->themeUrl('/dist/js/postNeed.min.js'); ?>"></script>
    <script id="sidebar.nav">
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
                    currentTarget.animate({opacity: 0}, TAB_ANIMATE_DURATION, function () {
                        currentTarget.hide();
                        target
                            .stop()
                            .css({'opacity': 0, 'display': 'block'})
                            .animate({opacity: 1}, TAB_ANIMATE_DURATION, function () {
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
                        offset: offset + 'px',
                        mobileHA: false
                    }) :
                    $('html, body').stop().animate({
                        scrollTop: offset
                    }, 500);
            });

            // Expand sidebar on post detail page by default, when post has a toc.
            NexT.motion.middleWares.sidebar = function () {
                var $tocContent = $('.post-toc-content');

                if (CONFIG.sidebar === 'post') {
                    if ($tocContent.length > 0 && $tocContent.html().trim().length > 0) {
                        NexT.utils.displaySidebar();
                    }
                }
            };
        });
    </script>
<?php endif; ?>

<?php if ($this->is('page', 'archive') || $this->is('archive')): ?>
    <script id="motion.page.archive">
        $('.archive-year').velocity('transition.slideLeftIn');
    </script>
<?php endif; ?>

<script>
    $(function () {
        $("#posts").find('img').lazyload({
            placeholder: "<?php $this->options->themeUrl('/images/loading.gif');?>",
            effect: "fadeIn"
        });
    });
</script>
<?php $this->footer(); ?>
</body>
</html>
