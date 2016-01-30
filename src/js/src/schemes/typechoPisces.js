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
