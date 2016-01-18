function initMap() {
    'use strict';

    var doc          = document,
        body         = doc.body,
        message      = doc.querySelector('#viewport-type'),
        wrapper      = doc.querySelector('#wrapper'),
        key          = 'AIzaSyBJgJ23ZGw9AajjwzuHLolsplfTByUmU0A',
        latlong      = '35.0566504,-85.3097487', // Walnut Street Bridge, Chattanooga, TN
        staticParams = {
            maptype: 'hybrid',
            scale: 1,
            format: 'png',
            markers: 'color:blue',
            center: latlong,
            zoom: 19,
            size: '640x360',
            key: key
        },
        console = console || {log: function () {}, error: function () {}};

    initLayout();

    if ( typeof navigator === 'object' ) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
        viewport.watchViewport(function () {
            updateLayout();
            updateParamsFromViewport();
        });
    }

    function geolocationSuccess(position) {
        latlong = position.coords.latitude + ',' + position.coords.longitude;

        // update center with geolocation
        staticParams.center  = latlong;
        staticParams.markers = staticParams.markers + '|' + latlong;

        // initialize page
        updateFigcaption();
        updateImage();

        viewport.watchViewport(function () {
            updateLayout();
            updateImage();
        });
    }

    function geolocationError(error) {
        console.error(error.code, error.message);

        // set viewport event
        viewport.watchViewport(function () {
            updateLayout();
            updateParamsFromViewport();
        });
    }

    function initLayout() {
        // initialize body class
        body.classList.add('viewport-' + viewport.getType());

        // viewport type appears in background
        message.innerHTML = viewport.getType();

        if (viewport.getType() === 'widescreen' && !doc.querySelector('#sidebar')) {
            // add sidebar
            wrapper.className += ' has-sidebar';
            buildSidebar();
        }
    }

    function updateLayout() {
        body.className = '';
        body.classList.add('viewport-' + viewport.getType());

        message.innerHTML = viewport.getType();

        // add sidebar
        console.log(doc.querySelector('#sidebar'));
        if (viewport.getType() === 'widescreen' && !doc.querySelector('#sidebar')) {
            wrapper.className += ' has-sidebar';
            buildSidebar();
        }
    }

    function buildSidebar() {
        var sidebar = doc.createElement('aside');

        sidebar.id = 'sidebar';
        sidebar.className = 'sidebar';
        wrapper.appendChild(sidebar);

        renderAjaxFrag('demo/frags/sidebar.html', function () {
            console.log('sidebar loaded');
        });
    }

    function renderAjaxFrag(url, cb) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                sidebar.innerHTML = xmlhttp.responseText;
            }
        };

        xmlhttp.open('GET', url , true);
        xmlhttp.send();

        if (typeof cb === 'function') {
            cb();
        }
    }

    function updateParamsFromViewport() {
        if (viewport.getType() === 'widescreen') {
            staticParams.scale = 2;
        }
    }

    function updateImage() {
        var target = doc.querySelector('#static-img');

        if (viewport.getType() === 'widescreen') {
            staticParams.scale = 2;
        }

        target.src = getStaticImageUrl();
    }

    function updateFigcaption() {
        var heading = doc.querySelector('#heading-main');

        heading.innerHTML = 'Your Location';
    }

    function getStaticImageUrl() {
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