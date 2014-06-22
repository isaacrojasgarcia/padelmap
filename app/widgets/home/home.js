(function () {
    'use strict';

    var module = angular.module('olaf.widgets.home', []);
    module.directive('olafHome', [ OlafHomeDirective ]);

    function OlafHomeDirective () {
    	function olafHomeCtrl($rootScope, $scope) {
	    	$scope.searcherType = "H";
	    }

	    function olafHomeLink (scope, elm, attrs) {
            
	    }

        return {
            restrict: 'E',
        	templateUrl: '/widgets/home/home.html',
            link: olafHomeLink,
            controller: ['$rootScope', '$scope', olafHomeCtrl ]
        };
    }
}());