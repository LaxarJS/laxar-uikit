/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar-uikit/controls/accordion/accordion'
], function( ng, axAccordion ) {
   'use strict';

   var module = ng.module( 'axAccordion', [] );
   axAccordion.createForModule( module );

   return module;
} );
