(function () {
    'use strict';

    var module = angular.module('olaf.widgets.searcher', ['ui.bootstrap']);
    module.directive('olafSearcher', [ '$location', 'config', 'events', 'locationsSvc', OlafSearcherDirective ]);

    function OlafSearcherDirective ($location, config, events, locationsSvc) {
    	function olafSearcherCtrl($scope) {
            $scope.locationSelected = '';
            $scope.locations = [];
            $scope.loading = true;

            locationsSvc.getLocations().then(function(response) {
                $scope.locations = response;
                $scope.loading = false;
            });

            $scope.typeaheadSelected = function() {
                $location.path('/' + config.paths.searchResult + '/' + $scope.locationSelected.friendly);

                // Doesn't work in the SR because it belogns to another parent directive
                // It works when the searcher belogns to the same "page"
                // events.$emit(events.searcher.LOCATION_SELECTED, $scope.locationSelected);
            }

            $scope.nearTo = function() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position){
                        // console.log('position', position);
                        var uri = '/' + config.paths.nearby;
                        $location.path(uri);
                        $location.search('lat', position.coords.latitude);
                        $location.search('long', position.coords.longitude);
                        $scope.$apply();
                    });
                }
            }

        }

	    function olafSearcherLink (scope, elm, attr) {

	        scope.showMap = attr.showMap || false;
            console.log('SHOW MAP', attr.showMap, scope.showMap);
	    }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/searcher/searcher.html',
            link: olafSearcherLink,
            controller: ['$scope', olafSearcherCtrl ]
        };
    }
}());
