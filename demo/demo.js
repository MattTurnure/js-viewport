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
(function () {
    'use strict';

    if (typeof document.body.classList !== 'object') {
        return;
    }

    var doc            = document,
        body           = doc.body,
        message        = doc.querySelector('#viewport-type'),
        wrapper        = doc.querySelector('#wrapper'),
        main           = doc.querySelector('#content-main'),
        infoContent    = doc.querySelector('#info-content'),
        pageHeading    = 'Walnut Street Bridge, Chattanooga, TN',
        key            = 'AIzaSyBJgJ23ZGw9AajjwzuHLolsplfTByUmU0A',
        lat            = '35.0566504',
        long           = '-85.3097487', // Walnut Street Bridge, Chattanooga, TN
        staticParams   = {
            maptype: 'hybrid',
            scale: 1,
            format: 'png',
            markers: 'color:blue',
            center: lat + ',' + long,
            zoom: 19,
            size: '640x360',
            key: key
        };

    updateLayout();

    if ( typeof navigator === 'object' ) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
        initPage();
    }

    function initPage() {
        updatePageHeading();
        updateBackgroundImage();

        if (viewport.getType() === 'widescreen') {
            createMap();
        }

        listenForResize();
    }

    function geolocationSuccess(position) {
        wrapper.classList.add('has-geolocation');

        // update center with geolocation
        lat = position.coords.latitude;
        long = position.coords.longitude;
        staticParams.center = position.coords.latitude + ',' + position.coords.longitude;
        staticParams.markers = staticParams.markers + '|' + position.coords.latitude + ',' + position.coords.longitude;

        // initialize page
        initPage();
    }

    function geolocationError(error) {
        console.error(error.code, error.message);

        // initialize page
        initPage();
    }

    function listenForResize() {
        viewport.watchViewport(function () {
            updateLayout();
            updateParamsFromViewport();

            if (viewport.getType() === 'widescreen' && doc.getElementById('map').innerHTML === '') {
                createMap();
            }
        });
    }

    function createMap() {
        var latlong = new google.maps.LatLng(lat, long);
        var mapOptions = {
            zoom: 19,
            center: latlong,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        var map = new google.maps.Map(doc.getElementById('map'), mapOptions);
        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">JS Viewport</h1>'+
            '<div id="bodyContent">'+
            '<p>There are <em>three</em> distinct experiences in this <code>js-viewport</code> demo:</p>'+
            '<ol>'+
            '<li><strong>Handheld</strong> - This loads in a default background image and basic content that does not depend on <code>JavaScript</code> at all.</li>'+
            '<li><strong>Tablet</strong> - When in this viewport width, a better resolution of the background gets loaded as well. A sidebar is added to the DOM from an AJAX request.</li>'+
            '<li><strong>Widescreen</strong> - At this state, the background image is replaced with a fully-functional Google map.</li>'+
            '</ol>'+
            '<p>This is what you get when <code>viewport.getType() === "widescreen"</code></p>'+
            '<h3>' + pageHeading + '</h3>'+
            '<p><em>' + lat + ', ' + long + '</em></p>'+
            '</div>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var marker = new google.maps.Marker({
            position: latlong,
            map: map,
            title: pageHeading
        });

        wrapper.classList.add('has-map');

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });

        infowindow.open(map, marker);
    }

    function updateLayout() {
        body.className = 'viewport-' + viewport.getType();

        updateStateBackgroundText();

        // add sidebar if it does not exist
        buildSidebar();
    }

    function updateStateBackgroundText() {
        message.innerHTML = viewport.getType();
    }

    function buildSidebar() {
        var sidebar;

        if (viewport.getType() === 'tablet' && !doc.querySelector('#sidebar')) {
            sidebar = doc.createElement('aside');

            wrapper.classList.add('has-sidebar');
            sidebar.id = 'sidebar';
            sidebar.className = 'sidebar';
            wrapper.appendChild(sidebar);

            renderAjaxFrag('demo/frags/sidebar.html', function () {
                console.log('sidebar loaded');
            });
        }
    }

    function renderAjaxFrag(url, cb) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                sidebar.innerHTML = xmlhttp.responseText;

                if (typeof cb === 'function') {
                    cb();
                }
            }
        };

        xmlhttp.open('GET', url , true);
        xmlhttp.send();
    }

    function updateParamsFromViewport() {
        if (viewport.getType() === 'tablet') {
            staticParams.scale = 2;
        }
    }

    function updateBackgroundImage() {
        doc.querySelector('#map-bg').style.backgroundImage = 'url(' + getStaticImageUrl() + ')';
    }

    function updatePageHeading() {
        var heading = doc.querySelector('#heading-main');

        pageHeading = 'Your Coordinates';
        heading.innerHTML = pageHeading;
        infoContent.innerHTML = '' + lat + ', ' + long;
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
}());