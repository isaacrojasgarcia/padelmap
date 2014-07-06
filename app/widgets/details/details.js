(function () {
    'use strict';

    var module = angular.module('olaf.widgets.details', []);
    module.directive('olafDetails', ['events', OlafDetailsDirective]);
    

    function OlafDetailsDirective (events) {
    	return {
        	scope: {
        		center: '=',
        		previous: '='
        	},
        	controller: ['$scope', 'events', olafDetailsCtrl ],
        	restrict: 'E',
        	templateUrl: '/widgets/details/details.html'
        };

    	function olafDetailsCtrl($scope, events) {
    		$scope.goBack = function() {
	    		events.$emit(events.sr.GO_BACK_TO_LIST, true);
	    	}
	    }
    }

}());