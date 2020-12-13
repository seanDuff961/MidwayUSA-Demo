/*establish desktop size*/
window.desktop = window.screen.width > 768;

/*menu*/
(function ($) {

  initMenu({
    menuSpeed: 100,
    fadeOutSpeed: 200,
    closeGap: 100,
    linksHeight: 64,
    paddingBottom: 0
  });

  function closeSubmenus() {
    var subsubmenus = $('.sub-submenu-link.opened');
    var timeOut = 0;

    if (subsubmenus.length) {
      closeSubmenu(subsubmenus);
      timeOut = 250;
    }

    // Closes subsubmenus first and waits for closing submenus
    setTimeout(function () {
      $('.menu li.opened')
        .removeClass('opened')
        .find('.submenu').animate({
          height: 0
        }, 200, function () {
          $(this).hide();
        });
    }, timeOut);

    timeOut *= 2;

    return timeOut;
  }

  /*left nav menu*/

  function initMenu(config) {
    var $menu = $('.menu');
    var $mainContainer = $('.main-container');
    var $spans = $menu.find('span');
    var $hamburgerButton = $('.hamburger-container');
    // var $submenuOptions = $('.menu-item-container');

    var width = {};

    // Initial width
    width.opened = $menu.css('width');

    // Close menu
    $spans.hide();
    $menu.addClass('closed');

    // Closed width
    width.closed = $menu.css('width');

    console.log({ width })

    if (desktop) {
      // Shows menu
      $spans.show();
      $menu.removeClass('closed');
    }

    // Menu left padding
    $mainContainer.css('padding-left', desktop ? width.opened : width.closed);

    // Binding click events for menu
    $menu.find('a').on('click', function (event) {
      if (!$(this).siblings('.submenu').length) {
        event.stopPropagation();
      }
    });
    $hamburgerButton.on('click', toggleMenu);
    $menu.find('li').on('click', toggleSubmenu);
    $menu.find('.sub-submenu-link').on('click', function (event) {
      event.stopPropagation();
      toggleSubmenu.bind(this, event, true)();
    });
    // $submenuOptions.on('click', toggleSubmenu);

    function toggleMenu() {
      var closed = $menu.hasClass('closed');
      var animateWidth;
      var delay = 0;

      if (closed) {
        animateWidth = width.opened;
      } else {
        animateWidth = width.closed;
        delay = config.fadeOutSpeed + config.closeGap;
        $spans.fadeOut(config.fadeOutSpeed);
        delay += closeSubmenus();
      }

      setTimeout(function () {
        // Changes main content padding
        $mainContainer.animate({
          paddingLeft: animateWidth
        }, config.menuSpeed);

        // Open/close menu
        $menu.animate({
          width: animateWidth
        }, config.menuSpeed, function () {
          $menu.toggleClass('closed');
          closed && $spans.fadeIn();
        });
      }, delay);
    }

    function toggleSubmenu(event, isSubmenu) {
      var $item = $(this);
      var subSubmenu = isSubmenu && !$item.hasClass('sub-submenu-link');

      if (subSubmenu || $item.prop('tagName') !== 'LI') {
        //return;
      }

      event.preventDefault();
      event.stopPropagation();

      var $submenu = isSubmenu
        ? $item.next('.submenu')
        : $item.children('.submenu');

      var $submenuItems = $submenu.children('a');
      var menuOpened = $item.hasClass('opened');
      var menuClosed = !menuOpened;
      var height = 0;
      var timeout = 0;

      if (menuClosed) {
        height = $submenuItems.length * config.linksHeight + config.paddingBottom;

        if ($menu.hasClass('closed')) {
          toggleMenu();
        }
      } else {
        var $openedSubmenus = $item.find('.sub-submenu-link.opened');

        if ($openedSubmenus.length) {
          closeSubmenu($openedSubmenus);
          timeout = 250;
        }
      }

      setTimeout(function () {
        $item.toggleClass('opened');

        $submenu.show().animate({
          height: height
        }, 300, function () {
          if (height === 0) {
            $submenu.hide();
          } else {
            $submenu.css('height', 'auto');
          }
        });
      }, timeout);
    }
    console.log({ width })
  }

  function closeSubmenu($submenu) {
    $submenu
      .removeClass('opened')
      .next('.submenu').animate({
        height: 0
      }, 200, function () {
        $(this).hide();
      });
  }

})(jQuery)

