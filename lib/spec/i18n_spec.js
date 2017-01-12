/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { create as createUikitI18n } from '../i18n';
import momentFormats from '../moment_formats';
import numberFormats from '../number_formats';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'i18n.momentFormatForLanguageTag( languageTag )', () => {

   let mockAxI18n;
   let i18n;

   beforeEach( () => {
      mockAxI18n = createAxI18nMock();
      i18n = createUikitI18n( mockAxI18n );
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

   let mockAxI18n;
   let i18n;

   beforeEach( () => {
      mockAxI18n = createAxI18nMock();
      i18n = createUikitI18n( mockAxI18n );
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createAxI18nMock() {
   return {
      localizeRelaxed: jasmine.createSpy( 'localizeRelaxed' ).and.callFake( (tag, map, fallback) => {
         return map[ tag ] || fallback;
      } )
   };
}
