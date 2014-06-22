(function () {
    'use strict';

    var module = angular.module('olaf.components.directives', []);
    module.directive('ngFocus', ['$timeout', ngFocusDirective]);

    function ngFocusDirective($timeout) {
        return {
            link: function ( scope, element, attrs ) {
                scope.$watch( attrs.ngFocus, function ( val ) {
                    if ( angular.isDefined( val ) && val ) {
                        $timeout( function () { element[0].focus(); } );
                    }
                }, true);

                element.bind('blur', function () {
                    if ( angular.isDefined( attrs.ngFocusLost ) ) {
                        scope.$apply( attrs.ngFocusLost );

                    }
                });
            }
        }; 
    }
}());