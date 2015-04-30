/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   '../parser'
], function( parser ) {
   'use strict';

   var success = parser.success;
   var error = parser.error;
   var parse;

   describe( 'A parser', function() {

      describe( 'for strings', function() {

         beforeEach( function() {
            parse = parser.create( 'string', {} );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns any string as success object of that string', function() {
            expect( parse( 'hello world' ) ).toEqual( success( 'hello world' ) );
            expect( parse( 'true' ) ).toEqual(  success( 'true' ) );
            expect( parse( '1234' ) ).toEqual(  success( '1234' ) );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'for decimals', function() {

         beforeEach( function() {
            parse = parser.create( 'decimal', {
               groupingSeparator: '.',
               decimalSeparator: ','
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns success( null ) for empty strings', function() {
            expect( parse( '' ) ).toEqual( success( null ) );
            expect( parse( '   ' ) ).toEqual( success( null ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns an error for strings that don\'t resemble a numeric value', function() {
            expect( parse( 'hello' ) ).toEqual( error() );
            expect( parse( '6_6_6' ) ).toEqual( error() );
            expect( parse( '6,4,6' ) ).toEqual( error() );
            expect( parse( 'true' ) ).toEqual( error() );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns a success for clearly correct numeric values', function() {
            expect( parse( '12' ) ).toEqual( success( 12 ) );
            expect( parse( '12,234' ) ).toEqual( success( 12.234 ) );
            expect( parse( '1.234.567.890,234' ) ).toEqual( success( 1234567890.234 ) );
            expect( parse( '1234567890,234' ) ).toEqual( success( 1234567890.234 ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns a success for numeric values with misplaced grouping separators', function() {
            expect( parse( '12.34.56789.0,234' ) ).toEqual( success( 1234567890.234 ) );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'for integers', function() {

         beforeEach( function() {
            parse = parser.create( 'integer', {
               groupingSeparator: '.',
               decimalSeparator: ','
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns success( null ) for empty strings', function() {
            expect( parse( '' ) ).toEqual( success( null ) );
            expect( parse( '   ' ) ).toEqual( success( null ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns an error for strings that don\'t resemble a numeric value', function() {
            expect( parse( 'hello' ) ).toEqual( error() );
            expect( parse( '6_6_6' ) ).toEqual( error() );
            expect( parse( '6,4,6' ) ).toEqual( error() );
            expect( parse( 'true' ) ).toEqual( error() );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns an error for numeric values with non-null fraction places', function() {
            expect( parse( '12,45' ) ).toEqual( error() );
            expect( parse( '1234,5' ) ).toEqual( error() );
            expect( parse( '1,00000001' ) ).toEqual( error() );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns a success for clearly correct numeric values', function() {
            expect( parse( '12' ) ).toEqual( success( 12 ) );
            expect( parse( '12,000' ) ).toEqual( success( 12 ) );
            expect( parse( '12,' ) ).toEqual( success( 12 ) );
            expect( parse( '1.234.567.890' ) ).toEqual( success( 1234567890 ) );
            expect( parse( '1234567890' ) ).toEqual( success( 1234567890 ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns a success for numeric values with misplaced grouping separators', function() {
            expect( parse( '12.34.56789.0' ) ).toEqual( success( 1234567890 ) );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'for date', function() {

         beforeEach( function() {
            parse = parser.create( 'date', {
               dateFormat: 'D.M.YYYY',
               dateFallbackFormats: [ 'D.M.YY' ]
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns success( null ) for empty strings', function() {
            expect( parse( '' ) ).toEqual( success( null ) );
            expect( parse( '   ' ) ).toEqual( success( null ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns an error for strings that don\'t resemble a valid date', function() {
            expect( parse( 'hello' ) ).toEqual( error() );
            expect( parse( '6_6_6' ) ).toEqual( error() );
            expect( parse( '6,4,1' ) ).toEqual( error() );
            expect( parse( 'true' ) ).toEqual( error() );
            expect( parse( '53' ) ).toEqual( error() );
            expect( parse( '96' ) ).toEqual( error() );
            expect( parse( '2013' ) ).toEqual( error() );
            expect( parse( '9.13' ) ).toEqual( error() );
            expect( parse( '9.2013' ) ).toEqual( error() );
            expect( parse( '2.14.2013' ) ).toEqual( error() );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns success for completely matching dates', function() {
            expect( parse( '06.09.2013' ) ).toEqual( success( '2013-09-06' ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns success for dates matching a fallback format', function() {
            expect( parse( '6.9.13' ) ).toEqual( success( '2013-09-06' ) );
            expect( parse( '6.9.83' ) ).toEqual( success( '1983-09-06' ) );
            expect( parse( '1.9.1983' ) ).toEqual( success( '1983-09-01' ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'can be configured to wrap two digits dates at a different number (#96)', function() {
            parse = parser.create( 'date', {
               dateFormat: 'D.M.YY',
               dateTwoDigitYearWrap: 10
            } );

            expect( parse( '6.9.13' ) ).toEqual( success( '1913-09-06' ) );
            expect( parse( '6.9.09' ) ).toEqual( success( '2009-09-06' ) );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'for time', function() {

         beforeEach( function() {
            parse = parser.create( 'time', {
               timeFormat: 'H:m:s',
               timeFallbackFormats: [ 'H', 'H:m' ]
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns success( null ) for empty strings', function() {
            expect( parse( '' ) ).toEqual( success( null ) );
            expect( parse( '   ' ) ).toEqual( success( null ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns an error for strings that don\'t resemble a valid time', function() {
            expect( parse( 'hello' ) ).toEqual( error() );
            expect( parse( '6_6_6' ) ).toEqual( error() );
            expect( parse( '6,4,1' ) ).toEqual( error() );
            expect( parse( 'true' ) ).toEqual( error() );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns success for completely matching times', function() {
            expect( parse( '02:34:55' ) ).toEqual( success( '02:34:55' ) );
            expect( parse( '22:34:55' ) ).toEqual( success( '22:34:55' ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns success for times matching a fallback format', function() {
            expect( parse( '2' ) ).toEqual( success( '02:00:00' ) );
            expect( parse( '22' ) ).toEqual( success( '22:00:00' ) );
            expect( parse( '9:13' ) ).toEqual( success( '09:13:00' ) );
            expect( parse( '6:9:13' ) ).toEqual( success( '06:09:13' ) );
         } );

      } );

   } );

} );
