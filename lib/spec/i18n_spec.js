/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   '../i18n',
   '../moment_formats',
   '../number_formats'
], function( i18n, momentFormats, numberFormats ) {
   'use strict';

   describe( 'i18n.languageTagFromScope( scope )', function() {

      var scope;
      var i18nInfo;

      beforeEach( function() {
         i18nInfo = {
            locale: 'default',
            tags: {
               'default': 'de_DE',
               'alternate': 'en_GB'
            }
         };
         scope = {
            $eval: jasmine.createSpy( '$eval' ).andReturn( i18nInfo )
         };
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'calls $eval to receive the value', function() {
         i18n.languageTagFromScope( scope );

         expect( scope.$eval ).toHaveBeenCalledWith( 'i18n' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns the language tag received from the scope', function() {
         expect( i18n.languageTagFromScope( scope ) ).toEqual( 'de_DE' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'i18n.momentFormatForLanguageTag( languageTag )', function() {

      it( 'returns the format for a known language tag', function() {
         expect( i18n.momentFormatForLanguageTag( 'de' ) ).toEqual( momentFormats.de );
         expect( i18n.momentFormatForLanguageTag( 'fr' ) ).toEqual( momentFormats.fr );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns US english format for an unknown language tag', function() {
         expect( i18n.momentFormatForLanguageTag( 'xxx' ) ).toEqual( momentFormats.en );
         expect( i18n.momentFormatForLanguageTag(  ) ).toEqual( momentFormats.en );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'i18n.numberFormatForLanguageTag( languageTag )', function() {

      it( 'returns the format for a known language tag', function() {
         expect( i18n.numberFormatForLanguageTag( 'de' ) ).toEqual( numberFormats.de );
         expect( i18n.numberFormatForLanguageTag( 'fr' ) ).toEqual( numberFormats.fr );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns US english format for an unknown language tag', function() {
         expect( i18n.numberFormatForLanguageTag( 'xxx' ) ).toEqual( numberFormats.en );
         expect( i18n.numberFormatForLanguageTag(  ) ).toEqual( numberFormats.en );
      } );

   } );

} );
