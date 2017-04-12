# LaxarJS UiKit [![Build Status](https://travis-ci.org/LaxarJS/laxar-uikit.svg?branch=master)](https://travis-ci.org/LaxarJS/laxar-uikit)

> Bootstrap 3 compatible base styles for LaxarJS widgets, plus a few i18n-UI helpers

This is the home of the _default theme_ for LaxarJS.
Based on the SCSS version of Bootstrap 3.3 together with Font Awesome 4.7, it contains only a small number of additional classes.

Also, this repository contains a number of JavaScript library functions, which are too UI-specific to be included into LaxarJS core.
They are mostly related to formatting and parsing of values (numbers, decimals, dates) in i18n applications.
Learn what's in there for you, by consulting the [API docs](docs/api/laxar-uikit.md).

Of course, the additional JavaScript code will only be bundled as part of your application if it actually imports the `laxar-uikit` module.


## What is the default theme?

Several types of artifacts in a LaxarJS application may be _themed_, namely _widgets, controls_ and _layouts._
The CSS and HTML of such an artifact lives in a subfolder named after each theme that the artifacts support.
However, to allow for reuse of artifacts in different applications, all artifacts should support at least the so-called "default theme".
For example, if a widget called `my-widget` supports the default theme and the [cube theme](https://github.com/laxarjs/cube.theme), it will use two folders (`my-widget/default.theme` and `my-widget/cube.theme`), and each folder may contain a CSS file and an HTML file for the widget.

Although it has a few extra classes (those starting with the `ax-` prefix), you may think of the default theme as _just Bootstrap 3._
When creating custom themes, it is recommended to use a Bootstrap-compatible set of classes, so that any widget can be themed without having to create new HTML markup.
Usually, only the folder `default.theme` will contain the widget HTML, and the other theme folders just specify custom CSS when needed.
If your application is using a custom theme (such as the `cube.theme`), not all widgets need to specify custom CSS for that theme, because LaxarJS will always fall back to the default theme of a widget.
Refer to the [LaxarJS manual on themes](https://laxarjs.org/docs/laxar-v2-latest/manuals/creating_themes) for more information on themes.


## Using LaxarJS UiKit in a project

Including LaxarJS UiKit is currently recommended for any LaxarJS application, except if you're aiming to use a non-standard default theme (see below).

Starting with LaxarJS v2, obtain the UiKit either by starting from the [Yeoman generator](https://laxarjs.org/docs/generator-laxarjs2-v2-latest/) or by using NPM:

```console
npm install --save laxar-uikit
```


### Using the Library

To use the [parser](docs/api/lib.parser.md) and [formatter](docs/api/lib.formatter.md) library functions, import them into a widget or control:

```js
import { formatter } from 'laxar-uikit';

const format = formatter.create( 'decimal', { decimalPlaces: 1 } );
format( Math.PI ); // --> "3.1"
```

Or, if using CommonJS modules:

```js
var formatter = require( 'laxar-uikit' ).formatter;
// ...
```

And, to use i18n:

```js
import { localized } from 'laxar-uikit';

const axI18n = // ... obtained by widget injection, depends on the integration technology
const format = localized( axI18n ).formatter.create( 'decimal' );
// assuming the locale is "de"
format( Math.PI ); // --> "3,14"
```


### Using the default.theme

To load the default theme, your loader (webpack) needs to be setup correctly.
This is already the case if you project was created using the LaxarJS v2 Yeoman generator.

If creating a project from scratch, first make sure you have the dependencies:

```console
npm install --save-dev laxar-loader sass-loader
```

Then add a _resolve alias_ and a _rule configuration_ for the default.theme:

```js
// webpack.config.js
resolve: {
   // ...,
   alias: {
      // ...,
      'default.theme': 'laxar-uikit/themes/default.theme'
   }
},
module: {
   rules: [
      // ...,
      {
         test: /[/]default[.]theme[/].*[.]s[ac]ss$/,
         loader: 'sass-loader',
         options: require( 'laxar-uikit/themes/default.theme/sass-options' )
      }
   ]
}
```

When using webpack and the [laxar-loader](https://laxarjs.org/docs/generator-laxarjs2-v2-latest/), the default theme will now be available for use in your application (through the `init.js`):

```js
// init.js
import { create } from 'laxar';
import artifacts from 'laxar-loader/artifacts?flow=main&theme=default';

create( [ /* ... adapters ... */ ], artifacts, { /* ... configuration ... */ } )
   .flow( 'main', document.querySelector( '[data-ax-page]' ) )
   .bootstrap();
```


## Using a custom default theme

In some cases, your application simply does not work with Bootstrap:
For example, if you're working with a legacy code base, your options may be limited.
Also, you may be producing a mobile-only application an incompatible CSS-framework such as [material design](https://material.io/guidelines/material-design/introduction.html).

You can change to a different default theme by creating a module `laxar.config.js` in your project root, and by setting its `default.theme` export to the path of your own default theme (which should be a directory named `default.theme` containing a folder `css` and a `theme.css` inside of that).

Of course, now you need to make sure that all `default.theme` folders of your project's artifacts are compatible with you own default theme!


## Building LaxarJS UiKit from source

Instead of using a pre-compiled library within a project, you can also clone this repository:

```sh
git clone https://github.com/LaxarJS/laxar-uikit.git
cd laxar-uikit
npm install
```

To see changes in your application, configure your project to work with the sources (e.g. by using webpack), or _rebuild_ the bundles:

```sh
npm run dist
```

To run the automated karma tests:

```sh
npm test
```

To generate HTML spec runners for opening in your web browser, so that you can e.g. use the browser's developer tools:

```sh
npm start
```

Now you can run the specs by browsing to http://localhost:8080/dist/lib/spec/laxar-uikit.spec.html.
