(function () {
    'use strict';

    var doc            = document,
        hasGeolocation = false,
        body           = doc.body,
        message        = doc.querySelector('#viewport-type'),
        wrapper        = doc.querySelector('#wrapper'),
        main           = doc.querySelector('#content-main'),
        key            = 'AIzaSyBJgJ23ZGw9AajjwzuHLolsplfTByUmU0A',
        lat            = '35.0566504',
        long           = '-85.3097487',// Walnut Street Bridge, Chattanooga, TN
        pageHeading    = 'Walnut Street Bridge, Chattanooga, TN',
        staticParams   = {
            maptype: 'hybrid',
            scale: 2,
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
        listenForResize();
    }

    function geolocationSuccess(position) {
        hasGeolocation = true;

        wrapper.className = 'wrapper has-geolocation';

        // update center with geolocation
        staticParams.lat = position.coords.latitude;
        staticParams.long = position.coords.longitude;
        staticParams.center = position.coords.latitude + ',' + position.coords.longitude;
        staticParams.markers = staticParams.markers + '|' + lat + ',' + long;

        // initialize page
        updatePageHeading();
        updateBackgroundImage();

        if (viewport.getType() === 'widescreen') {
            createMap();
        }

        listenForResize();
    }

    function geolocationError(error) {
        console.error(error.code, error.message);

        // set viewport event
        listenForResize();
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
          '<h1 id="firstHeading" class="firstHeading">'+ pageHeading +'</h1>'+
          '<div id="bodyContent">'+
          '<p>This is what you get when <code>viewport.getType() === "widescreen"</code></p>'+
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

            wrapper.className += ' has-sidebar';
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

        pageHeading = 'Your Location';
        heading.innerHTML = pageHeading;
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