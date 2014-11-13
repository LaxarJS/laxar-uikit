/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'underscore',
   'moment',
   './constants'
], function( _, moment, constants ) {
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
         var numberParts = toFixed( number, options.decimalPlaces ).split( '.' );
         var integerPart = numberParts[0].replace( /^[\-+]/, '' );
         var fractionPart = numberParts[1] || '';

         var integerLength = integerPart.length - 1;
         var front = integerPart.split( '' ).reduce( function( str, digit, index ) {
            var pos = integerLength - index;
            return str + digit + ( pos % 3 === 0 && pos !== 0 ? options.groupingSeparator : '' );
         }, number < 0 ? '-' : '' );

         return front + ( options.decimalPlaces > 0 ? options.decimalSeparator + fractionPart : '' );
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      integer: function( options, number ) {
         var integerOptions = _.extend( _.clone( options ), { decimalPlaces: 0 } );
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

   function toFixed( number, places ) {
      if( places === 0 ) {
         return '' + Math.round( number );
      }

      var multiplier = Math.pow( 10, places );
      var str = '' + ( Math.round( number * multiplier ) / multiplier );
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
         return _.partial( formatters[ type ], options );
      }
   };

} );
