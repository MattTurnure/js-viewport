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
            size: '640x400',
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
}