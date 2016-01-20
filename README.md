# JS Viewport
Create variables within CSS media queries that you can use to sync up your width-sensitive JavaScript methods on load and resize events.

Check out the [demo](http://mattturnure.github.io/js-viewport/).

## Install and Bootstrap

1. `npm install js-viewport`
2. Or download the [zip](https://github.com/MattTurnure/js-viewport/archive/master.zip)
3. Add this in your head tag: `<link rel="stylesheet" href="[assetsPath]/js-viewport.css">`
4. Add this script tag: `<script src="[assetsPath]/js-viewport.js" ></script>`

## Basic Usage

There are two factory methods that viewport module returns: `getType` and `watchViewport`.

`viewport.getType` returns the string value based on the viewport width.

Example: `console.log( viewport.getType() ) // possible values returned are handheld, mini, tablet, or widescreen`

`watchViewport` instantiates a resize event that you can pass a callback to.

```
viewport.watchViewport(function () {
    if ( viewport.getType() === 'handheld' ) {
        // doSomeHandheldThing();
    }

    if ( viewport.getType() === 'mini' ) {
        // doSomeMiniThing();
    }

    if ( viewport.getType() === 'tablet' ) {
        // doSomeTabletThing();
    }

    if ( viewport.getType() === 'widescreen' ) {
        // doSomeWidescreenThing();
    }
});
```

### Regarding the CSS

Out of the box, here is what the compiled CSS looks like:

```
@media all and (min-width: 28.125em) {
  body:after {
    content: "mini";
    display: none;
  }
}

@media all and (min-width: 31.25em) {
  body:after {
    content: "tablet";
    display: none;
  }
}

@media all and (min-width: 60em) {
  body:after {
    content: "widescreen";
    display: none;
  }
}
```

Note the `content` property values that get set inside the media queries. Those will act as CSS tokens that JavaScript will read and use later. Feel free to change the widths if your breakpoints are different. Also, you can add new ones as long as you update the `types` array at the top of `js-viewport.js`. `types` is currently set to `['handheld', 'mini', 'tablet', 'widescreen']`.

By the way, there is also an `.scss` file in there if you want to bring it into your own Sass build process.
