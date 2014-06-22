(function () {
    'use strict';

    var module = angular.module('olaf.widgets.details', []);
    module.directive('olafDetails', ['$location', 'http', 'events', 'config', OlafDetailsDirective ]);

    function OlafDetailsDirective ($location, http, events, config) {
    	function olafDetailsCtrl($scope) {
            var id = $location.path().split(/.*-ref-(\d+)/g)[1];
	    	if(!_.isUndefined(id)) {
                console.log(id);
            }
	    }

	    function olafDetailsLink (scope, elm, attr) {
	    	
	    }

        return {
        	restrict: 'E',
            scope: {
                data: '='
            },
        	templateUrl: '/widgets/details/details.html',
            link: olafDetailsLink,
            controller: ['$scope', olafDetailsCtrl ]
        };
    }
}());