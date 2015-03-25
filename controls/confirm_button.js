/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/confirm_button/confirm_button'
], function( ng, axConfirmButton ) {
   'use strict';

   var module = ng.module( 'axConfirmButton', [] );
   axConfirmButton.createForModule( module );

   return module;
} );
