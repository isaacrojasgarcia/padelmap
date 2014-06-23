(function () {
    'use strict';

    var module = angular.module('olaf.widgets.searchResult', []);
    module.directive('olafSearchResult', ['$location', 'http', 'events', 'config', OlafSearchResultDirective ]);

    function OlafSearchResultDirective ($location, http, events, config) {
    	function olafSearchResultCtrl($rootScope, $scope) {
	    	/* Filters */

            // TODO: Remove hardcoding filters
            $scope.filters = [
                {
                    name: 'school',
                    text: 'Clases de pádel'
                },
                {
                    name: 'indoor',
                    text: 'Pistas cubiertas'
                },
                {
                    name: 'booking',
                    text: 'Reserva online'
                }
            ];
            

            /* Sidebar */

            // Toggling side bar
            $scope.showSidePanel = false;
            $scope.toggleCentersList = function() {
                $scope.showSidePanel = !$scope.showSidePanel;
                $scope.tooltipClose = ($scope.showSidePanel ? "Ocultar" : "Mostrar") + " panel lateral";
            };

            $scope.toggleCentersList();


            /* Filtering Data */
            $scope.filtersApplied = [];
            $scope.filterData = function(event) {
                getFilters(event.target);
                $scope.centers = _.filter($scope.payload, function(item) {
                    return angular.equals(_.intersection($scope.filtersApplied, item.summary), $scope.filtersApplied);
                });

                events.$emit(events.sr.FILTER_APPLIED, $scope.centers);
            };

            function getFilters(el) {
                if(el.checked) {
                    $scope.filtersApplied.push(el.value);
                }
                else {
                    _.pull($scope.filtersApplied, el.value);
                }                
            }
            
	    }

	    function olafSearchResultLink (scope, elem, attrs) {

	    }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/searchResult/searchResult.html',
            link: olafSearchResultLink,
            controller: ['$rootScope', '$scope', olafSearchResultCtrl ]
        };
    }
}());