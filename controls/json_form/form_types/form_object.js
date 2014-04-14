/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'underscore',
   './helpers'
], function( _, helpers ) {
   'use strict';

   var directiveName = 'axJsonFormObject';

   var directive = [
      '$compile', 'JsonFormTypeSwitch',

      function( $compile, jsonFormTypeSwitch ) {
         return {
            scope: {
               schema: '=axSchema',
               data: '=axData',
               messages: '=axMessages',
               formConfiguration: '=axFormConfiguration'
            },
            template: '<table></table>',
            replace: true,
            link: function( scope, element ) {

               var html = '';
               var fixedObjectKeys = [];

               if( _.isObject( scope.schema.properties ) ) {
                  var properties = Object.keys( scope.schema.properties );
                  if( scope.formConfiguration ) {
                     var conf = scope.formConfiguration;
                     properties.sort( function( a, b ) {
                        var aSortIndex = ( conf[ a ] && conf[ a ].sortIndex ) || 0;
                        var bSortIndex = ( conf[ b ] && conf[ b ].sortIndex ) || 0;
                        return aSortIndex - bSortIndex;
                     } );
                  }

                  properties.forEach( function( key) {
                     var property = scope.schema.properties[ key ];
                     var schemaBinding = 'schema.properties[\'' + key + '\']';
                     var dataBinding = 'data[\'' + key + '\']';
                     var formConfigurationBinding = 'formConfiguration[\'' + key + '\']';
                     fixedObjectKeys.push( key );

                     if( !( key in scope.data ) ) {
                        if( 'default' in property ) {
                           scope.data[ key ] = property[ 'default' ];
                        }
                        else {
                           scope.data[ key ] = helpers.emptyDefaultByType( property.type );
                        }
                     }

                     var label = property.title || key;
                     html +=
                        '<tr>' +
                        '<td class="ax-object-key" ' +
                           'data-ng-class="{\'ax-required\': ' + schemaBinding + '}" ' +
                           'title="{{' + schemaBinding + '.description}}">' + label + '</td>' +
                        '<td colspan="2" class="ax-object-value">' + jsonFormTypeSwitch( schemaBinding, dataBinding, formConfigurationBinding ) + '</td>' +
                        '</tr>';

                  } );
               }

               if( _.isObject( scope.schema.patternProperties ) ) {

                  scope.addItem = function( patternIndex ) {
                     scope.patternPropertyData[ patternIndex ].push( {
                        key: '',
                        value: helpers.emptyDefaultByType( scope.patternPropertySchemas[ patternIndex ].type )
                     } );
                  };

                  scope.deleteItemAtIndex = function( patternIndex, index ) {
                     scope.patternPropertyData[ patternIndex ].splice( index, 1 );
                  };

                  // we map patterns to indices to make it easier in angular bindings
                  var patterns = _.keys( scope.schema.patternProperties );
                  scope.patternPropertyData = [];
                  scope.patternPropertySchemas = [];

                  patterns.forEach( function( pattern, patternIndex ) {

                     html +=
                        '<tr>' +
                        '<td colspan="2">Properties matching Pattern: ' + pattern + '</td>' +
                        '<td><button type="button" data-ng-click="addItem( ' + patternIndex + ' )" class="btn"><i class="icon-plus"></i></button></td>' +
                        '</tr>';

                     var schemaBinding = 'patternPropertySchemas.' + patternIndex;
                     var dataBinding = 'item.value';
                     var patternRegExp = new RegExp( pattern );

                     scope.patternPropertySchemas[ patternIndex ] = scope.schema.patternProperties[ pattern ];
                     scope.patternPropertyData[ patternIndex ] = [];
                     _.each( scope.data, function( value, key ) {
                        if( fixedObjectKeys.indexOf( key ) > -1 || key.indexOf( '$' ) > -1 ) {
                           // Filter fixed keys and angular properties
                           return;
                        }
                        if( !patternRegExp.test( key ) ) {
                           return;
                        }

                        scope.patternPropertyData[ patternIndex ].push( {
                           value: value,
                           key: key
                        } );
                     } );

                     html +=
                        '<tr data-ng-repeat="item in patternPropertyData.' + patternIndex + '">' +
                        '<td class="ax-object-key"><input data-ng-model="item.key" type="text" pattern="' + pattern + '"></td>' +
                        '<td class="ax-object-value">' + jsonFormTypeSwitch( schemaBinding, dataBinding ) + '</td>' +
                        '<td><button type="button" data-ng-click="deleteItemAtIndex( ' + patternIndex + ', $index )" class="btn"><i class="icon-trash"></i></button></td>' +
                        '</tr>';

                     scope.$watch( 'patternPropertyData.' + patternIndex, function( newValue, oldValue ) {
                        if( newValue === oldValue ) {
                           return;
                        }

                        var foundKeys = [];
                        _.each( newValue || [], function( property ) {
                           foundKeys.push( property.key );
                           scope.data[ property.key ] = property.value ;
                        } );

                        _.each( oldValue || [], function( property ) {
                           if( foundKeys.indexOf( property.key ) === -1 ) {
                              delete scope.data[ property.key ];
                           }
                        } );
                     }, true );

                  } );

               }

               element.append( $compile( html )( scope ) );
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