/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/accordion/accordion'
], function( ng, axAccordion ) {
   'use strict';

   var module = ng.module( 'laxar_uikit.controls.accordion', [] );
   axAccordion.createForModule( module );

   return module;
} );
