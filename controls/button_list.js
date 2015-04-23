/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/button_list/button_list'
], function( ng, axButtonList ) {
   'use strict';

   var module = ng.module( 'axButtonList', [] );
   axButtonList.createForModule( module );

   return module;
} );
