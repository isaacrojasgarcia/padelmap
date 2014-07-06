(function () {
    'use strict';

    var module = angular.module('olaf.widgets.searchResult', []);
    module.directive('olafSearchResult', ['$location', 'http', 'events', 'config', OlafSearchResultDirective ]);

    function OlafSearchResultDirective ($location, http, events, config) {
        return {
            scope: {
                centers: '=',
                location: '='
            },
            restrict: 'E',
            templateUrl: '/widgets/searchResult/searchResult.html',
            controller: ['$rootScope', '$scope', olafSearchResultCtrl ]
        };
        
    	function olafSearchResultCtrl($rootScope, $scope) {
	    	$scope.loading = true;
            $scope.pagination = {
                current: 1,
                length: 10,
                maxSize: 4
            };
            
            
            // Filters
            $scope.filters = config.filters;
            $scope.filtersApplied = [];
            $scope.filterData = filterData;
            $scope.selectCenter = selectCenter;


            var deregisters = [];
            $scope.$on('$destroy', _.executor(deregisters));


            deregisters.push(
                $scope.$on(events.sr.DATA_LOADED, function() {
                    $scope.loading = false;
                })
            );



            // ==== Functions ==== //
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
    }
}());