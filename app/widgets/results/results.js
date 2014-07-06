(function () {
    'use strict';

    var olafResultsDependencies = [ '$location', 'http', 'events', 'config', 'olafLocation', 'localRepo', 'centersSvc', 'Location', OlafResultsDirective];

    var module = angular.module('olaf.widgets.results', ['ui.bootstrap', 'google-maps']);
    module.directive('olafResults', olafResultsDependencies);
    module.factory('olafLocation', ['$location', '$route', '$rootScope', '$timeout', locationFactory]);

    function OlafResultsDirective ($location, http, events, config, olafLocation, localRepo, centersSvc, Location) {
        return {
            restrict: 'E',
            templateUrl: '/widgets/results/results.html',
            link: olafResultsLink,
            controller: ['$scope', olafResultsCtrl ]
        };

        function olafResultsLink (scope, elem, attrs) {
            scope.resultType = attrs.type || 'list';
        }

        function olafResultsCtrl($scope) {
            $scope.searcherType = "R";
            
            // Looking for location
            $scope.location = Location.convertPathToLocation($location.path());
            
            /* Main data */
            $scope.centers = [];    // Since filters are complex I need a filtered centers list
            $scope.center = {};     // Current center in details view
            $scope.previousList = false;
            $scope.showSidePanel = false;

            $scope.map = {
                center: config.locations.madrid,
                zoom: config.maps.zoom.big,
                clusterOptions: config.maps.clusterOptions
            };

            $scope.markers = {
                data: [],
                doClusterRandomMarkers: true
            };

            $scope.toggleCentersList = toggleCentersList;
            $scope.goBack = goBack; 
            


            // ===== Events ===== //
            var deregisters = [];
            $scope.$on('$destroy', _.executor(deregisters));

            deregisters.push(
                events.$on(events.sr.FILTER_APPLIED, function(event, filters) {
                    $scope.centers = centersSvc.applyFilters(filters)
                    $scope.markers.data = getMarkers();
                }),

                events.$on(events.sr.CENTER_SELECTED, function(event, center) {
                    $scope.center = center;
                    $scope.resultType = 'details';
                    var path = '/' + config.paths.details + '/' + center.friendly + '/' + center.id;
                    olafLocation.skipReload().path(path);
                }),

                events.$on(events.sr.GO_BACK_TO_LIST, function(event) {
                    // console.log('GOING BACK');
                    $scope.goBack();
                })
            );



            // ===== Watchers ===== //

            // Switching behaviour 
            $scope.$watch('resultType', function(value) {
                // console.log('Previous List:', $scope.previousList);
                switch(value) {
                    case 'list':
                        if(!$scope.previousList) {
                            localRepo.set(config.localRepo.srPath, $location.path());
                            $scope.previousList = true;
                            
                            centersSvc.getDataByLocation($scope.location).then(function(response) {
                                $scope.location.name = response.location;
                                $scope.centers = response.items;
                                $scope.markers.data = getMarkers();
                                events.$emit(events.sr.DATA_LOADED);
                            });
                        }

                        $scope.map.zoom = config.maps.zoom.big;
                        break;

                    case 'details':
                        var id = $scope.center.id ? $scope.center.id : _.last(_.compact($location.path().split('/')));
                        centersSvc.getCenterById(id).then(function(response) {
                            $scope.center = response;

                            _.extend($scope.map, {
                                center: response.coordinates,
                                zoom: config.maps.zoom.small
                            });

                            // Looking for booking url
                            _.each(response.services, function(item) {
                                if(item.abrev === 'booking') {
                                    $scope.center.booking = item.feature;
                                }
                            });

                        });
                        break;
                }
            });



            // ==== Functions ==== //

            // Markers functions
            function getMarkers() {
                var result = []
            
                _.forEach($scope.centers, function(item) {
                    // console.log(item);
                    result.push({
                        'geometry': item.coordinates,
                        'name': item.name,
                        'url': ['', config.paths.details, item.friendly].join('/'),
                        'showWindow': false,
                        'onClick': onClick,
                        'onClose': onClose
                    });
                });

                if(result.length) {
                    $scope.map.center = result[0].geometry || madrid;
                }

                return result;
            }

            function onClick(event, element) {
                console.log(element);

                _.each($scope.markers.data, function(item) {
                    // console.log(item);
                    item.showWindow = false;
                });
                
                this.showWindow = true;
                $scope.$apply();
            }

            function onClose(event) {
                console.log('onCLose', event);
                $scope.$apply();
            }



            function goBack() {
                $scope.resultType = 'list';
                // console.log('Getting localRepo:', localRepo.get(config.localRepo.srPath));
                olafLocation.skipReload().path(localRepo.get(config.localRepo.srPath));
            };

            function toggleCentersList() {
                $scope.showSidePanel = !$scope.showSidePanel;
                $scope.tooltipClose = ($scope.showSidePanel ? "Ocultar" : "Mostrar") + " panel lateral";
            }

	    }
    }

    /**
     *  Hack to avoid reload the page after setting the $location.path
     *  From: https://github.com/angular/angular.js/issues/1699
     *
     *  TODO: Move to some sort of “Angular extension” file
     */
    function locationFactory($location, $route, $rootScope, $timeout) {
        $location.skipReload = function () {
            var lastRoute = $route.current,
                deregister = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                });
            $timeout(function () {
                deregister();
            }, 1000);
            return $location;
        };
        return $location;
    }
}());