/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'laxar/laxar_testing',
   'laxar_uikit/controls/input',
   'laxar_uikit/controls/input/parsers',
   'laxar_uikit/controls/input/helpers',
   'angular-mocks',
   'jquery'
], function( ax, inputModule, parsers, helpers, angularMocks, $ ) {
   'use strict';

   describe( 'An axInput control', function() {

      var $compile;
      var $rootScope;

      beforeEach( angularMocks.module( 'laxar_uikit.controls.input' ) );
      beforeEach( angularMocks.inject( function( _$compile_, _$rootScope_ ) {
         $compile = _$compile_;
         $rootScope = _$rootScope_;

         $rootScope.i18n = {
            locale: 'default',
            tags: {
               'default': 'de_DE'
            }
         };

         $.fn.tooltip = jasmine.createSpy( 'tooltip' ).andReturn( { on: function() {} } );

         jasmine.Clock.useMock();
      } ) );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'needs a model controller', function() {
         expect( function() { $compile( '<input data-ax-input/>' )( $rootScope.$new() ); } )
            .toThrow();
         expect( function() { $compile( '<input data-ax-input data-ng-model="something"/>' )( $rootScope.$new() ); } )
            .not.toThrow();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'creates an axInputController instance', function() {
         var $element = $compile( '<input data-ax-input ng-model="something"/>' )( $rootScope.$new() );
         var controller = $element.controller( 'axInput' );

         expect( controller.initialize ).toBeDefined();
         expect( controller.valueType ).toEqual( 'string' );
         expect( controller.parse ).toBeDefined();
         expect( controller.format ).toBeDefined();
         expect( controller.addSemanticValidator ).toBeDefined();
         expect( controller.performSemanticValidations ).toBeDefined();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'for the model controller', function() {

         var ngModelController;
         var axInputController;

         beforeEach( function() {
            var $element = $compile( '<input data-ax-input="decimal" data-ng-model="something"/>' )( $rootScope.$new() );
            ngModelController = $element.controller( 'ngModel' );
            axInputController = $element.controller( 'axInput' );

            axInputController.addSemanticValidator( function( value ) {
               return value < 50000;
            }, function() {
               return 'Value must be smaller than 50000';
            } );

            spyOn( axInputController, 'performSemanticValidations' ).andCallThrough();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'adds a simple value formatter', function() {
            expect( ngModelController.$formatters[2]( 12345.56 ) ).toEqual( '12.345,56' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'adds a formatter that does semantic validation', function() {
            expect( axInputController.performSemanticValidations ).not.toHaveBeenCalled();

            ngModelController.$formatters[3]( 12345.56 );

            expect( axInputController.performSemanticValidations ).toHaveBeenCalledWith( 12345.56 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////


         describe( 'adds a simple syntax parser and validator', function() {

            var parsedValue;

            beforeEach( function() {
               parsedValue = ngModelController.$parsers[0]( '12.345,56' );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'that simply parses correct values', function() {
               expect( parsedValue ).toEqual( 12345.56 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'returns the last valid value on parser error', function() {
               expect( ngModelController.$parsers[0]( 'vsa' ) ).toEqual( parsedValue );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'sets an error for key "syntax" in the ngModelController', function() {
               expect( ngModelController.$error.syntax ).toBe( false );
               ngModelController.$parsers[0]( 'vsa' );
               expect( ngModelController.$error.syntax ).toBe( true );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'adds a parser that does semantic validation', function() {

            beforeEach( function() {
               ngModelController.$parsers[1]( 12345.56 );
            } );

            it( 'that delegates to axInputController.performSemanticValidations', function() {
               expect( axInputController.performSemanticValidations ).toHaveBeenCalledWith(  12345.56 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'that sets an error for key "semantic" in the ngModelController', function() {
               expect( ngModelController.$error.semantic ).toBe( false );
               ngModelController.$parsers[1]( 52345.56 );
               expect( ngModelController.$error.semantic ).toBe( true );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'that is omitted if there is pending syntactical error', function() {
               axInputController.performSemanticValidations.reset();
               ngModelController.$error.syntax = true;
               ngModelController.$parsers[1]( 12345.56 );

               expect( axInputController.performSemanticValidations ).not.toHaveBeenCalled();
            } );

         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the value is numeric with grouping separators', function() {

         var $element;

         beforeEach( function() {
            var scope = $rootScope.$new();

            $element = $compile( '<input data-ax-input="integer" data-ng-model="someValue"/>' )( scope );
            $element.appendTo( 'body' );
            scope.$apply( function() {
               scope.someValue = 1231442;
            } );

            spyOn( helpers, 'getSelectionRange' ).andReturn( { start: 7, end: 7 } );
            spyOn( helpers, 'isActiveElement' ).andReturn( true );
            spyOn( helpers, 'setSelectionRange' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            $element.remove();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'renders the value with grouping separators by default', function() {
            expect( $element.val() ).toEqual( '1.231.442' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'removes the grouping separators on focus and re-adds them on blur', function() {
            $element.trigger( 'focus' );
            jasmine.Clock.tick( 0 );

            expect( $element.val() ).toEqual( '1231442' );

            $element.trigger( 'blur' );
            expect( $element.val() ).toEqual( '1.231.442' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'adjusts the cursor position correctly after removing the grouping separators', function() {
            $element.trigger( 'focus' );
            jasmine.Clock.tick( 0 );

            expect( helpers.getSelectionRange ).toHaveBeenCalled();
            expect( helpers.setSelectionRange ).toHaveBeenCalledWith( $element[0], 5, 5 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'doesn\'t adjust the cursor position if the element already lost focus (jira ATP-7910)', function() {
            $element.trigger( 'focus' );
            helpers.isActiveElement.andReturn( false );
            jasmine.Clock.tick( 0 );

            expect( helpers.setSelectionRange ).not.toHaveBeenCalled();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'selects everything when the user tabs into the input (jira ATP-8210)', function() {
            helpers.getSelectionRange.andReturn( { start: 0, end: $element.val().length } );
            $element.trigger( 'focus' );
            jasmine.Clock.tick( 0 );

            expect( helpers.setSelectionRange ).toHaveBeenCalledWith( $element[0], 0, 7 );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when configured with ngModelOptions', function() {

         var $element;
         var scope;
         var html = '<input data-ax-input="integer" data-ng-model="someValue" ' +
                    'data-ng-model-options="{ \'updateOn\': \'NG_MODEL_OPTIONS\' }"' +
                    'data-ax-input-display-errors-immediately="true" ax-input-minimum-value="100"/>';

         beforeEach( function() {
            scope = $rootScope.$new();
            scope.someValue = 200;
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            $element.remove();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'with updateOn set to "default"', function() {

            beforeEach( function() {
               $element = $compile( html.replace( /NG_MODEL_OPTIONS/, 'default' ) )( scope );
               $element.appendTo( 'body' );
            } );

            it( 'updates its validation state on change', function() {
               $element[0].value = '50';
               $element.trigger( 'change' );
               expect( $element.hasClass( 'ax-error' ) ).toBe( true );
            } );

            // event does not work in MSIE8
            // xit( 'updates its validation state on input', function() {
            //    $element[0].value = '50';
            //    $element.trigger( 'input' );
            //    expect( $element.hasClass( 'ax-error' ) ).toBe( true );
            // } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'with updateOn set to "keypress"', function() {

            beforeEach( function() {
               $element = $compile( html.replace( /NG_MODEL_OPTIONS/, 'keypress' ) )( scope );
               $element.appendTo( 'body' );
            } );

            it( 'updates its validation state on keypress', function() {
               $element[0].value = '50';
               $element.trigger( 'focusout' );
               expect( $element.hasClass( 'ax-error' ) ).toBe( false );

               $element[0].value = '50';
               $element.trigger( 'keypress' );
               expect( $element.hasClass( 'ax-error' ) ).toBe( true );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'with updateOn set to "focusout"', function() {

            beforeEach( function() {
               $element = $compile( html.replace( /NG_MODEL_OPTIONS/, 'focusout' ) )( scope );
               $element.appendTo( 'body' );
            } );

            it( 'updates its validation state on focusout', function() {
               $element[0].value = '50';
               $element.trigger( 'keydown' );
               expect( $element.hasClass( 'ax-error' ) ).toBe( false );

               $element.trigger( 'focusout' );
               expect( $element.hasClass( 'ax-error' ) ).toBe( true );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'set through configuration', function() {

            var html = '<input data-ax-input="integer" data-ng-model="someValue" ' +
                       'data-ax-input-display-errors-immediately="true" ax-input-minimum-value="100"/>';

            var configKey = 'lib.laxar_uikit.controls.input.ngModelOptions';
            var configValue;

            beforeEach( function() {
               var origGet = ax.configuration.get;
               spyOn( ax.configuration, 'get' ).andCallFake( function( key, fallback ) {
                  return key === configKey ? configValue : origGet( key, fallback );
               } );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            describe( 'with updateOn set to "focusout"', function() {

               beforeEach( function() {
                  configValue = { 'updateOn': 'focusout' };
                  $element = $compile( html )( scope );
                  $element.appendTo( 'body' );
               } );

               it( 'updates its validation state on focusout', function() {
                  $element[0].value = '50';
                  $element.trigger( 'keydown' );
                  expect( $element.hasClass( 'ax-error' ) ).toBe( false );

                  $element.trigger( 'focusout' );
                  expect( $element.hasClass( 'ax-error' ) ).toBe( true );
               } );

            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'with updateOn not set at all', function() {

            var html = '<input data-ax-input="integer" data-ng-model="someValue" ' +
                       'data-ax-input-display-errors-immediately="true" ax-input-minimum-value="100"/>';

            beforeEach( function() {
               $element = $compile( html )( scope );
               $element.appendTo( 'body' );
            } );

            it( 'updates on every change', function() {
               $element[0].value = '150';
               $element.trigger( 'change' );
               expect( $element.hasClass( 'ax-error' ) ).toBe( false );
            } );

         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the value is erroneous', function() {

         var $element;
         var scope;

         beforeEach( function() {
            scope = $rootScope.$new();

            $element = $compile( '<input ax-input="integer" ng-model="someValue" data-ax-input-display-errors-immediately="showImmediately" ax-input-minimum-value="1000"/>' )( scope );
            $element.appendTo( 'body' );
            scope.$apply( function() {
               scope.someValue = 12;
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            $element.remove();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and errors must be displayed immediately', function() {

            beforeEach( function() {
               scope.$apply( function() {
                  scope.showImmediately = true;
               } );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'shows a tooltip on focus', function() {
               $.fn.tooltip.reset();

               $element.trigger( 'focusin' );
               expect( $.fn.tooltip ).toHaveBeenCalledWith( 'show' );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'sets the class "ax-error" on the input field', function() {
               expect( $element.hasClass( 'ax-error-pending' ) ).toBe( false );
               expect( $element.hasClass( 'ax-error' ) ).toBe( true );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'clears the validation-pending flag', function() {
               expect( $element.controller( 'axInput' ).validationPending ).toBe( false );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'hides the tooltip on blur', function() {
               $element.trigger( 'focusin' );
               $.fn.tooltip.reset();
               $element.trigger( 'blur' );
               expect( $.fn.tooltip ).toHaveBeenCalledWith( 'hide' );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            describe( 'and the field becomes valid again', function() {

               beforeEach( function() {
                  $element.focus();
                  $.fn.tooltip.reset();
                  scope.$apply( function() {
                     scope.someValue = 1200;
                  } );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               it( 'removes the class "ax-error" from the input field', function() {
                  expect( $element.hasClass( 'false' ) ).toBe( false );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               it( 'hides the tooltip', function() {
                  expect( $.fn.tooltip ).toHaveBeenCalledWith( 'hide' );
               } );

            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and errors must not be displayed immediately', function() {

            beforeEach( function() {
               scope.$apply( function() {
                  scope.showImmediately = false;
               } );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'does not show a tooltip on focus', function() {
               $.fn.tooltip.reset();
               $element.trigger( 'focusin' );
               expect( $.fn.tooltip ).not.toHaveBeenCalledWith( 'show' );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'sets the class "ax-error-pending" on the input field', function() {
               expect( $element.hasClass( 'ax-error-pending' ) ).toBe( true );
               expect( $element.hasClass( 'ax-error' ) ).toBe( false );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'sets the validation-pending flag', function() {
               expect( $element.controller( 'axInput' ).validationPending ).toBe( true );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            describe( 'and validation is requested', function() {

               beforeEach( function() {
                  scope.$apply( function() {
                     scope.$broadcast( 'axInput.validate' );
                  } );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               it( 'shows a tooltip on focus', function() {
                  $.fn.tooltip.reset();
                  $element.trigger( 'focusin' );
                  expect( $.fn.tooltip ).toHaveBeenCalledWith( 'show' );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               it( 'sets the class "ax-error" on the input field', function() {
                  expect( $element.hasClass( 'ax-error' ) ).toBe( true );
                  expect( $element.hasClass( 'ax-error-pending' ) ).toBe( false );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               it( 'clears the validation-pending flag', function() {
                  expect( $element.controller( 'axInput' ).validationPending ).toBe( false );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               describe( 'and then the form is reset ', function() {

                  beforeEach( function() {
                     scope.$apply( function() {
                        $element.controller( 'ngModel' ).$setPristine();
                     } );
                  } );


                  ////////////////////////////////////////////////////////////////////////////////////////////

                  it( 'does not show a tooltip on focus', function() {
                     $.fn.tooltip.reset();
                     $element.focus();
                     expect( $.fn.tooltip ).not.toHaveBeenCalledWith( 'show' );
                  } );

                  ////////////////////////////////////////////////////////////////////////////////////////////

                  it( 'sets the class "ax-error-pending" on the input field', function() {
                     expect( $element.hasClass( 'ax-error-pending' ) ).toBe( true );
                     expect( $element.hasClass( 'ax-error' ) ).toBe( false );
                  } );

                  ////////////////////////////////////////////////////////////////////////////////////////////

                  it( 'sets the validation-pending flag', function() {
                     expect( $element.controller( 'axInput' ).validationPending ).toBe( true );
                  } );

               } );

            } );

         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'for type select', function() {

         beforeEach( function() {
            $compile( '<select ax-input ng-model="someValue"></select>' )( $rootScope.$new() );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'configures the tooltip to open to the top (jira ATP-7931)', function() {
            var options = $.fn.tooltip.calls[0].args[0];
            expect( options.placement ).toEqual( 'top' );
         } );

      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'An axInputController', function() {

      var DEFAULT_FORMATTING = {
         groupingSeparator: '.',
         decimalSeparator: ',',
         decimalPlaces: 2,
         dateFormat: 'DD.MM.YYYY',
         dateFallbackFormats: [ 'YY', 'YYYY', 'MM.YY', 'MM.YYYY', 'DD.MM.YY', 'YYYY-MM-DD' ],
         timeFormat: 'HH:mm',
         timeFallbackFormats: [ 'HH', 'HH:mm', 'HHmm' ]
      };
      var controller;

      beforeEach( angularMocks.module( 'laxar_uikit.controls.input' ) );
      beforeEach( angularMocks.inject( function( $controller ) {
         controller = $controller( 'axInputController' );
      } ) );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'must be initialized with a supported type and formatting options', function() {
         expect( function() { controller.initialize( 'date', DEFAULT_FORMATTING ); } ).not.toThrow();
         expect( function() { controller.initialize( 'time', DEFAULT_FORMATTING ); } ).not.toThrow();
         expect( function() { controller.initialize( 'decimal', DEFAULT_FORMATTING ); } ).not.toThrow();
         expect( function() { controller.initialize( 'integer', DEFAULT_FORMATTING ); } ).not.toThrow();
         expect( function() { controller.initialize( 'string', DEFAULT_FORMATTING ); } ).not.toThrow();
         expect( function() { controller.initialize( 'select', DEFAULT_FORMATTING ); } ).not.toThrow();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'throws an exception if the type is omitted or unsupported', function() {
         var assertionError =
            'Assertion error: State does not hold. ' +
            'Details: Type has to be one of \\[date, time, decimal, integer, string, select] but got ';

         expect( function() { controller.initialize( null, DEFAULT_FORMATTING ); } )
            .toThrow( assertionError + 'null.');
         expect( function() { controller.initialize( 'boolean', DEFAULT_FORMATTING ); } )
            .toThrow( assertionError + 'boolean.');
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when correctly initialized', function() {

         beforeEach( function() {
            controller.initialize( 'decimal', DEFAULT_FORMATTING );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'has a public property for the value type', function() {
            expect( controller.valueType ).toEqual( 'decimal' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'instantiates a parser for the given type', function() {
            expect( controller.parse( '12.345,12' ) ).toEqual( parsers.success( 12345.12 ) );
            expect( controller.parse( 'Hi' ) ).toEqual( parsers.error() );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'instantiates a formatter for the given type', function() {
            expect( controller.format( 12345.12 ) ).toEqual( '12.345,12' );
            expect( function() { controller.format( 'Hi' ); } )
               .toThrow( 'Expected argument of type number, but got "string". Value: Hi' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'for type select', function() {

         beforeEach( function() {
            controller.initialize( 'select', DEFAULT_FORMATTING );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'creates a parser simply returning the identity of the input (jira ATP-7858)', function() {
            expect( controller.parse( { my: 'object' } ) )
               .toEqual( parsers.success( { my: 'object' } ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'creates a formatter simply returning the identity of the input (jira ATP-7858)', function() {
            expect( controller.format( { my: 'object' } ) )
               .toEqual( { my: 'object' } );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'supports registration of semantic validators as validation and separate message function', function() {
         expect( function() {
            controller.addSemanticValidator();
         } ).toThrow();
         expect( function() {
            controller.addSemanticValidator( function(){} );
         } ).toThrow();
         expect( function() {
            controller.addSemanticValidator( function(){}, function(){} );
         } ).not.toThrow();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with registered semantic validators', function() {

         var successfulValidator;
         var successfulMessage;
         var failingValidator;
         var failingMessage;
         var result;

         beforeEach( function() {
            successfulValidator = jasmine.createSpy( 'successfulValidator' ).andReturn( true );
            successfulMessage = jasmine.createSpy( 'successfulMessage' ).andReturn( 'Dont call on me!' );
            failingValidator = jasmine.createSpy( 'failingValidator' ).andReturn( false );
            failingMessage = jasmine.createSpy( 'failingMessage' ).andReturn( 'There was an error.' );

            controller.addSemanticValidator( successfulValidator, successfulMessage );
            controller.addSemanticValidator( failingValidator, failingMessage );
            controller.addSemanticValidator( failingValidator, failingMessage );

            result = controller.performSemanticValidations( 12345 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'calls all validators with the given value', function() {
            expect( successfulValidator.calls.length ).toEqual( 1 );
            expect( successfulValidator.calls[0].args[0] ).toEqual( 12345 );

            expect( failingValidator.calls.length ).toEqual( 2 );
            expect( failingValidator.calls[0].args[0] ).toEqual( 12345 );
            expect( failingValidator.calls[1].args[0] ).toEqual( 12345 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'calls the message factories for all failing validators with the given value', function() {
            expect( successfulMessage.calls.length ).toEqual( 0 );

            expect( failingMessage.calls.length ).toEqual( 2 );
            expect( failingMessage.calls[0].args[0] ).toEqual( 12345 );
            expect( failingMessage.calls[1].args[0] ).toEqual( 12345 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'returns the error messages of all failed validators', function() {
            expect( result ).toEqual( [ 'There was an error.', 'There was an error.' ] );
         } );

      } );

   } );

} );