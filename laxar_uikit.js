/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   './lib/dom',
   './lib/formatter',
   './lib/parser'
], function( dom, formatter, parser ) {
   'use strict';

   return {
      dom: dom,
      formatter: formatter,
      parser: parser
   };

} );
