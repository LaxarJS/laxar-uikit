/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   './lib/dom',
   './lib/formatter',
   './lib/i18n',
   './lib/parser'
], function( dom, formatter, i18n, parser ) {
   'use strict';

   return {
      dom: dom,
      formatter: formatter,
      i18n: i18n,
      parser: parser
   };

} );
