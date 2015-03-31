/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'moment',
   './constants'
], function( moment, constants ) {
   'use strict';

   var NUMERIC_VALUE_MATCHER = /^[+\-]?[0-9]*(\.[0-9]*)?$/;

   var parsers = {

      string: function( options, str ) {
         return success( str );
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      decimal: function( options, str ) {
         var val = ( '' + str ).trim();

         if( val.length === 0 ) {
            return success( null );
         }

         if( options.groupingSeparator ) {
            while( val.indexOf( options.groupingSeparator ) !== -1 ) {
               val = val.replace( options.groupingSeparator, '' );
            }
         }
         val = val.replace( options.decimalSeparator, '.' );

         if( NUMERIC_VALUE_MATCHER.exec( val ) ) {
            var parsed = parseFloat( val );
            if( !isNaN( parsed ) ) {
               return success( parsed );
            }
         }
         return error();
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      integer: function( options, str ) {
         var result = parsers.decimal( options, str );
         if( !result.ok || result.value === null ) {
            return result;
         }

         var integerValue = Math.round( result.value );
         if( result.value !== integerValue ) {
            return error();
         }

         return success( integerValue );
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      date: createDateTimeParser( 'dateFormat', 'dateFallbackFormats', constants.ISO_DATE_FORMAT ),

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      time: createDateTimeParser( 'timeFormat', 'timeFallbackFormats', constants.ISO_TIME_FORMAT )

   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createDateTimeParser( formatKey, fallbackFormatsKey, isoFormat ) {
      return function( options, str ) {
         var val = ( '' + str ).trim();

         if( val.length === 0 ) {
            return success( null );
         }

         var formats = [ options[ formatKey ] ];
         if( options[ fallbackFormatsKey ] && options[ fallbackFormatsKey ].length ) {
            formats = options[ fallbackFormatsKey ].concat( formats );
         }

         var mDate = momentParse( str, formats, options );
         return mDate.isValid() ? success( mDate.format( isoFormat ) ) : error();
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function success( val ) {
      return {
         ok: true,
         value: val
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function error() {
      return {
         ok: false
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function momentParse( str, formats, options ) {
      var origParseTwoDigitYear = moment.parseTwoDigitYear;
      if( options.dateTwoDigitYearWrap > -1 && options.dateTwoDigitYearWrap < 100 ) {
         moment.parseTwoDigitYear = function( input ) {
            var int = parseInt( input, 10 );
            int = isNaN( int ) ? 0 : int;
            return int + ( int > options.dateTwoDigitYearWrap ? 1900 : 2000 );
         };
      }

      try {
         return moment( str, formats, true );
      }
      finally {
         moment.parseTwoDigitYear = origParseTwoDigitYear;
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      create: function( type, options ) {
         return parsers[ type ].bind( {}, options );
      },
      success: success,
      error: error
   };


} );
