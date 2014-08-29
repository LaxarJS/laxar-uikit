/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'underscore',
   './helpers'
], function( ng, _, helpers ) {
   'use strict';

   var directiveName = 'axJsonFormArray';

   var directive = [
      '$compile', 'JsonFormTypeSwitch',

      function( $compile, jsonFormTypeSwitch ) {

         var directiveCounter = 0;

         return {
            scope: {
               schema: '=axSchema',
               data: '=axData',
               messages: '=axMessages',
               formConfiguration: '=axFormConfiguration'
            },
            template: '<div>' +
               '<button type="button" ng-click="addItem()" class="btn" data-ng-disabled="schema.maxItems <= viewData.length">' +
               '<i class="fa ax-icon-add"></i> {{ messages.ADD_ITEM }}</button>' +
               '<i data-ax-warning-icon="validationErrors"></i>' +
               '</div>',
            link: function( scope, element, attrs ) {

               var directiveId = directiveName + '_' + directiveCounter++;

               // We need to wrap each primitive value in an object to prevent from focus stealing problems.
               // https://groups.google.com/d/msg/angular/eB19TlFHFVE/Rlh--XImXeYJ
               scope.viewData = _.map( scope.data, function( value ) {
                  return { value: value };
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               scope.$watch( 'data', function( newValue, oldValue ) {
                  if( newValue === oldValue ) { return; }

                  // To prevent from an endless recursion we do a check for each value separately and only
                  // make updates when it's really necessary.
                  newValue.forEach( function( value, index ) {
                     if( index >= scope.viewData.length ) {
                        scope.viewData.push( { value: value } );
                     }
                     else if( !ng.equals( value, scope.viewData[ index ].value ) ) {
                        scope.viewData[ index ] = { value: value };
                     }
                  } );
               }, true );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               scope.validationErrors = [];
               scope.$watch( 'viewData', function( newValue, oldValue ) {
                  if( newValue === oldValue ) { return; }

                  scope.data = _.map( newValue, function( item ) {
                     return item.value;
                  } );

                  validate();

               }, true );

               function validate() {
                  scope.validationErrors = [];
                  if( scope.schema.uniqueItems && [ 'object', 'array' ].indexOf( scope.schema.items.type ) === -1 ) {
                     // only apply uniqueItems on primitive types. Comparing complex objects would be to much work.
                     if( _.uniq( scope.data ).length < scope.data.length ) {
                        scope.validationErrors.push( 'Es darf keine doppelten Einträge geben.' );
                     }
                  }

                  if( _.isNumber( scope.schema.minItems ) && scope.data.length < scope.schema.minItems ) {
                     scope.validationErrors.push( 'Es muss mindestens ' + pluEntry( scope.schema.minItems ) + ' geben.' );
                  }

                  if( _.isNumber( scope.schema.maxItems ) && scope.data.length > scope.schema.maxItems ) {
                     scope.validationErrors.push( 'Es darf höchstens ' + pluEntry( scope.schema.maxItems ) + ' geben.' );
                  }

                  scope.$emit( 'axJsonFormValidationResult', {
                     id: directiveId,
                     errors: scope.validationErrors
                  } );
               }

               scope.$on( 'axJsonFormValidate', function() {
                  validate();
               } );

               scope.$on( '$destroy', function() {
                  scope.$emit( 'axJsonFormValidationResult', {
                     id: directiveId,
                     errors: []
                  } );
               } );


               ///////////////////////////////////////////////////////////////////////////////////////////////

               scope.addItem = function() {
                  scope.viewData.push( { value: helpers.emptyDefaultByType( scope.schema.items.type ) } );
               };

               scope.deleteItemAtIndex = function( index ) {
                  scope.viewData.splice( index, 1 );
               };

               ///////////////////////////////////////////////////////////////////////////////////////////////

               // We need to compile the directive manually and not as directive template, because otherwise
               // the axJsonFormTypeSwitch would render a new axJsonFormArray and thus lead to an endless recursion.
               var html ='<ul><li data-ng-repeat="item in viewData">' +
                  '<span>{{ $index }}:</span>' +
                  jsonFormTypeSwitch( 'schema.items', 'item.value', 'formConfiguration[\'*\']' ) +
                  '<button type="button" data-ng-click="deleteItemAtIndex( $index )" class="btn"><i class="fa ax-icon-delete"></i></button>' +
                  '</li></ul>';

               element.append( $compile( html )( scope ) );

               function pluEntry( no ) {
                  return no + ' ' + ( no === 1 ? 'Eintrag' : 'Einträge' );
               }
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