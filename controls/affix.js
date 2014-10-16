/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/affix/affix'
], function( ng, axAffix ) {
   'use strict';

   var module = ng.module( 'laxar_uikit.controls.affix', [] );
   axAffix.createForModule( module );

   return module;
} );
