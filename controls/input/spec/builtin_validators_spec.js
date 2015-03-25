/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'laxar_uikit/controls/input',
   'angular-mocks',
   'jquery',
   './builtin_validators_spec_data'
], function( inputModule, angularMocks, $, data ) {
   'use strict';

   describe( 'builtin validators', function() {

      var $compile;
      var $rootScope;
      var $input;
      var scope;
      var ngModel;

      beforeEach( angularMocks.module( inputModule.name ) );
      beforeEach( angularMocks.inject( function( _$compile_, _$rootScope_ ) {
         $compile = _$compile_;
         $rootScope = _$rootScope_;
         $rootScope.i18n = {
            locale: 'default',
            tags: {
               'default': 'de_DE'
            }
         };
         scope = $rootScope.$new();

         // We mock the jquery ui / bootstrap (whatever we use ...) tooltip here as it is not relevant
         // in these tests
         $.fn.tooltip = function() {
            return this;
         };

         jasmine.Clock.useMock();
      } ) );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      data.simpleTests.forEach( function( testGroup ) {

         describe( 'for type ' + testGroup.type, function() {

            testGroup.tests.forEach( function( test ) {

               describe( 'a ' + test.constraint + ' validator' , function() {

                  beforeEach( function() {
                     var html = '<input ' +
                        'ax-input="' + testGroup.type + '" ' +
                        'ng-model="modelValue" ' +
                        'ax-input-' + test.constraint + '="' + test.constraintValue + '">';
                     $input = $compile( html )( scope );

                     ngModel = $input.controller( 'ngModel' );

                     scope.$apply( function() {
                        scope.modelValue = testGroup.initialValue;
                     } );
                  } );

                  ////////////////////////////////////////////////////////////////////////////////////////////

                  it( 'accepts the valid input ' + testGroup.validInput, function() {
                     enter( $input, testGroup.validInput );

                     expect( ngModel.$error.semantic ).toBe( false );
                     expect( scope.modelValue ).toEqual( testGroup.validExpected );
                  } );

                  ////////////////////////////////////////////////////////////////////////////////////////////

                  test.inputs.forEach( function( input, index ) {

                     it( 'sets a semantic error for invalid input "' + input + '", but updates the model', function() {
                        enter( $input, input );

                        expect( ngModel.$error.semantic ).toBe( true );
                        expect( scope.modelValue ).toEqual( test.expected[ index ] );
                     } );

                  } );

               } );

            } );

         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'for bound constraint values', function() {

         data.boundConstraintsTests.forEach( function( testGroup ) {

            describe( 'for constraint ' + testGroup.constraint, function() {

               beforeEach( function() {
                  var html = '<input ng-model="modelValue" ' +
                     'ax-input="' + testGroup.valueType + '" ' +
                     'ax-input-' + testGroup.constraint + '="constraintBinding">';

                  scope.constraintBinding = testGroup.initialConstraintValue;
                  scope.modelValue = testGroup.initialValue;

                  $input = $compile( html )( scope );

                  scope.$digest();

                  ngModel = $input.controller( 'ngModel' );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               it( 'reads its initial constraint value for validation', function() {
                  enter( $input, testGroup.invalidValue );
                  expect( ngModel.$error.semantic ).toBe( true );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               describe( 'when the constraint value is changed', function() {

                  beforeEach( function() {
                     enter( $input, testGroup.resetValue );// trigger a value change
                     scope.$apply( function() {
                        scope.constraintBinding = testGroup.secondConstraintValue;
                     } );
                  } );

                  ////////////////////////////////////////////////////////////////////////////////////////////

                  it( 'applies its new value on validation (jira ATP-8140)', function() {
                     enter( $input, testGroup.invalidValue );
                     expect( ngModel.$error.semantic ).toBe( false,
                        'Constraint: ' + testGroup.constraint +
                           ', Value: ' + testGroup.invalidValue +
                           ', new constraint value: ' + testGroup.secondConstraintValue
                     );
                  } );

               } );

            } );

         } );

      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function enter( $input, value ) {
      $input.val( value );
      var event = document.createElement( 'input' ).oninput === null ? 'input' : 'change';
      $input.trigger( event );
   }

} );
