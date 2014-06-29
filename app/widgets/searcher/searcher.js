(function () {
    'use strict';

    var module = angular.module('olaf.widgets.searcher', ['ui.bootstrap']);
    module.directive('olafSearcher', [ '$location', 'events', 'locationsSvc', OlafSearcherDirective ]);

    function OlafSearcherDirective ($location, events, locationsSvc) {
    	function olafSearcherCtrl($scope) {
            $scope.locationSelected = '';
            $scope.locations = [];
            $scope.loading = true;

            locationsSvc.getLocations().then(function(response) {
                $scope.locations = response;
                $scope.loading = false;
            });

            $scope.typeaheadSelected = function() {
                locationsSvc.setPath($scope.locationSelected);
                
                // Doesn't work in the SR because it belogns to another parent directive
                // It works when the searcher belogns to the same "page"
                // events.$emit(events.searcher.LOCATION_SELECTED, $scope.locationSelected);
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