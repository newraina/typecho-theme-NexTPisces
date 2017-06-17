<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

//当cdn加速开启时候定义cdn的地址
if (!empty($this->options->next_cdn) && $this->options->next_cdn) {
    define('__TYPECHO_THEME_URL__', Typecho_Common::url(__TYPECHO_THEME_DIR__ . '/NexTPisces', $this->options->next_cdn));
}
?><!doctype html>
<html class="theme-next use-motion pisces" lang="zh-cmn-Hans">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
    <meta http-equiv="Cache-Control" content="no-transform"/>
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <!-- 使用url函数转换相关路径 -->
    <link rel="stylesheet" href="<?php $this->options->themeUrl('dist/css/main.min.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('vendors/fancybox/source/jquery.fancybox.css'); ?>">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Lato:300,400,700,400italic&subset=latin,latin-ext">
    <!-- 将您的favicon图标放在images文件夹下，然后取消下面两句的注释 -->
    <!-- <link rel="shortcut icon" href="<?php $this->options->themeUrl('images/favicon.ico'); ?>"> -->
    <!-- <link rel="apple-touch-icon" href="<?php $this->options->themeUrl('images/icon.png'); ?>"> -->
    <script type="text/javascript" id="hexo.configuration">
        var NexT = window.NexT || {};
        var CONFIG = {
            scheme: 'Pisces',
            sidebar: '[object Object]',
            fancybox: true,
            motion: true
        };
    </script>
    <title><?php $this->archiveTitle(array(
            'category' => _t('分类 %s 下的文章'),
            'search' => _t('包含关键字 %s 的文章'),
            'tag' => _t('标签 %s 下的文章'),
            'author' => _t('%s 发布的文章'),
        ), '', ' - '); ?><?php $this->options->title(); ?></title>

    <!-- 通过自有函数输出HTML头部信息 -->
    <?php $this->header(); ?>

</head>

<body itemscope itemtype="http://schema.org/WebPage">

<div class="container one-column sidebar-position-left <?php if ($this->is('index')) {
    echo 'page-home';
} elseif ($this->is('post')) {
    echo "page-post-detail";
} elseif ($this->is('page', 'archive') || $this->is('archive')) {
    echo "page-archive";
}
?>">
    <!--page home-->
    <div class="headband"></div>
    <header id="header" class="header" itemscope itemtype="http://schema.org/WPHeader">
        <div class="header-inner">
            <div class="site-meta">
                <div class="custom-logo-site-title">
                    <a href="/" class="brand" rel="start">
                        <span class="logo-line-before"><i></i></span>
                        <span class="site-title"><?php $this->options->title() ?></span>
                        <span class="logo-line-after"><i></i></span>
                    </a>
                </div>
                <p class="site-subtitle"><?php $this->options->description(); ?></p>
            </div>
            <div class="site-nav-toggle">
                <button>
                    <span class="btn-bar"></span>
                    <span class="btn-bar"></span>
                    <span class="btn-bar"></span>
                </button>
            </div>
            <nav class="site-nav">
                <?php $displaysearch = !empty($this->options->search_form) && in_array('ShowSearch', $this->options->search_form) ?>
                <ul id="menu" class="menu <?php if ($displaysearch) {
                    echo 'menu-left';
                }
                ?>">
                    <?php if (!empty($this->options->sidebarNav) && in_array('main', $this->options->sidebarNav)): ?>
                        <li class="menu-item menu-item-home">
                            <a href="<?php $this->options->siteUrl(); ?>" rel="section">
                                <i class="menu-item-icon fa fa-home fa-fw"></i>
                                <br/>
                                首页
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
                    <?php while ($pages->next()): ?>
                        <?php if (!empty($this->options->sidebarNav) && in_array($pages->slug, $this->options->sidebarNav)): ?>
                            <li class="menu-item menu-item-<?php echo $pages->slug; ?>">
                                <a href="<?php $pages->permalink(); ?>" rel="section">
                                    <i class="menu-item-icon fa fa-fw fa-<?php echo getIconName($pages->slug); ?>"></i>
                                    <br/>
                                    <?php $pages->title(); ?>
                                </a>
                            </li>
                        <?php endif; ?>
                    <?php endwhile; ?>
                    <?php if (!empty($this->options->sidebarNav) && in_array('search', $this->options->sidebarNav)): ?>
                        <li class="menu-item menu-item-search">
                            <a href="/search" class="st-search-show-outputs">
                                <i class="menu-item-icon fa fa-search fa-fw"></i> <br>搜索
                            </a>
                            <div class="site-search">
                                <form class="site-search-form">
                                    <input type="text" id="st-search-input" name="s" class="st-search-input st-default-search-input" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="想搜啥？" value="<?php if ($this->is('search')) echo $this->getKeywords(); ?>"/>
                                </form>
                            </div>
                        </li>
                    <?php endif; ?>
                </ul>

            </nav>
        </div>
    </header>


