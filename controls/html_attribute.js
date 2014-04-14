/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   './html_attribute/html_attribute'
], function( ng, axHtmlAttribute ) {
   'use strict';

   var module = ng.module( 'laxar_uikit.controls.html_attribute', [] );
   axHtmlAttribute.createForModule( module );

   return module;
} );