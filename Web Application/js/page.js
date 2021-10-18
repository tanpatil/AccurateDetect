(function($) {

    /** @namespace UI elements */
    var ui = {};

    /** Animation speed */
    ui.speed = 350;

    /** @namespace Theme */
    ui.theme = {

        /** Theme name */
        name: 'default',

        /** Themes root */
        root: 'themes/',

        /** Current theme path */
        path: 'themes/default/assets/',

        /** Initialization */
        init: function(name, root) {
            var theme = this;
            theme.name = name || $.trim($('body').data('theme')) || 'default';
            theme.root = root || 'themes/';
            theme.path = theme.root + theme.name + '/assets/';
            $('[data-src]').each(function() {
                var $image = $(this);
                var src = $image.data('src');
                if (src)
                    $image.attr('src', theme.path + src);
            });
        }
    };

    /** @namespace Preloader */
    ui.preloader = (function() {
        var speed = 500;
        var $images = $([]);
        var $preloader = $([]);

        // Interface
        return {

            /** Add image */
            add: function(src) {
                if ($preloader.length)
                    $images = $images.add('<img src="' + src + '" />');
            },

            /** Show preloader */
            show: function() {
                $preloader.show();
            },

            /**
             * Hide preloader after all images are loaded
             *
             * @param {Function} callback
             */
            hide: function(callback) {
                if (!$preloader.length)
                    return;
                if ($.browser.opera)
                    $images
                        .css('visibility', 'hidden')
                        .appendTo('body')
                        .remove();
                $images
                    .add('img')
                    .imagesLoaded(function() {
                        $preloader.fadeOut(speed, function() {
                            (callback || $.noop)();
                        });
                    });
            },

            /** Initialization */
            init: function() {
                $preloader = $('[data-ui="preloader"]');
            }
        };
    })();

    /** Button */
    ui.button = function() {
        var $buttons = $('[data-ui="button"]');
        if (!$buttons.length)
            return;

        // Button structure
        $buttons.each(function() {
            var $button = $(this);
            $button
                .disableSelection()
                .wrapInner('<span class="normal" />')
                .contents()
                .clone()
                .attr('class', 'hover')
                .appendTo($button)
                .clone()
                .attr('class', 'click')
                .appendTo($button);
        });

        // Click effect
        $(document).on({
            mousedown: function() {
                $(this).addClass('click');
            },
            'mouseup mouseleave': function() {
                $(this).removeClass('click')
            }
        }, '[data-ui="button"]');
    };

    /** Tabs */
    ui.tabs = function() {
        var $tabs = $('[data-ui="tabs"]');
        if (!$tabs.length)
            return;

        // Tabs structure
        $tabs.each(function() {
            var menu = '<div class="menu"><a class="switch"></a><ul>';
            $(this)
                .find('ul')
                .wrap('<div />')
                .parent()
                .addClass('panels')
                .find('li')
                .hide()
                .each(function() {
                    menu += '<li>' + ($(this).data('label') || '') + '</li>';
                })
                .end()
                .before(menu + '</ul></div>')
                .find('li:eq(0)')
                .show()
                .add($('.menu li:eq(0)', this))
                .addClass('active')
                .end()
                .end()
                .prev()
                .disableSelection();
        });

        // Switch tab
        $(document).on('click', '[data-ui="tabs"] .menu li:not(.active)', function() {
            var $tab = $(this);
            $tab
                .siblings()
                .removeClass('active')
                .end()
                .addClass('active');
            var $panels = $tab
                .closest('[data-ui]')
                .find('.panels');
            $panels
                .stop(true, true)
                .height($panels.height());
            var $panel = $panels
                .find('li')
                .stop(true, true)
                .filter('.active')
                .removeClass('active')
                .fadeOut(ui.speed)
                .end()
                .eq($tab.index())
                .addClass('active')
                .fadeIn(ui.speed);
            $panels.animate({height: $panel.height()}, ui.speed, function() {
                $panels.height('auto');
            });
        });

        // Switch between small and full size
        $(window)
            .on('resize', function() {
                $tabs.each(function() {
                    var $tabs = $(this);
                    var $menu = $('.menu', this);
                    var $list = $('.menu ul');
                    $tabs.removeClass('shrink');
                    $menu.removeClass('open');
                    $list
                        .show()
                        .fadeTo(0, 1);
                    var shrink = $menu.height() >= $('li:eq(0)', $list).outerHeight() * 2;
                    $tabs.toggleClass('shrink', shrink);
                    $list.toggle(!shrink);
                });
            })
            .trigger('resize');
        $(document).on('click', '[data-ui="tabs"].shrink .switch', function() {
            var $list = $(this).siblings('ul');
            var visible = $list.is(':visible');
            $list
                .stop(true, true)
                ['slide' + (visible ? 'Up' : 'Down')](ui.speed)
                .clearQueue()
                .fadeTo(ui.speed, visible ? 0 : 1)
                .parent()
                .toggleClass('open');
        });
    };

    /** Accordion */
    ui.accordion = function() {
        var $accordions = $('[data-ui="accordion"]');
        if (!$accordions.length)
            return;

        // Accordion structure
        $accordions.each(function() {
            $('li', this).each(function() {
                var $item = $(this);
                $item
                    .wrapInner('<div class="content" />')
                    .prepend('<div class="label">' + ($item.data('label') || '') + '</div>')
                    .find('.label')
                    .disableSelection();
            });
        });

        // Switch item
        $(document).on('click', '[data-ui="accordion"] .label', function() {
            var $item = $(this).parent();
            $item
                .find('.content')
                .stop(true, true)
                .slideToggle(ui.speed)
                .end()
                .toggleClass('active')
                .stop(true, true)
                .siblings('.active')
                .removeClass('active')
                .find('.content')
                .slideUp(ui.speed);
        });
    };

    /** Message boxes */
    ui.message = function() {
        var $messages = $('[data-ui="message"]');
        if (!$messages.length)
            return;

        // Message structure
        $messages.each(function() {
            $(this).append('<a class="close" />');
        });

        // Hide message
        $(document).on('click', '[data-ui="message"] .close', function() {
            $(this)
                .parent()
                .slideUp(ui.speed)
                .clearQueue()
                .fadeOut(ui.speed);
        });
    };

    /** Graph */
    ui.graph = function() {
        var $graphs = $('[data-ui="graph"]');
        if (!$graphs.length)
            return;

        // Graph structure
        $graphs.each(function() {
            $('li', this).each(function() {
                var $item = $(this);
                var width = ($item.data('percent') || 0) + '%';
                $item
                    .wrapInner('<div class="label" />')
                    .wrapInner('<div class="bar" />')
                    .find('.label')
                    .text($item.text() + ' ' + width);
            });
        });

        // Animation
        var $window = $(window)
        $window.on('scroll', function() {
            var $graphs = $('[data-ui="graph"]:not(.visible)');
            if (!$graphs.length)
                return;
            var top = $window.scrollTop();
            var bottom = top + $window.height();
            $graphs.each(function() {
                var $graph = $(this);
                var graphTop = $graph.offset().top;
                var graphBottom = graphTop + $graph.height();
                if (graphTop > top && graphTop < bottom || graphBottom > top && graphBottom < bottom) {
                    $graph
                        .addClass('visible')
                        .find('li')
                        .each(function() {
                            var width = ($(this).data('percent') || 0) + '%';
                            $('.bar', this).animate({width: width}, 2000, 'easeOutBounce');
                        });
                }
            });
        });
    };

    /** Initialization */
    ui.init = function() {
        ui.theme.init();
        ui.preloader.init();
        ui.button();
        ui.tabs();
        ui.accordion();
        ui.message();
        ui.graph();
    }

    $(function() {

        // Initialize UI
        ui.init();

        /** @namespace Utility functions */
        var utils = {};

        /**
         * Execute callback and add it to resize event
         *
         * @param {Function} callback
         */
        utils.resize = function(callback) {
            callback();
            $(window).on('resize', callback);
        },

        /** @namespace Media queries */
        utils.layout = (function() {
            var callbacks = [];
            var $window = $(window);

            // Steps on which callbacks will be called
            var steps = [320, 480, 768, 1024, 1280, 1440];

            /**
             * Round width to step
             *
             * @param {Number} width
             *
             * @returns Step
             */
            function step(width) {
                for (var n = 0; n < steps.length; n++)
                    if (width <= steps[n])
                        return steps[n];
                return Number.MAX_VALUE;
            }

            // Last step
            var last = step($window.width());

            // On each step call all callbacks
            utils.resize(function() {
                var current = step($window.width());
                if (current != last) {
                    last = current;
                    for (var n = 0; n < callbacks.length; n++)
                        callbacks[n](current);
                }
            });

            // Interface
            return {

                /** Return current step */
                width: function() {
                    return last;
                },

                /**
                 * Register callback
                 *
                 * @param {Function} callback
                 */
                change: function(callback) {
                    callback(last);
                    callbacks.push(callback);
                }
            };
        })();

        /** @namespace Common functions */
        var common = {};

        /** Browser sniffing */
        common.browser = function() {
            $('body')
                .toggleClass('ie8', $.browser.msie && $.browser.version == 8)
                .toggleClass('ie9', $.browser.msie && $.browser.version == 9);
        };

        /** @namespace Combo box */
        common.combo = (function() {
            var speed = 250;

            // Interface
            return {

                /**
                 * Toggle menu
                 *
                 * @param {Object|String} element
                 * @param {Boolean}       [show]
                 * @param {Boolean}       [animate]
                 */
                toggle: function(element, show, animate) {
                    var $combo = $(element);
                    $combo = !$combo.is('.combo') ? $combo.closest('.combo') : $combo;
                    if (!$combo.length || $combo.is(':animated'))
                        return;
                    show = typeof show == 'undefined' ? !$combo.is('.open') : show;
                    $combo
                        .toggleClass('open', show)
                        .find('ul')
                        .stop()
                        ['slide' + (show ? 'Down' : 'Up')](animate === false ? 0 : speed);
                },

                /** Initialization */
                init: function() {
                    $(document)
                        .on('click', '.combo .switch', function() {
                            common.combo.toggle(this);
                            return false;
                        })
                        .on('mouseup', '.combo ul a', function() {
                            common.combo.toggle(this, false);
                        })
                        $(document).on('click', function() {
                            $('.combo').each(function() {
                                common.combo.toggle(this, false);
                            });
                        });
                    utils.resize(function() {
                        $('.combo').each(function() {
                            common.combo.toggle(this, false, false);
                        });
                    });
                }
            };
        })();

        /** Menu bar */
        common.menu = (function() {
            var $menu = $('#menu');
            if ($menu.length) {
                var speed = {
                    toggle: 250,
                    scroll: 350
                };
                var height = $('li:eq(0)', $menu).outerHeight();
                var $window = $(window);
                var $trigger = $($menu.data('trigger'));
                var trigger = !!$trigger.length;
            }

            // Interface
            return {

                /**
                 * Toggle menu
                 *
                 * @param {Boolean} [show]
                 * @param {Boolean} [animate]
                 */
                toggle: function(show, animate) {
                    if ($menu.is(':animated'))
                        return;
                    var state = $menu.is(':visible');
                    show = !arguments.length ? !state : show;
                    if (show != state)
                        $menu
                            .stop()
                            ['slide' + (show ? 'Down' : 'Up')](animate === false ? 0 : speed.toggle);
                },

                /**
                 * Show or hide menu according to its position against trigger element
                 *
                 * @param {Boolean} [animate]
                 */
                refresh: function(animate) {
                    if (trigger)
                        if (!$menu.is('.fixed'))
                            common.menu.toggle(true, false);
                        else
                            common.menu.toggle($window.scrollTop() >= $trigger.offset().top - height, animate !== false);
                },

                /** Initialization */
                init: function() {
                    if (!$menu.length)
                        return;

                    // Flag determining whether to select current section during scrolling
                    var waypoints = true;

                    // Menu items
                    var $list = $('ul', $menu);

                    // Toggle between fixed and static
                    var $body = $('body');
                    utils.layout.change(function(width) {
                        var fixed = width > 480;
                        $menu
                            .toggleClass('fixed', fixed)
                            .toggleClass('normal', !fixed);
                        if (trigger)
                            common.menu.refresh();
                        else
                            $body.css('padding-top', fixed ? height : 0);
                    });

                    // Toggle between combo and list
                    var $page = $('#page');
                    var page = $page.offset();
                    utils.resize(function() {
                        var width = $page.outerWidth();
                        $menu
                            .css({
                                width: width,
                                marginLeft: $menu.is('.normal') ? 0 : -(width / 2)
                            })
                            .removeClass('combo full');
                        $list.show();
                        var full = Math.floor($menu.outerHeight() / height) == 1;
                        $menu
                            .toggleClass('full', full)
                            .toggleClass('combo', !full);
                        $list.removeAttr('style');
                    });

                    // Show or hide menu on scroll if trigger element is defined
                    if (trigger) {
                        $window.on('scroll', common.menu.refresh);
                        common.menu.refresh(false);
                    }

                    // Scroll to section
                    $('[href*="#"], .top *', $menu).on('click', function() {
                        var $link = $(this);
                        if ($link.parent().is('.active'))
                            return false;
                        var top = 0;
                        if (!$link.parent().is('.top')) {
                            var $target = $(this.hash);
                            if (!$target.length)
                                return;
                            top = $target.offset().top - height;
                        }
                        waypoints = false;
                        $('html, body').animate({scrollTop: top}, speed.scroll, function() {
                            waypoints = true;
                        });
                        if (!$link.parent().is('.top'))
                            $link
                                .parent()
                                .addClass('active')
                                .siblings()
                                .removeClass('active');
                        return false;
                    });

                    // Select current section during scrolling
                    $('#about, #services, #portfolio, #contact').waypoint({
                        handler: function(event, direction) {
                            if (waypoints)
                                $menu
                                    .find('[href$="#' + $(this).attr('id') + '"]')
                                    .parent()
                                    .addClass('active')
                                    .siblings()
                                    .removeClass('active');
                        },
                        offset: height
                    });

                    // Show menu after initialization
                    $menu.css('visibility', 'visible');
                }
            };
        })();

        /** Set fixed background to containers with attribute data-fixed */
        common.fixed = function() {
            $('[data-fixed]').each(function() {
                var $container = $(this);
                var background = $container.data('fixed');
                ui.preloader.add(background);
                background = 'url(' + background + ') no-repeat center top fixed';
                $container
                    .css('background', background)
                    .prepend('<div class="pattern" />');
            });
        };

        /** Social icons hover effect */
        common.social = function() {
            $('a.social').each(function() {
                $(this).append('<span class="hover" />');
            });
            $('#contact .social a').each(function() {
                $(this)
                    .append('<span class="icon" />')
                    .append('<span class="hover" />');
            });
        };

        /** Sliders initialization */
        common.sliders = function() {
            $('.slider').each(function() {
                $(this)
                    .find('li')
                    .wrapInner('<div class="content" />')
                    .wrapInner('<div class="center" />')
                    .wrapInner('<div class="wrapper" />')
                    .each(function() {
                        var src = $(this).data('background');
                        background = src ? 'url(' + src + ') no-repeat center top fixed' : 'none';
                        var $background = $('<div class="background" />').css('background', background);
                        if (src) {
                            $background.append('<div class="pattern" />');
                            ui.preloader.add(src);
                        }
                        $background.prependTo(this);
                    })
                    .end()
                    .sequence({
                        autoPlay: false,
                        prevButton: $('.arrow.left', this),
                        nextButton: $('.arrow.right', this)
                    });
            });
        };

        /** @namespace Forms */
        common.forms = {

            /** @namespace Form validation */
            validation: {

                /**
                 * Any value
                 *
                 * @param   {String}  value Input value
                 *
                 * @returns {Boolean}
                 */
                any: function(value) {
                    return !!$.trim(value).length;
                },

                /**
                 * E-mail
                 *
                 * @param   {String}  value Input value
                 *
                 * @returns {Boolean}
                 */
                email: function(value) {
                    var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return pattern.test(value);
                },

                /**
                 * Register form for validation before submit
                 *
                 * @param {Object|String} form Form element or selector
                 */
                register: function(form) {
                    var $form = $(form);
                    $form.on('submit', function() {
                        var invalid = 0;
                        $('[data-require]', $form).each(function() {
                            var $input = $(this);
                            var value = $.trim($input.val());
                            value = value == $input.data('placeholder') ? '' : value;
                            var type = $.trim($input.data('require'));
                            if (common.forms.validation[type]) {
                                var valid = common.forms.validation[type](value);
                                $input.toggleClass('invalid', !valid);
                                invalid += valid ? 0 : 1;
                            }
                        });
                        $('.invalid', form).each(function() {
                            var $input = $(this);
                            $input
                                .wrap('<div><div></div></div>')
                                .parent()
                                .effect({
                                    effect: 'shake',
                                    duration: 1000,
                                    times: 2,
                                    distance: 4,
                                    complete: function() {
                                        $input.unwrap().unwrap();
                                    }
                                });
                        });

                        return !invalid;
                    });
                },

                /** Initialization */
                init: function() {
                    $('form').each(function() {
                        if ($('[data-require]', this).length)
                            common.forms.validation.register(this);
                    });
                }
            },

            /** Init placeholders(attribute data-placeholder) */
            placeholders: function() {

                // Events
                $(document).on({
                    focus: function() {
                        var $input = $(this);
                        if ($.trim($input.val()) == $input.data('placeholder'))
                            $input
                                .val('')
                                .removeClass('placeholder');
                    },
                    blur: function() {
                        var $input = $(this);
                        if (!$.trim($input.val()))
                            $input
                                .val($input.data('placeholder'))
                                .addClass('placeholder');
                    },
                    change: function() {
                        var $input = $(this);
                        return $input.val() != $input.data('placeholder');
                    },
                    keydown: function(event) {
                        if (event.which == 27)
                            $(this)
                                .val('')
                                .trigger('keyup')
                                .trigger('blur');
                    }
                }, '[data-placeholder]');

                // Values
                $('[data-placeholder]').each(function() {
                    var $input = $(this);
                    var value = $.trim($input.val());
                    if (!value || value == $input.data('placeholder'))
                        $input
                            .val('')
                            .trigger('blur');
                });
            },

            /** Initialization */
            init: function() {
                common.forms.placeholders();
                common.forms.validation.init();
                $(document).on('click', 'form .submit', function() {
                    $(this)
                        .closest('form')
                        .trigger('submit');
                    return false;
                });
            }
        };

        /**
         * Lightbox
         *
         * Optional element attributes:
         *
         * data-title     Item title
         * data-text      Item description
         * data-link-text Link text
         * data-link-href Link address
         * data-link      Link address with default text(OPEN)
         */
        common.lightbox = function() {
            $('a.lightbox').fancybox({
                padding: 0,
                openEffect: 'elastic',
                closeEffect: 'elastic',
                nextEffect: 'none',
                prevEffect: 'none',
                helpers: {
                    overlay: {
                        locked: false
                    },
                    title: {
                        type: 'inside'
                    }
                },
                tpl: {
                    next: '<a class="fancybox-nav fancybox-next"><span></span></a>',
                    prev: '<a class="fancybox-nav fancybox-prev"><span></span></a>',
                    closeBtn : '<a class="fancybox-item fancybox-close"></a>'
                },
                beforeLoad: function() {
                    var title = this.element.data('title');
                    var text = this.element.data('text');
                    var link = {
                        href: this.element.data('link')
                    };
                    if (!link.href) {
                        link.href = this.element.data('link-href');
                        link.text = this.element.data('link-text');
                    }
                    if (link.href && !link.text)
                        link.text = 'OPEN';
                    this.title = [
                        title ? '<h2>' + title + '</h2>' : '',
                        text ? '<p>' + text + '</p>' : '',
                        link.href ? '<a href="' + link.href + '">' + link.text + '</a>' : ''
                    ].join('');
                }
            });
        };

        /** @namespace Homepage */
        var home = {};

        /** Header initialization */
        home.header = function() {
            var $header = $('#header');
            var $scroll = $('.scroll', $header);
            var $page = $('#page');
            var $menu = $('#menu');
            if (!$header.length)
                return;
            var $window = $(window);
            utils.resize(function() {
                var menu = $menu.is('.normal') ? $menu.outerHeight() : 0;
                var height = $page.is('.boxed') ? 666 : $window.height() - menu;
                var min = parseInt($header.css('min-height'));
                $header.height(Math.max(min, height));
                common.menu.refresh();
            });
            var $window = $(window);
            $window.on('scroll', function() {
                var windowBottom = $window.scrollTop() + $window.height();
                var headerBottom = $header.offset().top + $header.outerHeight();
                $scroll.toggleClass('hide', $page.is('.boxed') || headerBottom < windowBottom);
            });
            $scroll.on('click', function() {
                $('body, html').animate({scrollTop: $header.offset().top + $header.outerHeight()}, 350);
            });
        };

        /** Create "steps" section structure */
        home.steps = function() {
            $('#steps .step').each(function() {
                $(this)
                    .prepend('<hr />')
                    .find('.icon')
                    .append([
                        '<span class="left"></span>',
                        '<span class="right"></span>'
                    ].join(''));
            });
        };

        /** @namespace Works */
        home.works = (function() {
            if ($('#works').length) {
                var $window = $(window);
                var $categories = $('#works .categories');
                var $container = $('#works .list');
                var $cache;
                var width = 320;
            }

            // Interface
            return {

                /** Organize works */
                organize: function() {
                    var $works = $('li', $container);
                    var container = $container.width();
                    var columns = Math.ceil(container / width);
                    var work = Math.floor(container / columns);
                    $works.width(work);

                    // Webkit hack
                    if ($cache)
                        $cache
                            .width(work)
                            .add($works)
                            .height($works.eq(0).height());
                },

                /**
                 * Filter works by category
                 *
                 * @param {String} category
                 */
                filter: function(category) {
                    var $filter = $([]);
                    if (category == 'all')
                        $filter = $cache;
                    else
                        $cache.each(function() {
                            var categories = $(this).attr('data-category').split(',');
                            if ($.inArray(category, categories) != -1)
                                $filter = $filter.add(this);
                        });
                    home.works.organize();
                    $container.quicksand($filter, {adjustHeight: 'dynamic'}, function() {
                        $('li', $container).each(function() {
                            $(this).hoverdir();
                        });
                    });
                },

                /** Initialization */
                init: function() {
                    if (!$('#works').length)
                        return;

                    // Organize works
                    $container.imagesLoaded(function() {
                        utils.resize(function() {
                            $container
                                .width('auto')
                                .height('auto')
                                .find('li')
                                .height('auto');
                            home.works.organize();
                        });
                    });

                    // Switch categories between combo and list
                    var $list = $('ul', $categories);
                    var line = $('li:eq(0)', $list).outerHeight();
                    utils.resize(function() {
                        $categories.removeClass('combo');
                        $list.show();
                        var box = Math.floor($categories.outerHeight() / line) > 1;
                        $categories.toggleClass('combo', box);
                        $list.removeAttr('style');
                    });
                    common.combo.toggle($categories, false, false);

                    // Hover effect
                    $('li', $container)
                        .find('.hover')
                        .each(function() {
                            var $hover = $(this);
                            var $link = $hover.prev();
                            $hover
                                .wrapInner('<span class="content" />')
                                .wrapInner('<span class="wrapper" />')
                                .detach()
                                .appendTo($link);
                        })
                        .end()
                        .each(function() {
                            $(this).hoverdir();
                        });

                    // Cached items for quicksand effect
                    $cache = $('li', $container.clone());

                    // Filter
                    $('#works .categories').on('click', 'li:not(.active) a', function() {
                        common.combo.toggle($categories, false);
                        var $link = $(this);
                        $link
                            .parent()
                            .addClass('active')
                            .siblings()
                            .removeClass('active');
                        home.works.filter($link.data('category'));
                    });
                }
            }
        })();

        /** Map initialization */
        home.map = function(callback) {
            if (!$('#contact .map').length) {
                (callback || $.noop)();
                return;
            }

            // Load API
            $.getScript('https://www.google.com/jsapi', function() {
                google.load('maps', '3', {other_params: 'sensor=false', callback: function() {

                    // Get map position
                    var $map = $('#contact .map');
                    var latitude = parseFloat(String($map.data('latitude')).replace(',', '.'));
                    var longtitude = parseFloat(String($map.data('longtitude')).replace(',', '.'));
                    var center = new google.maps.LatLng(latitude, longtitude);

                    // Render map
                    var map = new google.maps.Map($map[0], {
                        zoom: 15,
                        scrollwheel: false,
                        center: center,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: false,
                        panControlOptions: {
                            position: google.maps.ControlPosition.LEFT_CENTER
                        },
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.LEFT_CENTER
                        },
                        scaleControlOptions: {
                            position: google.maps.ControlPosition.LEFT_CENTER
                        }
                    });

                    // Center map on window resize
                    google.maps.event.addDomListener(window, 'resize', function() {
                        setTimeout(function() {
                            map.setCenter(center);
                        }, 100);
                    });

                    // Custom marker
                    new google.maps.Marker({
                        draggable: false,
                        map: map,
                        shape: {
                            coord: [63, 0, 68, 1, 72, 2, 75, 3, 77, 4, 80, 5, 81, 6, 83, 7, 85, 8, 86, 9, 88, 10, 89, 11, 90, 12, 91, 13, 93, 14, 94, 15, 95, 16, 95, 17, 96, 18, 97, 19, 98, 20, 99, 21, 99, 22, 100, 23, 101, 24, 101, 25, 102, 26, 103, 27, 103, 28, 104, 29, 104, 30, 104, 31, 105, 32, 105, 33, 106, 34, 106, 35, 106, 36, 107, 37, 107, 38, 107, 39, 107, 40, 108, 41, 108, 42, 108, 43, 108, 44, 108, 45, 109, 46, 109, 47, 109, 48, 109, 49, 109, 50, 109, 51, 109, 52, 109, 53, 109, 54, 109, 55, 109, 56, 109, 57, 109, 58, 109, 59, 109, 60, 109, 61, 109, 62, 109, 63, 108, 64, 108, 65, 108, 66, 108, 67, 108, 68, 107, 69, 107, 70, 107, 71, 107, 72, 106, 73, 106, 74, 106, 75, 105, 76, 105, 77, 104, 78, 104, 79, 104, 80, 103, 81, 103, 82, 102, 83, 101, 84, 101, 85, 100, 86, 99, 87, 99, 88, 98, 89, 97, 90, 96, 91, 95, 92, 95, 93, 94, 94, 93, 95, 91, 96, 90, 97, 89, 98, 88, 99, 86, 100, 85, 101, 83, 102, 82, 103, 80, 104, 77, 105, 75, 106, 72, 107, 68, 108, 63, 109, 46, 109, 41, 108, 37, 107, 34, 106, 32, 105, 29, 104, 27, 103, 26, 102, 24, 101, 23, 100, 21, 99, 20, 98, 19, 97, 18, 96, 16, 95, 15, 94, 14, 93, 14, 92, 13, 91, 12, 90, 11, 89, 10, 88, 10, 87, 9, 86, 8, 85, 8, 84, 7, 83, 6, 82, 6, 81, 5, 80, 5, 79, 5, 78, 4, 77, 4, 76, 3, 75, 3, 74, 3, 73, 2, 72, 2, 71, 2, 70, 2, 69, 1, 68, 1, 67, 1, 66, 1, 65, 1, 64, 0, 63, 0, 62, 0, 61, 0, 60, 0, 59, 0, 58, 0, 57, 0, 56, 0, 55, 0, 54, 0, 53, 0, 52, 0, 51, 0, 50, 0, 49, 0, 48, 0, 47, 0, 46, 1, 45, 1, 44, 1, 43, 1, 42, 1, 41, 2, 40, 2, 39, 2, 38, 2, 37, 3, 36, 3, 35, 3, 34, 4, 33, 4, 32, 5, 31, 5, 30, 5, 29, 6, 28, 6, 27, 7, 26, 8, 25, 8, 24, 9, 23, 10, 22, 10, 21, 11, 20, 12, 19, 13, 18, 14, 17, 14, 16, 15, 15, 16, 14, 18, 13, 19, 12, 20, 11, 21, 10, 23, 9, 24, 8, 26, 7, 28, 6, 29, 5, 32, 4, 34, 3, 37, 2, 41, 1, 46, 0, 63, 0],
                            type: 'poly'
                        },
                        icon: new google.maps.MarkerImage(
                            ui.theme.path + 'marker.png',
                            new google.maps.Size(110, 110),
                            new google.maps.Point(0, 0),
                            new google.maps.Point(55, 110)
                        ),
                        position: new google.maps.LatLng(latitude, longtitude)
                    });

                    // Execute callback when map is ready
                    google.maps.event.addListenerOnce(map, 'idle', callback || $.noop);
                }});
            });
        };

        /** @namespace Blog */
        var blog = {};

        /** Videos responsiveness */
        blog.preview = function() {

            // Fix embedded videos z-index & scrolling issue
            $('iframe[src*=youtube]').each(function() {
                var $iframe = $(this);
                var src = $iframe.attr('src');
                $iframe.attr({
                    src: src + (src.indexOf("?") == -1 ? '?' : "&") + 'wmode=transparent',
                    scrolling: 'no'
                });
            });

            // Wrap all video previews
            $('iframe.video').each(function() {
                $(this)
                    .removeClass('video')
                    .wrap('<div class="video" />');
            });

            // Set video size according to original width and height ratio
            utils.layout.change(function() {
                $('.video').each(function() {
                    var $preview = $(this);
                    var $video = $('iframe', $preview);
                    var width = $video.attr('width');
                    var height = $video.attr('height');
                    var ratio = Math.max(height / width, 200 / $preview.width());
                    $preview.css('padding-bottom', String(ratio * 100) + '%')
                });
            });
        };

        /** @namespace Features */
        var features = {};

        /** Alert demo */
        features.alert = function() {
            $('a.alert').on('click', function() {
                $.alert.open({
                    icon: false,
                    title: 'CREATICO',
                    content: 'Lorem ipsum dolor sit amet.'
                });
            });
        };

        /** @namespace Initialization */
        var init = {};

        /** Common */
        init.common = function() {
            common.browser();
            common.combo.init();
            common.menu.init();
            common.sliders();
            common.fixed();
            common.social();
            common.forms.init();
            common.lightbox();
        };

        /** Homepage */
        init.home = function() {
            home.header();
            home.steps();
            home.works.init();
            home.map(ui.preloader.hide);
        },

        /** Blog */
        init.blog = function() {
            blog.preview();
            ui.preloader.hide();
        };

        /** Features demo */
        init.features = function() {
            features.alert();
            ui.preloader.hide();
        }

        // Page initialization
        init.common();
        var page = $('body').attr('id');
        if (init[page])
            init[page]();
        else
            ui.preloader.hide();
    });
})(jQuery);