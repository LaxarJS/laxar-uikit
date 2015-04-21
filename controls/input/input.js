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
   './builtin_validators',
   // Overly specific import to avoid conflict with relative json-imports:
   // https://github.com/LaxarJS/laxar_uikit/issues/30
   'json!../input/messages.json'
], function( $, ax, bootstrapTooltip, i18n, formatters, parsers, helpers, builtinValidators, messages ) {
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
    * * `ax-input-minimum-length="$minimumLength"` (string only): requires the string's length to be greater
    *   than or equal to $minimumLength
    * * `ax-input-display-errors-immediately="$immediately"`: If $immediately evaluates to `true`, validation
    *   errors are presented to the user immediately by CSS styling and tooltip. Otherwise, errors are only
    *   shown when the field has been changed (ngModelController.$dirty) or when the event `axInput.validate`
    *   has been received. The default is `true` but will be changed to `false` in future major releases. It
    *   can be changed using the configuration 'lib.laxar_uikit.controls.input.displayErrorsImmediately'.
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
    * * decimalTruncation (default: 'FIXED'): How to treat insignificant decimal places (trailing zeros):
    *   - `FIXED`: uses a fraction length of exactly `decimalPlaces`, padding with zeros
    *   - `BOUNDED`: uses a fraction length up to `decimalPlaces`, no padding
    *   - `NONE`: unbounded fraction length (only limited by numeric precision), no padding
    * * dateFormat (default: `MM/DD/YYYY`): Format for date values
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
   var ERROR_PENDING_CLASS = 'ax-error-pending';
   var ERROR_KEY_SYNTAX = 'syntax';
   var ERROR_KEY_SEMANTIC = 'semantic';

   var EVENT_VALIDATE = 'axInput.validate';
   // this currently is duplicated in builtin_validators.js. Thus when changing this here, remember to change it there ...
   var EVENT_REFRESH = 'axInput._refresh';

   var DEFAULT_FORMATTING = {
      groupingSeparator: ',',
      decimalSeparator: '.',
      decimalPlaces: 2,
      decimalTruncation: 'FIXED',
      dateFormat: 'MM/DD/YYYY',
      dateFallbackFormats: [ 'MM/DD/YY', 'DD.MM.YY', 'YYYY-MM-DD' ],
      timeFormat: 'HH:mm',
      timeFallbackFormats: [ 'HH', 'HHmm' ]
   };

   var KNOWN_TYPES = [ 'date', 'time', 'decimal', 'integer', 'string', 'select' ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function configValue( key, fallback ) {
      return ax.configuration.get( 'lib.laxar_uikit.controls.input.' + key, fallback );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var controllerName = 'axInputController';
   var controller = [ function() {
      var validators = [];

      ax.object.extend( this, {

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

      } );

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

      var defaultDisplayErrorsImmediately = configValue( 'displayErrorsImmediately', true );
      var defaultNgModelOptions = configValue( 'ngModelOptions', {} );

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
               runFormatters();
               ngModelController.$render();
            }

            var valueType = ( isCheckbox( element ) || isRadio( element ) || isSelect( element ) ) ?
               'select' : attrs[ directiveName ] || 'string';

            axInputController.initialize( valueType, formattingOptions );

            initializeDisplayErrors();

            initializeNgModelOptions();

            //////////////////////////////////////////////////////////////////////////////////////////////////

            scope.$on( EVENT_REFRESH, function() {
               // force re-validation by running all parsers
               var value = ngModelController.$viewValue;
               ngModelController.$parsers.forEach( function( f ) {
                  value = f( value );
               } );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function initializeDisplayErrors() {
               var displayErrorsImmediately;
               var displayErrorsImmediatelyBinding = attrs.axInputDisplayErrorsImmediately;
               if( displayErrorsImmediatelyBinding ) {
                  displayErrorsImmediately = scope.$eval( displayErrorsImmediatelyBinding );
                  scope.$watch( displayErrorsImmediatelyBinding, function( newValue, oldValue ) {
                     if( newValue === oldValue ) { return; }
                     displayErrorsImmediately = newValue;
                     axInputController.validationPending = !newValue;
                     runFormatters();
                  } );
               }
               else {
                  displayErrorsImmediately = defaultDisplayErrorsImmediately;
               }
               axInputController.validationPending = !displayErrorsImmediately;

               scope.$on( EVENT_VALIDATE, function() {
                  if( !axInputController.validationPending ) { return; }
                  axInputController.validationPending = false;
                  runFormatters();
               } );

               // Override $setPristine to make sure tooltip and css classes are reset when form is reset
               var ngSetPristine = ngModelController.$setPristine.bind( ngModelController );
               ngModelController.$setPristine = function() {
                  ngSetPristine();
                  axInputController.validationPending = !displayErrorsImmediately;
                  runFormatters();
               };
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function runFormatters() {
               ngModelController.$formatters.reduceRight( function( acc, f ) {
                  return f( acc );
               }, ngModelController.$modelValue );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function mustDisplayErrors() {
               return !axInputController.waitingForBlur && (
                  ngModelController.$dirty || !axInputController.validationPending
               );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            // interpret ngModelOptions.updateOn
            // when moving to AngularJS 1.3, this should be changed to just apply the configuration and let
            // the ngModelOptionsDirective do the rest.
            function initializeNgModelOptions() {
               if( !isText( element ) ) {
                  return;
               }

               var ON_UPDATE_DEFAULT_MATCHER = /(\s+|^)default(\s+|$)/;

               var key = 'ngModelOptions';
               var ngModelOptions = ax.object.options( scope.$eval( attrs[ key ] ), defaultNgModelOptions );
               var updateOn = ngModelOptions.updateOn;
               if( updateOn && updateOn !== 'default' ) {
                  if( !ON_UPDATE_DEFAULT_MATCHER.test( updateOn ) ) {
                     element.unbind( 'input' ).unbind( 'keydown' ).unbind( 'change' );
                  }
                  else {
                     updateOn = updateOn.replace( ON_UPDATE_DEFAULT_MATCHER, ' ' );
                  }

                  element.bind( updateOn, function() {
                     scope.$apply( function() {
                        ngModelController.$setViewValue( element.val() );
                     } );
                  } );
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var hasFocus = false;
            element.on( 'focusin', function() {

               hasFocus = true;
               if( ngModelController.$invalid && mustDisplayErrors() ) {
                  showTooltip();
               }

               if( [ 'decimal', 'integer' ].indexOf( valueType ) !== -1 ) {
                  if( !ngModelController.$error[ ERROR_KEY_SYNTAX ] ) {
                     removeGroupingAndKeepCursorPosition();
                  }
               }

               element.one( 'focusout', function() {
                  hasFocus = false;
                  hideTooltip();
                  if( valueType === 'select' ) {
                     // Prevent reformatting of the value for select/radio because AngularJS takes care of them.
                     return;
                  }
                  if( !ngModelController.$error[ ERROR_KEY_SYNTAX ] ) {
                     element.val( axInputController.format( ngModelController.$modelValue ) );
                  }
               } );
            } );


            //////////////////////////////////////////////////////////////////////////////////////////////////

            ngModelController.$formatters.push( toggleErrorClass );
            ngModelController.$formatters.push( toggleTooltip );
            ngModelController.$formatters.push( function( value ) {
               return axInputController.format( value );
            } );
            ngModelController.$formatters.push( semanticValidation );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var lastValidValue = null;
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

                  var newSelection = selection.end;
                  if( formattingOptions.groupingSeparator ) {
                     var noOfSeparators = elementValue.substr( 0, selection.end )
                           .split( formattingOptions.groupingSeparator ).length - 1;
                     newSelection -= noOfSeparators;
                  }

                  helpers.setSelectionRange( element[0], newSelection, newSelection );
               }, 0 );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function toggleErrorClass( value ) {
               var displayErrors = mustDisplayErrors();
               var axErrorState = ngModelController.$invalid && displayErrors;
               var axErrorPendingState = ngModelController.$invalid && !displayErrors;

               function getLabel( element ) {
                  var label = element.parents( 'label' );
                  if( element.id ) {
                     label.add( 'label[for="' + element.id + '"]' );
                  }
                  return label;
               }

               if( isRadio( element ) ) {
                  radioGroup().each( function( i, button ) {
                     getLabel( $( button ) ).toggleClass( ERROR_CLASS, axErrorState );
                     getLabel( $( button ) ).toggleClass( ERROR_PENDING_CLASS, axErrorPendingState );
                  } );
               }
               else if( isCheckbox( element ) ) {
                  getLabel( element ).toggleClass( ERROR_CLASS, axErrorState );
                  getLabel( element ).toggleClass( ERROR_PENDING_CLASS, axErrorPendingState );
               }
               else {
                  element.toggleClass( ERROR_CLASS, axErrorState );
                  element.toggleClass( ERROR_PENDING_CLASS, axErrorPendingState );
               }

               return value;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////
            // Tooltip handling
            //////////////////////////////////////////////////////////////////////////////////////////////////

            var tooltipId;
            var tooltipVisible = false;

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function showTooltip() {
               if( !tooltipId ) {
                  tooltipId = createTooltip();
               }
               element.tooltip( 'show' );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function hideTooltip() {
               if( tooltipId ) {
                  element.tooltip( 'hide' );
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function createTooltip() {
               var tooltipPositionTimeout = null;
               var id = 'axInputErrorTooltip' + idCounter++;

               element.tooltip( {
                  animation: true,
                  trigger: 'manual',
                  placement: isSelect( element ) ? 'top' : function( tooltipEl, anchor ) {
                     var anchorOffset = $( anchor ).offset();
                     var anchorHeight = $( anchor ).outerHeight( true );
                     var documentHeight = $( document ).outerHeight( true );
                     if( anchorOffset.top + anchorHeight + 150 > documentHeight ) {
                        return 'auto';
                     }

                     return 'bottom';
                  },
                  template:
                     '<div id="' + id + '" class="tooltip error">' +
                     '<div class="tooltip-arrow"></div>' +
                     '<div class="tooltip-inner"></div>' +
                     '</div>',
                  title: function() {
                     return validationMessage;
                  },
                  container: 'body'
               } )
               .on( 'show.bs.tooltip hide.bs.tooltip', function( e ) {
                  tooltipVisible = e.type === 'shown';
               } )
               .on( 'shown.bs.tooltip', function() {
                  var lastElementPosition = element.offset();
                  var lastElementPositionString = lastElementPosition.left + '_' + lastElementPosition.top;
                  var pending = false;
                  tooltipPositionTimeout = setInterval( function(  ) {
                     var newPosition = element.offset();
                     var newPositionString = newPosition.left + '_' + newPosition.top;

                     if( lastElementPositionString !== newPositionString ) {
                        pending = true;
                     }
                     else if( pending ) {
                        pending = false;
                        clearInterval( tooltipPositionTimeout );
                        element.tooltip( 'show' );
                     }
                     lastElementPosition = newPosition;
                     lastElementPositionString = newPositionString;
                  }, 200 );
               } )
               .on( 'hide.bs.tooltip', function() {
                  clearInterval( tooltipPositionTimeout );
                  tooltipPositionTimeout = null;
               } );

               return id;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function destroyTooltip() {
               if( tooltipId ) {
                  element.tooltip( 'hide' );
                  element.tooltip( 'destroy' );
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function toggleTooltip( value ) {
               if( isRadio( element ) && radioGroup()[ 0 ] === element[ 0 ] ) {
                  element.focus();
               }
               if( ngModelController.$invalid && hasFocus && mustDisplayErrors() ) {
                  if( !tooltipVisible || previousValidationMessage !== validationMessage ) {
                     showTooltip();
                  }
               }
               else {
                  hideTooltip();
               }
               return value;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////


            //////////////////////////////////////////////////////////////////////////////////////////////////

            scope.$on( '$destroy', function() {
               try {
                  element.off( 'focusin focusout shown hidden' );
                  destroyTooltip();
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

            function radioGroup() {
               var selector = [ 'ng\\:model', 'x-ng-model', 'ng-model', 'data-ng-model' ].map( function( attribute ) {
                  return 'input[type="radio"][' + attribute + '="' + attrs.ngModel + '"]';
               } ).join( ', ' );
               return $( selector );
            }
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

   function isText( element ) {
      var el = element[0];
      return el.nodeName.toLowerCase() === 'input' && el.type === 'text' || !el.type;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function isRadio( element ) {
      return element[0].nodeName.toLowerCase() === 'input' && element[0].type === 'radio';
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function isCheckbox( element ) {
      return element[0].nodeName.toLowerCase() === 'input' && element[0].type === 'checkbox';
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function isSelect( element ) {
      return element[0].nodeName.toLowerCase() === 'select';
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module.controller( controllerName, controller );
         module.directive( directiveName, directive );

         builtinValidators.createForModule( module );
      }
   };

} );
