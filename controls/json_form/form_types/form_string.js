/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'laxar'
], function( ax ) {
   'use strict';

   var directiveName = 'axJsonFormString';

   var directive = [
      '$compile',

      function( $compile ) {

         var directiveCounter = 0;

         return {
            scope: {
               schema: '=axSchema',
               data: '=axData',
               messages: '=axMessages',
               formConfiguration: '=axFormConfiguration'
            },
            template: '<div><input type="text" data-ng-model="data" data-ng-change="validateUserInput()">' +
                      '<i data-ax-warning-icon="validationErrors"></i></div>',
            replace: true,
            link: function( scope, element ) {
               var directiveId = directiveName + '_' + directiveCounter++;
               if( !scope.data && scope.schema['default'] ) {
                  scope.data = scope.schema['default'];
               }

               if( scope.schema['enum'] ) {
                  var html = $compile( '<select data-ng-model="data" ' +
                     'data-ng-change="validateUserInput()" ' +
                     'data-ng-options="value for value in schema.enum">' +
                     ( scope.schema.required ? '' : '<option value=""> &nbsp; </option>' ) +
                     '</select>' )( scope );

                  element.prepend( html );
                  element.children( 'input' ).hide();
               }
               if( scope.formConfiguration && scope.formConfiguration.type === 'textarea' ) {
                  element.prepend( $compile( '<textarea data-ng-model="data" data-ng-change="validateUserInput()"></textarea>' )( scope ) );
                  element.children( 'input' ).hide();
               }

               scope.validationErrors = [];
               scope.validateUserInput = function() {
                  scope.validationErrors = [];
                  if( scope.schema.required && !scope.data ) {
                     scope.validationErrors.push( scope.messages.INPUT_REQUIRED );
                  }

                  if( scope.schema.pattern ) {
                     if( !new RegExp( scope.schema.pattern ).test( scope.data || '' ) ) {
                        scope.validationErrors.push( ax.string.format(
                           scope.messages.INPUT_MUST_MATCH_PATTERN, [ scope.schema.pattern ]
                        ) );
                     }
                  }

                  if( scope.schema.minLength > 0 && ( !scope.data || scope.data.length < scope.schema.minLength ) ) {
                     scope.validationErrors.push( ax.string.format(
                        scope.messages.INPUT_LENGTH_MUST_BE_AT_LEAST, [ scope.schema.minLength ]
                     ) );
                  }

                  if( scope.schema.maxLength > 0 && scope.data && scope.data.length > scope.schema.maxLength ) {
                     scope.validationErrors.push( ax.string.format(
                        scope.messages.INPUT_LENGTH_MUST_BE_AT_MOST, [ scope.schema.maxLength ]
                     ) );
                  }

                  scope.$emit( 'axJsonFormValidationResult', {
                     id: directiveId,
                     errors: scope.validationErrors
                  } );
               };

               scope.$on( 'axJsonFormValidate', function() {
                  scope.validateUserInput();
               } );

               scope.$on( '$destroy', function() {
                  scope.$emit( 'axJsonFormValidationResult', {
                     id: directiveId,
                     errors: []
                  } );
               } );
            }
         };
      }
   ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      register: function( module ) {
         module.directive( directiveName, directive );
      }
   };

} );