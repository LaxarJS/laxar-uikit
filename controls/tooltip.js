/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/tooltip/tooltip'
], function( ng, axTooltip ) {
   'use strict';

   var module = ng.module( 'axTooltip', [] );
   axTooltip.createForModule( module );

   return module;
} );
