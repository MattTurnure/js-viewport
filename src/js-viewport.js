(function (global, doc) {
    'use strict';

    var timer    = 0,
        types = ['handheld', 'mini', 'tablet', 'widescreen'],
        body     = doc.body;

    global.viewport = {
        watchViewport: watchViewport,
        getType: getType,
        types: types
    };

    global.viewport = viewport;

    function watchViewport(cb) {
        // fire method on window resize once the resize event completes
        if (typeof addEventListener === 'function') {
            global.addEventListener('resize', function () {
                clearTimeout(timer);
                timer = setTimeout(cb, 100);
            }, false);
        }
    }

    function getType() {
        var len = types.length,
            content;

        if (typeof getComputedStyle === 'function') {
            content = global.getComputedStyle(body, ':after').getPropertyValue('content');

            while (len--) {
                if (content.indexOf(types[len]) !== -1) {
                    return types[len];
                }
            }
        }

        return types[0];
    }
}(window, document));