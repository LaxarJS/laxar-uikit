/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/text_ellipsis/text_ellipsis'
], function( ng, axTextEllipsis ) {
   'use strict';

   var module = ng.module( 'laxar_uikit.controls.text_ellipsis', [] );
   axTextEllipsis.createForModule( module );

   return module;
} );
