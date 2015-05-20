/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar-uikit/controls/json_form/json_form'
], function( ng, axJsonForm ) {
   'use strict';

   var module = ng.module( 'axJsonForm', [] );
   axJsonForm.createForModule( module );

   return module;
} );
