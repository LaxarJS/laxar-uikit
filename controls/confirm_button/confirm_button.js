/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar'
], function( ng, ax ) {
   'use strict';

   var directiveName = 'axConfirmButton';

   var defaultButton = 'btn-default';
   var defaultLabels = {
      htmlAction: '<i class="fa fa-times"></i>',
      htmlConfirm: '<i class="fa ax-icon-ok"></i>',
      htmlCancel: '<i class="fa ax-icon-next"></i>'
   };

   var htmlTemplate =
      '<div class="ax-confirm-wrapper"' +
           'data-ng-class="{ \'btn-group\': waiting }">' +
         '<button type="button" class="ax-confirm-placeholder"' +
                 'data-ng-class="classes.confirm" data-ng-if="!waiting" ' +
                 'data-ng-bind-html="labels.htmlConfirm"></button>' +
         '<button type="button" ' +
                 'data-ng-class="classes.action" data-ng-if="!waiting" ' +
                 'data-ng-click="ask()">' +
            '<div class="ax-confirm-helper" data-ng-bind-html="labels.htmlCancel"></div>' +
            '<div data-ng-bind-html="labels.htmlAction"></div></button>' +
         '<button type="button" ' +
                 'data-ng-class="classes.confirm" data-ng-if="waiting" ' +
                 'data-ng-bind-html="labels.htmlConfirm" data-ng-click="confirm()"></button>' +
         '<button type="button" ' +
                 'data-ng-class="classes.cancel" data-ng-if="waiting" ' +
                 'data-ng-click="cancel()">' +
            '<div class="ax-confirm-helper" data-ng-bind-html="labels.htmlAction"></div>' +
            '<div data-ng-bind-html="labels.htmlCancel"></div></button>' +
      '</div>';

   var directive = [ '$document', '$window', function( $document, $window ) {

      return {
         replace: true,
         restrict: 'A',
         template: htmlTemplate,
         scope: {
            htmlActionLabel: '=axConfirmHtmlActionLabel',
            htmlConfirmLabel: '=axConfirmHtmlConfirmLabel',
            htmlCancelLabel: '=axConfirmHtmlCancelLabel',
            actionClass: '=axConfirmActionClass',
            confirmClass: '=axConfirmConfirmClass',
            cancelClass: '=axConfirmCancelClass',
            onConfirm: '&axConfirmOnConfirm'
         },
         link: function( $scope, $element ) {

            $scope.waiting = false;

            $scope.classes = {
               action: 'btn ' + defaultButton,
               confirm: 'btn ' + defaultButton,
               cancel: 'btn ' + defaultButton
            };

            $scope.labels = {
               htmlAction: defaultLabels.htmlAction,
               htmlConfirm: defaultLabels.htmlConfirm,
               htmlCancel: defaultLabels.htmlCancel
            };

            $scope.ask = ask;
            $scope.cancel = cancel;
            $scope.confirm = confirm;

            $scope.$on( '$destroy', function() {
               $document.off( 'click', handleKeyUp );
               $document.off( 'keyup', handleDocumentClick );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            Object.keys( $scope.classes ).forEach( function( buttonName ) {
               $scope.$watch( buttonName + 'Class', function( newClass ) {
                  if( !newClass ) { return; }
                  $scope.classes[ buttonName ] = 'btn ' + ( newClass.indexOf( 'btn-' ) === -1 ?
                     newClass + ' ' + defaultButton :
                     newClass );
               } );
            } );

            Object.keys( $scope.labels ).forEach(function( labelName ) {
               $scope.$watch( labelName + 'Label', function( newLabel ) {
                  $scope.labels[ labelName ] = newLabel || defaultLabels[ labelName ];
               } );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function ask() {
               $scope.waiting = true;
               $window.setTimeout( function() {
                  $document.on( 'keyup', handleKeyUp );
                  $document.on( 'click', handleDocumentClick );
               }, 0 );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function cancel() {
               $scope.waiting = false;
               $document.off( 'click', handleDocumentClick );
               $document.off( 'keyup', handleKeyUp );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function confirm() {
               $scope.waiting = false;
               $document.off( 'click', handleDocumentClick );
               $document.off( 'keyup', handleKeyUp );
               $scope.onConfirm();
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function handleKeyUp( e ) {
               var ESC = 27;
               if( e.keyCode === ESC ) {
                  $scope.$apply( cancel );
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function handleDocumentClick( e ) {
               if( $scope.waiting ) {
                  var confirmButton = $element.children()[ 2 ];
                  if( e.target !== confirmButton ) {
                     $scope.$apply( cancel );
                  }
               }
            }

         }
      };

   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module.directive( directiveName, directive );
      }
   };

} );
