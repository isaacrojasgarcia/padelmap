(function () {
    'use strict';

    var module = angular.module('olaf.widgets.searchResultData', []);
    module.directive('olafSearchResultData', ['$location', 'http', 'events', 'config', OlafSearchResultDataDirective ]);

    function OlafSearchResultDataDirective ($location, http, events, config) {
    	function olafSearchResultDataCtrl($scope) {
	    	$scope.pag = {
                current: 1,
                length: 10,
                maxSize: 4
            };
	    }

	    function olafSearchResultDataLink (scope, elm, attr) {
	    	
	    }

        return {
        	restrict: 'E',
            scope: {
                data: '='
            },
        	templateUrl: '/widgets/searchResultData/searchResultData.html',
            link: olafSearchResultDataLink,
            controller: ['$scope', olafSearchResultDataCtrl ]
        };
    }
}());