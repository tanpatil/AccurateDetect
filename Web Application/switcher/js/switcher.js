(function($) {
    $(function() {
        var $switcher = $('#switcher');
        if (!$switcher.length)
            return;

        // Structure
        $('.palette a', $switcher).each(function() {
            var $item = $(this);
            var $pattern = $('<span class="pattern" />')
                .css('background', $item.data('preview'))
                .appendTo($item);
            if ($item.parent().is('.colors'))
                $pattern.append('<span class="shade" />');
        });

        // Items
        $('.palette, .switch', $switcher).each(function() {
            if (!$('.active', this).length)
                $('> a:eq(0)', this).addClass('active');
        });
        $switcher.on('click', '.palette > a, .switch > a', function() {
            $(this)
                .addClass('active')
                .siblings()
                .removeClass('active');
        });

        // CSS
        $switcher.on('click', '.palette[data-css][data-element] a[data-value]', function() {
            var $item = $(this);
            var $container = $item.parent();
            $($container.data('element')).css($container.data('css'), $item.data('value'));
        });

        // Switch
        $switcher.on('click', '.switch a:not(.active)', function() {
            var $item = $(this);
            $item
                .parent()
                .trigger('switch', $item.data('value'));
        });

        // LESS
        var theme = $.trim($('body').data('theme')) || 'default';
        var root = $('link[rel="stylesheet/less"][href*="' + theme + '"]:eq(0)').attr('href');
        root = '"' + root.substring(0, root.lastIndexOf("http://iampierre.com/")) + '"';
        $switcher.on('click', '.palette[data-less] a', function() {
            var $item = $(this);
            var vars = {root: root};
            vars[$item.parent().data('less')] = $item.data('value');
            less.modifyVars(vars);
        });

        // Show/hide
        $('h2 .open', $switcher).on('click', function() {
            $switcher
                .toggleClass('open')
                .find('ul')
                ['slide' + ($switcher.is('.open') ? 'Down' : 'Up')](350);
        });

        // Layout
        $('.switch.layout', $switcher).on('switch', function(event, value) {
            $('#page').attr('class', value);
            $('.boxed', $switcher)['slide' + (value == 'boxed' ? 'Down' : 'Up')](350);
            $(window)
                .trigger('resize')
                .trigger('scroll');
        });
    });
})(jQuery);