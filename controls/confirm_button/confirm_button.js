/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'jquery',
   'laxar',
   'laxar_uikit'
], function( ng, $, ax, axUi ) {
   'use strict';

   var directiveName = 'axConfirmButton';

   var directive = [ '$document', function( $document ) {
      var htmlActionText = '<i class=fa-trash-o></i>';
      var htmlConfirmText = '<i class=ax-icon-ok></i>';
      var htmlCancelText = '<i class=ax-icon-cancel></i>';
      var BUTTON_CLASS_OMITTED = 'ax-omitted';
      var CONFIG_TO_BOOTSTRAP_STYLE_MAP = {
         NORMAL: 'default',
         PRIMARY: 'primary',
         INFO: 'info',
         SUCCESS: 'success',
         WARNING: 'warning',
         DANGER: 'danger',
         INVERSE: 'inverse',
         LINK: 'link'
      };

      return {
         replace: true,
         restrict: 'A',
         template: '<div class="ax-confirm-button ax-confirm-button-group">' +
                   '<button type="button" class="btn ax-confirm-button-confirm" data-ng-click="axConfirmOnConfirm()"></button>' +
                   '<button type="button" class="btn ax-confirm-button-action" ></button></div>',
         scope: {
            axConfirmHtmlActionLabel: '=',
            axConfirmHtmlConfirmLabel: '=',
            axConfirmHtmlCancelLabel: '=',
            axConfirmActionClass: '=',
            axConfirmConfirmClass: '=',
            axConfirmCancelClass: '=',
            axConfirmOnConfirm: '&'
         },
         link: function( $scope, element ) {
            var cssClasses = {
               action: '',
               confirm: '',
               cancel: ''
            };
            var bootstrapClasses = [];
            ng.forEach( CONFIG_TO_BOOTSTRAP_STYLE_MAP, function( value ) {
               bootstrapClasses.push( 'btn-' + value );
            } );

            [ 'axConfirmActionClass', 'axConfirmConfirmClass', 'axConfirmCancelClass' ].
               forEach( function( value ) {
                  $scope.$watch( value, function( newCssClass ) {
                     setCssClasses();
                     buttonWidth = calculateButtonWidth();
                     setActionButton( buttonWidth );
                     unsetConfirmButton( buttonWidth );
                  } );
               }
            );
            [ 'axConfirmHtmlActionLabel', 'axConfirmHtmlConfirmLabel', 'axConfirmHtmlCancelLabel' ].forEach(
               function( value ) {
                  $scope.$watch( value, function() {
                     buttonWidth = calculateButtonWidth();
                     setActionButton( buttonWidth );
                     unsetConfirmButton( buttonWidth );
                  } );
               }
            );
            var leftButton = element.find( '.ax-confirm-button-confirm' );
            var rightButton = element.find( '.ax-confirm-button-action' );
            var buttonMargin = 0;
            var buttonWidth = 0;
            var rightButtonBorderLeftWidth = 0;
            rightButton.on( 'click', axOnAction );
            setCssClasses();
            buttonWidth = calculateButtonWidth();

            setActionButton( buttonWidth );
            unsetConfirmButton( buttonWidth );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function setCssClasses() {
               cssClasses.action = $scope.axConfirmActionClass || '';
               cssClasses.confirm = $scope.axConfirmConfirmClass || '' ;
               cssClasses.confirm = cssClasses.confirm + ' ax-confirm-button-start-animation';
               cssClasses.cancel =  $scope.axConfirmCancelClass || '';

               ng.forEach( cssClasses, function( cssClassButton, key ) {
                  if( !bootstrapClasses.some( function( value ) {
                     return ( cssClassButton.indexOf( value ) !== -1 );
                  } ) ) {
                     cssClasses[ key ] = cssClassButton + ' btn-' + CONFIG_TO_BOOTSTRAP_STYLE_MAP.NORMAL;
                  }
               } );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function setActionButton( buttonWidth ) {
               rightButton.removeClass( cssClasses.cancel );
               rightButton.addClass( cssClasses.action );
               rightButton.width( buttonWidth );
               rightButton.html( $scope.axConfirmHtmlActionLabel || htmlActionText );
               rightButton.off( 'click' );
               rightButton.on( 'click', axOnAction );
               rightButton.removeClass( 'ax-confirm-button-cancel' );
               rightButton.addClass( 'ax-confirm-button-action' );
               rightButton.css( 'margin-left', buttonMargin + 'px' );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function setConfirmButton( buttonWidth ) {
               element.addClass( 'btn-group' );
               leftButton.removeClass( BUTTON_CLASS_OMITTED );
               leftButton.addClass( cssClasses.confirm );
               leftButton.width( buttonWidth );
               leftButton.html( $scope.axConfirmHtmlConfirmLabel || htmlConfirmText );
               leftButton.on( 'click', axOnCancelOrConfirm );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function unsetConfirmButton( buttonWidth ) {
               element.removeClass( 'btn-group' );
               leftButton.removeClass( cssClasses.confirm );
               leftButton.addClass( BUTTON_CLASS_OMITTED );
               leftButton.width( buttonWidth );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function setCancelButton( buttonWidth ) {
               rightButton.removeClass( cssClasses.action );
               rightButton.addClass( cssClasses.cancel );
               rightButton.width( buttonWidth );
               rightButton.html( $scope.axConfirmHtmlCancelLabel || htmlCancelText );
               rightButton.removeClass( 'ax-confirm-button-action' );
               rightButton.addClass( 'ax-confirm-button-cancel' );
               rightButton.off( 'click' );
               rightButton.on( 'click', axOnCancelOrConfirm );
               rightButton.css( 'margin-left', 0 );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function calculateButtonWidth() {
               setActionButton( 'auto' );
               rightButtonBorderLeftWidth = rightButton.css( 'border-left-width' );
               var buttonWidth = rightButton.width();
               var actionButtonWidth = 0;
               var confirmButtonWidth = 0;
               var actionButtonOuterWidth = 0;
               var confirmButtonOuterWidth = 0;
               if( buttonWidth <= 0 ) { //if the confirmButton is in invisible area
                  axUi.dom.ensureRenderingAndApplyFunction( leftButton[ 0 ], function() {
                     buttonWidth = rightButton.width();
                     buttonMargin = rightButton.outerWidth();
                     getOtherButtonsWidth();
                  } );
               }
               else {
                  buttonMargin = rightButton.outerWidth();
                  getOtherButtonsWidth();
               }
               if( buttonWidth < actionButtonWidth ) {
                  buttonWidth = actionButtonWidth;
                  buttonMargin = actionButtonOuterWidth;
               }
               if( buttonWidth < confirmButtonWidth ) {
                  buttonWidth = confirmButtonWidth;
                  buttonMargin = confirmButtonOuterWidth;
               }

               ///////////////////////////////////////////////////////////////////////////////////////////////

               function getOtherButtonsWidth() {
                  setCancelButton( 'auto' );
                  setConfirmButton( 'auto' );

                  actionButtonOuterWidth = rightButton.outerWidth();
                  confirmButtonOuterWidth = leftButton.outerWidth();

                  actionButtonWidth = rightButton.width();
                  confirmButtonWidth = leftButton.width();
               }

               return buttonWidth;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function keyHandler( e ) {
               var ESC = 27;
               if ( e.keyCode === ESC ) {
                  axOnCancelOrConfirm();
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function globalClickHandler( e ) {
               // don't call axOnCancel() if the 'action button' was clicked
               // But if the 'cancel button' was clicked
               // the axOnCancel() will be directly called through onClick event
               // and will deactivate the globalClickHandler

               var actionButtonPressed = false;

               ng.forEach( rightButton.children(), function( child ) {
                  if ( child === e.target ){
                     actionButtonPressed = true;
                  }
               } );

               if( e.target === rightButton[0] ) {
                  actionButtonPressed = true;
               }

               if( actionButtonPressed ) {
                  setButtonsAfterActionWasClicked();
               }
               else {
                  axOnCancelOrConfirm();
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function axOnAction() {
               $document.on( 'click', globalClickHandler );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function setButtonsAfterActionWasClicked() {
               setCancelButton( buttonWidth );
               rightButton.css( 'border-left-width', 0 );
               setConfirmButton( buttonWidth );
               $document.on( 'keyup', keyHandler );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function axOnCancelOrConfirm() {
               setActionButton( buttonWidth );
               rightButton.css( 'border-left-width', rightButtonBorderLeftWidth );
               unsetConfirmButton( buttonWidth );
               $document.off( 'click', globalClickHandler );
               $document.off( 'keyup', keyHandler );
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
