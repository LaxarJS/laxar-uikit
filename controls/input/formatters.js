/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'laxar',
   'moment',
   './constants'
], function( ax, moment, constants ) {
   'use strict';

   var NUMERICAL_STRING_REGEXP = /^(\+|\-)?\d+(\.\d+)?$/;

   var formatters = {

      string: function( options, str ) {
         if( str == null ) { return ''; }
         return '' + str;
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      decimal: function( options, number ) {
         if( number == null ) { return ''; }

         if( typeof number === 'string' && NUMERICAL_STRING_REGEXP.exec( number ) ) {
            number = parseFloat( number );
         }
         else
         if( typeof number !== 'number' ) {
            throw new TypeError( 'Expected argument of type number, but got "' +
               typeof number + '". Value: ' + number );
         }

         var numberParts = toPrecision( number, options.decimalPlaces, options.decimalTruncation ).split( '.' );
         var integerPart = numberParts[0].replace( /^[\-+]/, '' );
         var fractionPart = numberParts[1] || '';

         var integerLength = integerPart.length - 1;
         var front = integerPart.split( '' ).reduce( function( str, digit, index ) {
            var pos = integerLength - index;
            return str + digit + ( pos % 3 === 0 && pos !== 0 ? options.groupingSeparator : '' );
         }, number < 0 ? '-' : '' );

         return front + ( fractionPart.length > 0 ? options.decimalSeparator + fractionPart : '' );
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      integer: function( options, number ) {
         var integerOptions = ax.object.options( { decimalPlaces: 0 }, options );
         return formatters.decimal( integerOptions, number );
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      date: createDateTimeFormatter( 'date', constants.ISO_DATE_FORMAT ),

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      time: createDateTimeFormatter( 'time', constants.ISO_TIME_FORMAT )
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createDateTimeFormatter( type, isoFormat ) {
      return function( options, value ) {
         if( value == null ) { return ''; }

         if( typeof value !== 'string' ) {
            throw new TypeError( 'Expected argument as ISO-8601 ' + type + ' string of the form ' +
               isoFormat + ', but got "' + typeof value + '". Value: ' + value );
         }

         var momentTime = value.toLowerCase() === 'now' ? moment() : moment( value, isoFormat, true );
         if( !momentTime.isValid() ) {
            throw new TypeError( 'Expected argument as ISO-8601 ' + type + ' string of the form ' +
               isoFormat + ', but got "' + typeof value + '". Value: ' + value );
         }

         return momentTime.format( options[ type + 'Format' ] );
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function toPrecision( number, places, truncation ) {
      // Define a maximum precision for truncation=NONE, taking into account 32bit machine limits.
      // We cannot use Number.toFixed because of rounding errors in MSIE8.
      var MAX_SIGNIFICANT_PLACES = 14;
      if( truncation === 'NONE' ) {
         places = MAX_SIGNIFICANT_PLACES;
      }

      if( places === 0 ) {
         return '' + Math.round( number );
      }

      var multiplier = Math.pow( 10, places );
      var str = '' + ( Math.round( number * multiplier ) / multiplier );

      // Detect and avoid scientific notation for numbers x where |x| << 10^(-5)
      // A heuristic is used to avoid unnecessary string operations for "regular" numbers
      var absNumber = Math.abs( number );
      if( absNumber < 0.0001 ) {
         var exponent = parseInt( str.split( 'e-' )[ 1 ], 10 );
         if( exponent ) {
            var base = '' + Math.pow( 10, exponent - 1 ) * Math.round( absNumber * multiplier ) / multiplier;
            str = number < 0 ? '-' : '';
            str += '0.' + ( zeros( exponent - 1 ) + base.substring( 2 ) );
         }
      }

      if( truncation === 'BOUNDED' || truncation === 'NONE' ) {
         return str;
      }

      var tmp = str.split( '.' );
      if( tmp.length === 1 ) {
         return str + '.' + zeros( places );
      }

      return str + zeros( places - tmp[1].length );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function zeros( count ) {
      return new Array( count + 1 ).join( '0' );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      create: function( type, options ) {
         return formatters[ type ].bind( formatters, options );
      }
   };

} );
