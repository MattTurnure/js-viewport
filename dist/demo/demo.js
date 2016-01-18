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
function initMap() {
    'use strict';

    var doc          = document,
        key          = 'AIzaSyBJgJ23ZGw9AajjwzuHLolsplfTByUmU0A',
        latlong      = '35.0566504,-85.3097487', // Walnut Street Bridge, Chattanooga, TN
        staticParams = {
            maptype: 'hybrid',
            scale: 2,
            format: 'png',
            markers: 'color:blue',
            center: latlong,
            zoom: 19,
            size: '640x360',
            key: key
        };

    if ( typeof navigator === 'object' ) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var coords = position.coords;

            latlong = coords.latitude + ',' + coords.longitude;

            // update center with geolocation
            staticParams.center  = latlong;
            staticParams.markers = staticParams.markers + '|' + latlong;

            updateYourLocation()
            makeYourLocationImage();
        });
    } else {
        makeYourLocationImage();
    }

    function makeYourLocationImage() {
        var image  = doc.createElement('img'),
            target = doc.querySelector('#static-img');

        image.alt = '';
        image.src = getStaticUrl();

        target.appendChild(image);
    }

    function updateYourLocation() {
        var heading = doc.querySelector('#heading-main'),
            image   = doc.querySelector('#image-default');

        heading.innerHTML = 'Your Location';
        image.parentNode.removeChild(image);
    }

    function getStaticUrl() {
        return 'https://maps.googleapis.com/maps/api/staticmap?' + getStaticParams();
    }

    function getStaticParams() {
        var params = '',
            param;

        for (param in staticParams) {
            params += param + '=' + staticParams[param] + '&';
        }

        // return params with last ampersand trimmed
        return params.slice(0, -1);
    }

    function convertToAspectRatio(width, height) {
        return getAspectRatioHeight(width) + 'x' + getAspectRatioWidth(height);
    }

    function getAspectRatioHeight(width) {
        return parseInt(width, 10) * 9 / 16; // width * 9 / 16
    }

    function getAspectRatioWidth(height) {
        return parseInt(height, 10) * 16 / 9; // height * 16 / 9
    }
}
(function (doc) {
    'use strict';

    var body    = doc.body,
        message = doc.querySelector('#viewport-type');

    init();

    viewport.watchViewport(function () {
        updateLayout()
    });

    function init() {
        // initialize body class
        body.classList.add('viewport-' + viewport.getType());

        // viewport type appears in background
        message.innerHTML = viewport.getType();
    }

    function updateLayout() {
        body.className = '';
        body.classList.add('viewport-' + viewport.getType());

        message.innerHTML = viewport.getType();
    }
}(document));