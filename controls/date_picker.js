/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar_uikit/controls/date_picker/date_picker'
], function( ng, axDatePicker ) {
   'use strict';

   var module = ng.module( 'laxar_uikit.controls.date_picker', [] );
   axDatePicker.createForModule( module );

   return module;
} );