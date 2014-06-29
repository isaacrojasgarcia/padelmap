(function () {
    'use strict';

    var module = angular.module('olaf.widgets.searchResult', []);
    module.directive('olafSearchResult', ['$location', 'http', 'events', 'config', OlafSearchResultDirective ]);

    function OlafSearchResultDirective ($location, http, events, config) {
    	function olafSearchResultCtrl($rootScope, $scope) {
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

            $scope.pagination = {
                current: 1,
                length: 10,
                maxSize: 4
            };
            

            
            // Filters            
            $scope.filtersApplied = [];
            $scope.filterData = filterData;
            $scope.selectCenter = selectCenter;


            function filterData(event) {
                getFilters(event.target);
                events.$emit(events.sr.FILTER_APPLIED, $scope.filtersApplied);
            };

            function getFilters(el) {
                if(el.checked) {
                    $scope.filtersApplied.push(el.value);
                }
                else {
                    _.pull($scope.filtersApplied, el.value);
                }                
            }

            function selectCenter(center) {
                events.$emit(events.sr.CENTER_SELECTED, center);
            }

            
            
	    }

	    return {
        	restrict: 'E',
        	templateUrl: '/widgets/searchResult/searchResult.html',
            controller: ['$rootScope', '$scope', olafSearchResultCtrl ]
        };
    }
}());