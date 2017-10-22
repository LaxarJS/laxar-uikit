/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import { create } from '../uikit';

describe( 'A UiKit instance', () => {

   let uikit;

   beforeEach( () => {
      uikit = create();
   } );

   describe( 'instantiated for a locale', () => {

      const mockI18n = {
         localize( i18nOptions ) {
            return i18nOptions.de;
         }
      };
      let instance;

      beforeEach( () => {
         instance = uikit.localized( mockI18n );
      } );

      ///////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'uses that locale to get formatting defaults', () => {
         const format = instance.formatter.create( 'decimal' );
         expect( format( 1000.23 ) ).toEqual( '1.000,23' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'uses any formatter options to override the locale defaults', () => {
         const format = instance.formatter.create( 'decimal', { groupingSeparator: '' } );
         expect( format( 1000.23 ) ).toEqual( '1000,23' );
      } );

   } );

} );
