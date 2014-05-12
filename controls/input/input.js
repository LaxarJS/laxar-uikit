/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'jquery',
   'laxar',
   'bootstrap-tooltip',
   '../../lib/i18n',
   './formatters',
   './parsers',
   './helpers',
   'json!./messages.json'
], function( $, ax, bootstrapTooltip, i18n, formatters, parsers, helpers, messages ) {
   'use strict';

   var assert = ax.assert;

   /**
    * axInput
    * =======
    *
    * Description:
    * ------------
    * The input directive can be used to enrich a simple input field with type information in order to perform
    * automatic syntactical validation, parsing and formatting. Additionally it is possible to add semantical
    * validators based on simple AngularJS directives using a simple interface of a controller defined within
    * the input directive. Whenever there is an error (be it semantical or syntactical) a tooltip is shown as
    * long as the input field is focussed. Additionally the input field receives the class `error`.
    * Supported value types are `string`, `decimal`, `integer`, `date` and `time`.
    *
    * Basic semantic directives that are already available are:
    * * `ax-input-required` (all types): Requires a value to be entered into the input field
    * * `ax-input-maximum-value="$maximum"` (all except string): requires the value to be below or equal to
    *   $maximum. For dates also the value `'now'` can be used.
    * * `ax-input-minimum-value="$minimum"` (all except string): requires the value to be greater or equal to
    *   $minimum. For dates also the value `'now'` can be used.
    * * `ax-input-range="$minimum, $maximum"` (all except string): requires the value to be greater or equal
    *   to $minimum AND below or equal to $maximum
    * * `ax-input-maximum-length="$maximumLength"` (string only): requires the string's length to be below or
    *   equal to $maximumLength
    *
    * Writing an own semantic validator is as easy as writing a directive requiring the axInputController and
    * calling `addSemanticValidator` with the validator function as first argument and an error message
    * generator function as second argument. A look at the included semantic validators should be sufficient
    * to know how this works.
    *
    * Formatting of the displayed value can be controlled using the `ax-input-formatting` attribute. This
    * takes an object having the following entries:
    * * groupingSeparator (default: `.`): Grouping seperator for decimal and integer values
    * * decimalSeparator (default: `,`): Decimal separator for decimal values
    * * decimalPlaces (default: 2): Number of decimal places to display. Applies rounding if necessary.
    * * dateFormat (default: `DD.MM.YYYY`): Format for date values
    * * timeFormat: (default: 'HH:mm`): Format for time values
    * * dateFallbackFormats: an array of formats to try parsing the value when using `dateFormat` fails
    * * timeFallbackFormats: an array of formats to try parsing the value when using `timeFormat` fails
    * Formats for date and time are given in [MomentJS](http://momentjs.com/docs/#/displaying/format/) syntax.
    *
    * Example:
    * --------
    * A required decimal input with maximum value:
    * ```
    * <input ng-model="someDecimal" ax-input="decimal" ax-input-maximum-value="100000" ax-input-required="true">
    * ```
    *
    * A date input with value range and date picker control:
    * ```
    * <input ng-model="someDate" ax-input="date" ax-input-range="'2010-01-02, 2014-03-01'" ax-input-required="true" data-ax-datepicker>
    * ```
    *
    * A decimal input with special formatting:
    * ```
    * <input ng-model="someDecimal" ax-input="decimal" ax-input-formatting="{groupingSeparator: '_', decimalPlaces: 4}">
    * ```
    */


   var ERROR_CLASS = 'ax-error';
   var ERROR_KEY_SYNTAX = 'syntax';
   var ERROR_KEY_SEMANTIC = 'semantic';

   var EVENT_VALIDATE = 'axInput.validate';

   var DEFAULT_FORMATTING = {
      groupingSeparator: ',',
      decimalSeparator: '.',
      decimalPlaces: 2,
      dateFormat: 'MM/DD/YYYY',
      dateFallbackFormats: [ 'YYYY', 'MM.YY', 'MM.YYYY', 'YYYY-MM-DD' ],
      timeFormat: 'HH:mm',
      timeFallbackFormats: [ 'HH', 'HHmm' ]
   };

   var KNOWN_TYPES = [ 'date', 'time', 'decimal', 'integer', 'string', 'select' ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var controllerName = 'axInputController';
   var controller = [ function() {
      var validators = [];

      return {
         initialize: function( type, formattingOptions ) {
            assert.state(
               KNOWN_TYPES.indexOf( type ) !== -1,
               'Type has to be one of \\[' + ( KNOWN_TYPES.join( ', ' ) ) + '] but got ' + type + '.'
            );

            this.valueType = type;
            this.parse = createParser( type, formattingOptions );
            this.format = createFormatter( type, formattingOptions );
         },

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         valueType: null,

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         parse: $.noop,

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         format: $.noop,

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         addSemanticValidator: function( validationFunction, messageFunction ) {
            assert( validationFunction ).hasType( Function ).isNotNull();
            assert( messageFunction ).hasType( Function ).isNotNull();

            validators.push( {
               validate: validationFunction,
               createMessage: messageFunction
            } );
         },

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         performSemanticValidations: function( value ) {
            var validationMessages = [];
            validators.forEach( function( entry ) {
               if( !entry.validate( value ) ) {
                  validationMessages.push( entry.createMessage( value ) );
               }
            } );
            return validationMessages;
         }
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function createParser( type, formattingOptions ) {
         if( type === 'select' ) {
            return function( value ) {
               return parsers.success( value );
            };
         }
         return parsers.create( type, formattingOptions );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function createFormatter( type, formattingOptions ) {
         if( type === 'select' ) {
            return function( value ) {
               return value;
            };
         }
         return formatters.create( type, formattingOptions );
      }

   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directiveName = 'axInput';
   var directive = [ function() {

      var idCounter = 0;

      return {
         restrict: 'A',
         priority: 8,
         controller: 'axInputController',
         require: [ 'ngModel', 'axInput' ],
         link: function( scope, element, attrs, controllers ) {
            var validationMessage = '';
            var previousValidationMessage = '';

            var ngModelController = controllers[0];
            var axInputController = controllers[1];
            var formattingOptions = getFormattingOptions( scope, attrs );

            scope.$watch( 'i18n', updateFormatting, true );
            scope.$watch( attrs.axInputFormatting, updateFormatting, true );

            function updateFormatting( newValue, oldValue ) {
               if( newValue === oldValue ) { return; }
               formattingOptions = getFormattingOptions( scope, attrs );
               axInputController.initialize( valueType, formattingOptions );
               ngModelController.$viewValue = axInputController.format( ngModelController.$modelValue );
               ngModelController.$render();
            }

            var valueType = element[0].nodeName.toLowerCase() === 'select' ?
               'select' : attrs[ directiveName ] || 'string';

            axInputController.initialize( valueType, formattingOptions );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            scope.$on( EVENT_VALIDATE, function() {
               // force re-validation by running all parsers
               var value = ngModelController.$viewValue;
               ngModelController.$parsers.forEach( function( f ) {
                  value = f( value );
               } );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var hasFocus = false;
            element.on( 'focusin', function() {
               hasFocus = true;
               if( ngModelController.$invalid ) {
                  element.tooltip( 'show' );
               }

               if( [ 'decimal', 'integer' ].indexOf( valueType ) !== -1 ) {
                  if( !ngModelController.$error[ ERROR_KEY_SYNTAX ] ) {
                     removeGroupingAndKeepCursorPosition();
                  }
               }
            } );
            element.on( 'focusout', function() {
               hasFocus = false;
               element.tooltip( 'hide' );
               if( valueType === 'select' ) {
                  // Prevent reformatting of the value for select boxes as this is already taken care of by
                  // angular's selectDirective.
                  return;
               }

               if( !ngModelController.$error[ ERROR_KEY_SYNTAX ] ) {
                  element.val( axInputController.format( ngModelController.$modelValue ) );
               }
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            ngModelController.$formatters.push( toggleErrorClass );
            ngModelController.$formatters.push( toggleTooltip );
            ngModelController.$formatters.push( function( value ) {
               return axInputController.format( value );
            } );
            ngModelController.$formatters.push( semanticValidation );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var lastValidValue;
            ngModelController.$parsers.unshift( toggleErrorClass );
            ngModelController.$parsers.unshift( toggleTooltip );
            ngModelController.$parsers.unshift( semanticValidation );
            ngModelController.$parsers.unshift( function( value ) {
               var result = axInputController.parse( value );
               ngModelController.$setValidity( ERROR_KEY_SYNTAX, result.ok );
               previousValidationMessage = validationMessage;
               if( result.ok ) {
                  lastValidValue = result.value;
                  validationMessage = '';
               }
               else {
                  validationMessage = messages.de[ 'SYNTAX_TYPE_' + valueType.toUpperCase() ];
               }
               return lastValidValue;
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function semanticValidation( value ) {
               if( ngModelController.$error[ ERROR_KEY_SYNTAX ] === true ) { return value; }

               var validationMessages = axInputController.performSemanticValidations( value );
               var valid = validationMessages.length === 0;

               ngModelController.$setValidity( ERROR_KEY_SEMANTIC, valid );
               validationMessage = valid ? '' : validationMessages[0];

               return value;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function removeGroupingAndKeepCursorPosition() {
               var focusFormat = formatters.create( valueType, ax.object.options( {
                  groupingSeparator: ''
               }, formattingOptions ) );

               // We need to do this asynchronously because of Google Chrome.
               setTimeout( function() {
                  var selection = helpers.getSelectionRange( element[0] );
                  var elementValue = element.val();
                  var wasProbablyTabbed = selection.start === 0 && selection.end === element.val().length;

                  element.val( focusFormat( axInputController.parse( elementValue ).value ) );
                  if( !helpers.isActiveElement( element[0] ) ) {
                     // The user already selected another element. Thus prevent from stealing the focus here.
                     return;
                  }

                  if( wasProbablyTabbed ) {
                     helpers.setSelectionRange( element[0], 0, element.val().length );
                     return;
                  }

                  var noOfSeparators = elementValue.substr( 0, selection.end )
                     .split( formattingOptions.groupingSeparator ).length - 1;
                  var newSelection = selection.end - noOfSeparators;

                  helpers.setSelectionRange( element[0], newSelection, newSelection );
               }, 0 );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function toggleErrorClass( value ) {
               element.toggleClass( ERROR_CLASS, ngModelController.$invalid );
               return value;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////
            // Tooltip handling
            //////////////////////////////////////////////////////////////////////////////////////////////////

            var tooltipVisible = false;
            function toggleTooltip( value ) {
               if( ngModelController.$invalid && hasFocus ) {
                  if( !tooltipVisible || previousValidationMessage !== validationMessage ) {
                     element.tooltip( 'show' );
                  }
               }
               else {
                  element.tooltip( 'hide' );
               }
               return value;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var tooltipId = 'axInputErrorTooltip' + idCounter++;
            element
               .tooltip( {
                  animation: true,
                  trigger: 'manual',
                  placement: valueType === 'select' ? 'top' : 'bottom',
                  template:
                     '<div id="' + tooltipId + '" class="tooltip error">' +
                     '<div class="tooltip-arrow"></div>' +
                     '<div class="tooltip-inner"></div>' +
                     '</div>',
                  title: function() {
                     return validationMessage;
                  },
                  container: 'body'
               } )
               .on( 'shown hidden', function( e ) {
                  tooltipVisible = e.type === 'shown';
               } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            scope.$on( '$destroy', function() {
               try {
                  element.off( 'focusin focusout shown hidden' );
                  element.tooltip( 'hide' );
                  element.tooltip( 'destroy' );
               }
               catch( e ) {
                  // Ignore. DOM node has been destroyed before the directive.
               }
               $( '#' + tooltipId ).remove();

               ngModelController.$formatters = [];
               ngModelController.$parsers = [];
               ngModelController = null;
               axInputController = null;
               element = null;
            } );

         }
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function getFormattingOptions( scope, attrs ) {
         var languageTag = i18n.languageTagFromScope( scope );
         var momentFormat = i18n.momentFormatForLanguageTag( languageTag );
         var numberFormat = i18n.numberFormatForLanguageTag( languageTag );
         var format = ax.object.options( {
            decimalSeparator: numberFormat.d,
            groupingSeparator: numberFormat.g,
            dateFormat: momentFormat.date,
            timeFormat: momentFormat.time
         }, DEFAULT_FORMATTING );

         return ax.object.options( scope.$eval( attrs.axInputFormatting ), format );
      }

   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
               scope.$broadcast( EVENT_VALIDATE );
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
         module.controller( controllerName, controller );
         module.directive( directiveName, directive );
         module.directive( requiredDirectiveName, requiredDirective );
         module.directive( maximumDirectiveName, maximumDirective );
         module.directive( minimumDirectiveName, minimumDirective );
         module.directive( rangeDirectiveName, rangeDirective );
         module.directive( maximumLengthDirectiveName, maximumLengthDirective );
      }
   };

} );
