/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'laxar-uikit/controls/i18n',
   'angular-mocks'
], function( i18nModule, angularMocks ) {
   'use strict';

   describe( 'An axLocale control', function() {

      var $compile;
      var $rootScope;

      beforeEach( angularMocks.module( i18nModule.name ) );
      beforeEach( angularMocks.inject( function( _$compile_, _$rootScope_ ) {
         $compile = _$compile_;
         $rootScope = _$rootScope_;
         jasmine.Clock.useMock();
      } ) );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'compiles successfully', function() {

      } );

   } );

} );
