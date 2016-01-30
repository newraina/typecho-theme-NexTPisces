<?php if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

Typecho_Widget::widget('Widget_Stat')->to($stat);
?>
<div class="sidebar-toggle">
    <div class="sidebar-toggle-line-wrap">
        <span class="sidebar-toggle-line sidebar-toggle-line-first"></span>
        <span class="sidebar-toggle-line sidebar-toggle-line-middle"></span>
        <span class="sidebar-toggle-line sidebar-toggle-line-last"></span>
    </div>
</div>

<aside id="sidebar" class="sidebar">
    <div class="sidebar-inner affix-top">
        <?php if ($this->is('post')): ?>
            <ul class="sidebar-nav motion-element">
                <li class="sidebar-nav-toc sidebar-nav-active" data-target="post-toc-wrap">
                    文章目录
                </li>
                <li class="sidebar-nav-overview" data-target="site-overview">
                    站点概览
                </li>
            </ul>
        <?php endif; ?>
        <section class="site-overview sidebar-panel <?php if (!$this->is('post')) {
            echo "sidebar-panel-active";
        }
        ?>">
            <div class="site-author motion-element" itemprop="author" itemscope itemtype="http://schema.org/Person">
                <img class="site-author-image" src="<?php echo getGravatar($this->options->next_gravatar, 70); ?>" alt="<?php $this->options->next_name(); ?>" itemprop="image"/>
                <p class="site-author-name" itemprop="name"><?php $this->options->next_name(); ?></p>
                <p class="site-description motion-element" itemprop="description"><?php $this->options->next_tips(); ?></p>
            </div>
            <nav class="site-state motion-element">
                <div class="site-state-item site-state-posts">
                    <a href="<?php echo Typecho_Router::url('page', array('slug' => 'archive'), $this->options->index); ?>">
                        <span class="site-state-item-count"><?php echo $stat->publishedPostsNum; ?></span>
                        <span class="site-state-item-name">文章</span>
                    </a>
                </div>

                <div class="site-state-item site-state-categories">
                    <a href="<?php echo Typecho_Router::url('page', array('slug' => 'categories'), $this->options->index); ?>">
                        <span class="site-state-item-count"><?php echo $stat->categoriesNum; ?></span>
                        <span class="site-state-item-name">分类</span>
                    </a>
                </div>

                <div class="site-state-item site-state-tags">
                    <a href="<?php echo Typecho_Router::url('page', array('slug' => 'tags'), $this->options->index); ?>">
                        <span class="site-state-item-count"><?php echo getTagCount(); ?></span>
                        <span class="site-state-item-name">标签</span>
                    </a>
                </div>
            </nav>
            <?php if (!empty($this->options->sidebarOthers) && in_array('ShowFeed', $this->options->sidebarOthers)): ?>
                <div class="feed-link motion-element">
                    <a href="<?php $this->options->feedUrl(); ?>" rel="alternate">
                        <i class="menu-item-icon icon-next-feed"></i>
                        RSS
                    </a>
                </div>
            <?php endif; ?>
            <div class="links-of-author motion-element">
  <span class="links-of-author-item">
    <a href="https://github.com/example" target="_blank">
        <i class="fa fa-github"></i> GitHub
    </a>
  </span>
  <span class="links-of-author-item">
    <a href="http://www.zhihu.com/people/example" target="_blank">
        <i class="fa fa-globe"></i> 知乎
    </a>
  </span>
  <span class="links-of-author-item">
    <a href="http://v2ex.com/member/example" target="_blank">
        <i class="fa fa-globe"></i> V2EX
    </a>
  </span>
  <span class="links-of-author-item">
    <a href="http://segmentfault.com/u/example" target="_blank">
        <i class="fa fa-globe"></i> SF
    </a>
  </span>
            </div>
            <?php if (class_exists("Links_Plugin")): ?>
                <div class="motion-element" <?php
                if ($this->options->sidebarFlinks == 'hide') {
                    echo 'hidden';
                } ?>>
                    <div class="friend-link-title">友情链接</div>
                    <?php Links_Plugin::output('<span class="friend-link-item"><a href="{url}" title="{title}" target="_blank">{name}</a></span>'); ?>
                </div>
            <?php endif; ?>
        </section>
        <?php if ($this->is('post')): ?>
            <section class="post-toc-wrap sidebar-panel-active motion-element">
                <div class="post-toc-indicator-top post-toc-indicator"></div>
                <div class="post-toc">
                    <p class="post-toc-empty">此文章未包含目录</p>
                </div>
            </section>
        <?php endif; ?>
    </div>
</aside>

