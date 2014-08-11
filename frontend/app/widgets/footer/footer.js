(function () {
    'use strict';

    var module = angular.module('olaf.widgets.footer', []);
    module.directive('olafFooter', [ OlafFooterDirective ]);

    function OlafFooterDirective () {
	    function olafFooterLink (scope, elm, attr) {
	    	
	    }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/footer/footer.html',
            link: olafFooterLink
        };
    }
}());