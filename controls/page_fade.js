/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar-uikit/controls/page_fade/page_fade'
], function( ng, axPageFade ) {
   'use strict';


   var module = ng.module( 'axPageFade', [] );
   axPageFade.createForModule( module );

   /**
    * This control is usually not loaded from a widget, but directly included into the application HTML
    * markup, such as the `index.html` and `debug.html` files in the application template.
    *
    *
    */
   return module;
} );
