(function () {
    'use strict';

    var module = angular.module('olaf.widgets.header', []);
    module.directive('olafHeader', [ OlafHeaderDirective ]);

    function OlafHeaderDirective () {
	    function olafHeaderLink (scope, elm, attr) {
	    	
	    }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/header/header.html',
            link: olafHeaderLink
        };
    }
}());