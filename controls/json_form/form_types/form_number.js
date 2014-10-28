/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'underscore',
   'laxar'
], function( _, ax ) {
   'use strict';

   var directiveName = 'axJsonFormNumber';

   var directive = [
      function() {

         var directiveCounter = 0;

         return {
            scope: {
               schema: '=axSchema',
               data: '=axData',
               messages: '=axMessages',
               formConfiguration: '=axFormConfiguration'
            },
            template: '<div><input type="number" ' +
               'step="{{ step }}" ' +
               'data-ng-model="data" ' +
               'data-ng-change="validateUserInput()">' +
               '<i data-ax-warning-icon="validationErrors"></i>' +
               '</div>',
            replace: true,
            link: function( scope  ) {
               var directiveId = directiveName + '_' + directiveCounter++;

               scope.requiredAttribute = scope.schema.required ? 'required' : '';
               scope.step = scope.schema.type === 'integer' ? '1' : 'any';

               if( !_.isNumber( scope.data ) && scope.schema[ 'default' ] ) {
                  scope.data = scope.schema[ 'default' ];
               }

               scope.validationErrors = [];
               scope.validateUserInput = function() {
                  scope.validationErrors = [];
                  if( scope.schema.required && scope.data == null ) {
                     scope.validationErrors.push( scope.messages.INPUT_REQUIRED );
                  }

                  if( _.isNumber( scope.schema.minimum ) ) {
                     if( scope.schema.exclusiveMinimum && scope.data <= scope.schema.minimum ) {
                        scope.validationErrors.push( ax.string.format(
                              scope.messages.INPUT_MUST_BE_GREATER_THAN, [ scope.schema.minimum ]
                        ) );
                     }
                     else if( scope.data < scope.schema.minimum ) {
                        scope.validationErrors.push( ax.string.format(
                           scope.messages.INPUT_MUST_BE_GREATER_THAN_OR_EQUAL, [ scope.schema.minimum ]
                        ) );
                     }
                  }

                  if( _.isNumber( scope.schema.maximum ) ) {
                     if( scope.schema.exclusiveMaximum && scope.data >= scope.schema.maximum ) {
                        scope.validationErrors.push( ax.string.format(
                           scope.messages.INPUT_MUST_BE_LESS_THAN, [ scope.schema.maximum ]
                        ) );
                     }
                     else if( scope.data > scope.schema.maximum ) {
                        scope.validationErrors.push( ax.string.format(
                           scope.messages.INPUT_MUST_BE_LESS_THAN_OR_EQUAL, [ scope.schema.maximum ]
                        ) );
                     }
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