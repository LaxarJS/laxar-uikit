/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/input/input'
], function( ng, axInput ) {
   'use strict';

   var module = ng.module( 'laxar_uikit.controls.input', [] );
   axInput.createForModule( module );

   return module;
} );