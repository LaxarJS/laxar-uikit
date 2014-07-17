/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'laxar',
   '../../lib/i18n',
   './helpers',
   // Overly specific import to avoid conflict with relative json-imports:
   // https://github.com/LaxarJS/laxar_uikit/issues/30
   'json!../input/messages.json'
], function( ax, i18n, helpers, messages ) {
   'use strict';

   // this currently is duplicated in input.js. Thus when changing this here, remember to change it there ...
   var EVENT_REFRESH = 'axInput._refresh';

   var requiredDirectiveName = 'axInputRequired';
   var requiredDirective = [ function() {
      return {
         restrict: 'A',
         priority: 9, // ensure linking after axInput but before other validators
         require: 'axInput',
         link: function( scope, element, attrs, axInputController ) {

            axInputController.addSemanticValidator(
               function( value ) {
                  var required = scope.$eval( attrs[ requiredDirectiveName ] );
                  return !required || ( value != null && (''+value).trim() !== '' );
               },
               function() {
                  var msgKey = 'SEMANTIC_REQUIRED';
                  if( axInputController.valueType === 'select' ) {
                     msgKey += '_' + axInputController.valueType.toUpperCase();
                  }
                  return message( scope, msgKey );
               }
            );

            scope.$watch( attrs[ requiredDirectiveName ], function() {
               scope.$broadcast( EVENT_REFRESH );
            } );
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var maximumDirectiveName = 'axInputMaximumValue';
   var maximumDirective = [ function() {
      return {
         restrict: 'A',
         require: 'axInput',
         priority: 10, // ensure linking after axInput and required validation
         link: function( scope, element, attrs, axInputController ) {

            function maximum() {
               return scope.$eval( attrs[ maximumDirectiveName ] );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var isSmallerOrEqual = helpers.isSmallerOrEqual.bind( helpers, axInputController.valueType );
            axInputController.addSemanticValidator(
               function( value ) {
                  return value === null || isSmallerOrEqual( maximum(), value );
               },
               function() {
                  var msgKey = 'SEMANTIC_MAXIMUM_' + axInputController.valueType.toUpperCase();
                  if( axInputController.valueType === 'date' && maximum().toLowerCase() === 'now' ) {
                     msgKey += '_NOW';
                  }
                  return helpers.substitute(
                     message( scope, msgKey ),
                     { maximumValue: axInputController.format( maximum() ) }
                  );
               }
            );
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var minimumDirectiveName = 'axInputMinimumValue';
   var minimumDirective = [ function() {
      return {
         restrict: 'A',
         require: 'axInput',
         priority: 10, // ensure linking after axInput and required validation
         link: function( scope, element, attrs, axInputController ) {

            function minimum() {
               return scope.$eval( attrs[ minimumDirectiveName ] );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var isGreaterOrEqual = helpers.isGreaterOrEqual.bind( helpers, axInputController.valueType );
            axInputController.addSemanticValidator(
               function( value ) {
                  return value === null || isGreaterOrEqual( minimum(), value );
               },
               function() {
                  var msgKey = 'SEMANTIC_MINIMUM_' + axInputController.valueType.toUpperCase();
                  if( axInputController.valueType === 'date' && minimum().toLowerCase() === 'now' ) {
                     msgKey += '_NOW';
                  }
                  return helpers.substitute(
                     message( scope, msgKey ),
                     { minimumValue: axInputController.format( minimum() ) }
                  );
               }
            );
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var rangeDirectiveName = 'axInputRange';
   var rangeDirective = [ function() {
      return {
         restrict: 'A',
         require: 'axInput',
         priority: 10, // ensure linking after axInput and required validation
         link: function( scope, element, attrs, axInputController ) {

            function range() {
               var rangeString = scope.$eval( attrs[ rangeDirectiveName ] );
               var rangeParts = rangeString.split( ',' ).map( function( part ) { return part.trim(); } );

               if( rangeParts.length === 2 ) {
                  return {
                     from: rangeParts[0],
                     to: rangeParts[1]
                  };
               }
               else if( rangeString ) {
                  throw new Error( 'A range must consist of two values of correct type separated by comma. ' +
                     'Instead got: ' + rangeString );
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var isInRange = helpers.isInRange.bind( helpers, axInputController.valueType );
            axInputController.addSemanticValidator(
               function( value ) {
                  var currentRange = range();
                  return isInRange( currentRange.from, currentRange.to, value );
               },
               function() {
                  return helpers.substitute(
                     message( scope, 'SEMANTIC_RANGE_' + axInputController.valueType.toUpperCase() ), {
                        minimumValue: axInputController.format( range().from ),
                        maximumValue: axInputController.format( range().to )
                     }
                  );
               }
            );
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var maximumLengthDirectiveName = 'axInputMaximumLength';
   var maximumLengthDirective = [ function() {
      return {
         restrict: 'A',
         require: 'axInput',
         priority: 10, // ensure linking after axInput and required validation
         link: function( scope, element, attrs, axInputController ) {

            function maximumLength() {
               return parseInt( scope.$eval( attrs[ maximumLengthDirectiveName ] ), 10 );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            axInputController.addSemanticValidator(
               function( value ) { return value.length <= maximumLength(); },
               function() {
                  return helpers.substitute(
                     message( scope, 'SEMANTIC_LENGTH_STRING' ),
                     { maximumLength: axInputController.format( maximumLength() ) }
                  );
               }
            );
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function message( scope, key ) {
      var languageTag = i18n.languageTagFromScope( scope );
      var messagesForLanguage = ax.i18n.localizeRelaxed( languageTag, messages );
      if( !messagesForLanguage ) {
         return 'No translations found for language tag "' + languageTag + '" (Translating "' + key + '").';
      }
      if( !messagesForLanguage.hasOwnProperty( key ) ) {
         return 'No message found for language tag "' + languageTag + '" and key "' + key + '".';
      }

      return messagesForLanguage[ key ];
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module.directive( requiredDirectiveName, requiredDirective );
         module.directive( maximumDirectiveName, maximumDirective );
         module.directive( minimumDirectiveName, minimumDirective );
         module.directive( rangeDirectiveName, rangeDirective );
         module.directive( maximumLengthDirectiveName, maximumLengthDirective );
      }
   };

} );
