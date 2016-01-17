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