/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   './i18n/i18n'
], function( ng, axButtonList ) {
   'use strict';

   var module = ng.module( 'axI18n', [] );
   axButtonList.createForModule( module );

   return module;
} );
