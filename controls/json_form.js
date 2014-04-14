/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/json_form/json_form'
], function( ng, axJsonForm ) {
   'use strict';

   var module = ng.module( 'laxar_uikit.controls.json_form', [] );
   axJsonForm.createForModule( module );

   return module;
} );