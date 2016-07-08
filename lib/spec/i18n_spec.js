/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { create as createI18nMock } from 'laxar/lib/testing/i18n_mock';
import { create as createUikitI18n } from '../i18n';
import momentFormats from '../moment_formats';
import numberFormats from '../number_formats';

describe( 'i18n.languageTagFromScope( scope )', () => {

   let scope;
   let i18n;

   beforeEach( () => {
      i18n = createUikitI18n( createI18nMock() );
      const i18nInfo = {
         locale: 'default',
         tags: {
            'default': 'de_DE',
            'alternate': 'en_GB'
         }
      };
      scope = {
         $eval: jasmine.createSpy( '$eval' ).and.returnValue( i18nInfo )
      };
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'calls $eval to receive the value', () => {
      i18n.languageTagFromScope( scope );

      expect( scope.$eval ).toHaveBeenCalledWith( 'i18n' );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'returns the language tag received from the scope', () => {
      expect( i18n.languageTagFromScope( scope ) ).toEqual( 'de_DE' );
   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'i18n.momentFormatForLanguageTag( languageTag )', () => {

   let i18n;
   beforeEach( () => {
      i18n = createUikitI18n( createI18nMock() );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'returns the format for a known language tag', () => {
      expect( i18n.momentFormatForLanguageTag( 'de' ) ).toEqual( momentFormats.de );
      expect( i18n.momentFormatForLanguageTag( 'fr' ) ).toEqual( momentFormats.fr );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'returns US english format for an unknown language tag', () => {
      expect( i18n.momentFormatForLanguageTag( 'xxx' ) ).toEqual( momentFormats.en );
      expect( i18n.momentFormatForLanguageTag() ).toEqual( momentFormats.en );
   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'i18n.numberFormatForLanguageTag( languageTag )', () => {

   let i18n;
   beforeEach( () => {
      i18n = createUikitI18n( createI18nMock() );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'returns the format for a known language tag', () => {
      expect( i18n.numberFormatForLanguageTag( 'de' ) ).toEqual( numberFormats.de );
      expect( i18n.numberFormatForLanguageTag( 'fr' ) ).toEqual( numberFormats.fr );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'returns US english format for an unknown language tag', () => {
      expect( i18n.numberFormatForLanguageTag( 'xxx' ) ).toEqual( numberFormats.en );
      expect( i18n.numberFormatForLanguageTag() ).toEqual( numberFormats.en );
   } );

} );
