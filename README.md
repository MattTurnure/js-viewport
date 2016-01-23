# JS Viewport

## Install and Bootstrap

1. `npm install js-viewport`
2. Or download the [zip](https://github.com/MattTurnure/js-viewport/archive/master.zip) from GitHub
3. Add this in your head tag: `<link rel="stylesheet" href="[assetsPath]/js-viewport.css">`
4. Add this script tag: `<script src="[assetsPath]/js-viewport.js" ></script>`

Checkout a [demo](http://mattturnure.github.io/js-viewport/).

## Basic Usage

### The CSS

Basically, you set variables as generated content in the CSS. The JavaScript then reads those generated values from the page. By managing your media queries in your CSS and allowing JS to follow that lead, your presentational layer and behavioral layer are totally synced up. Another benefit is you don't have to replicate your breakpoints in your JS with `matchMedia`.

``` css
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

Feel free to change the breakpoints for your own needs. You can add new ones as long as you update the `types` array. In the standard version, the array is located at the top of `js-viewport.js`. There is also an (AngularJS version)[https://github.com/MattTurnure/Viewport/tree/angular].

By the way, there is also an `.scss` file in there if you want to bring it into your own Sass build process.

### The JavaScript

There are two methods that `viewport` returns: `getType` and `watchViewport`.

#### `viewport.getType()`

This method returns the generated content value set in the CSS.

``` javascript
console.log(viewport.getType());
// returns 'handheld', 'mini', 'tablet', or 'widescreen'
```

#### `watchViewport`

This method instantiates a resize event that you pass a callback to.

#### Example

``` javascript
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