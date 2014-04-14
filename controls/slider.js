/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/slider/slider'
], function( ng, axSlider ) {
   'use strict';

   var module = ng.module( 'laxar_uikit.controls.slider', [] );
   axSlider.createForModule( module );

   return module;
} );