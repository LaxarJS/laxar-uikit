/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/i18n/i18n'
], function( ng, axI18n ) {
   'use strict';

   var module = ng.module( 'axI18n', [] );
   axI18n.createForModule( module );

   return module;
} );
