(function () {
    'use strict';

    var module = angular.module('olaf.widgets.searcher', ['ui.bootstrap']);
    module.directive('olafSearcher', [ '$location', 'events', OlafSearcherDirective ]);

    function OlafSearcherDirective ($location, events) {
    	function olafSearcherCtrl($scope) {
            $scope.locationSelected = '';
            $scope.locations = angular.copy(olaf.locations);

            $scope.typeaheadSelected = function() {
                $location.path("/pistas-de-padel/" + $scope.locationSelected.friendly);
                
                // Doesn't work in the SR because it belogns to another parent directive
                // It works when the searcher belogns to the same "page"
                events.$emit(events.searcher.LOCATION_SELECTED, $scope.locationSelected);
            }

        }

	    function olafSearcherLink (scope, elm, attr) {
	    	
	    }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/searcher/searcher.html',
            link: olafSearcherLink,
            controller: ['$scope', olafSearcherCtrl ]
        };
    }
}());