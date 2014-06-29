(function () {
    'use strict';

    var olafResultsDependencies = [ '$location', 'http', 'events', 'config', 'olafLocation', 'localRepo', 'centersSvc', 'Location', OlafResultsDirective];

    var module = angular.module('olaf.widgets.results', ['ui.bootstrap', 'google-maps']);
    module.directive('olafResults', olafResultsDependencies);
    module.factory('olafLocation', ['$location', '$route', '$rootScope', '$timeout', locationFactory]);

    function OlafResultsDirective ($location, http, events, config, olafLocation, localRepo, centersSvc, Location) {
        function olafResultsCtrl($scope) {
            $scope.searcherType = "R";
            
            // Looking for location
            $scope.location = Location.convertPathToLocation($location.path());
            
            /* Main data */
            $scope.centers = [];    // Since filters are complex I need a filtered centers list
            $scope.center = {};     // Current center in details view
            $scope.previousList = false;
            $scope.loading = true;
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
                    var path = '/centros/' + center.friendly + '/' + center.id;
                    olafLocation.skipReload().path(path);
                })
            );




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
                                $scope.loading = true;
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



            /* Functions */

            // Markers functions
            function getMarkers() {
                var result = []
            
                _.forEach($scope.centers, function(item) {
                    // console.log(item);
                    result.push({
                        'geometry': item.coordinates,
                        'name': item.name,
                        'friendly': item.friendly,
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

            function onClick(e) {
                _.each($scope.markers.data, function(item) {
                    // console.log(item);
                    item.showWindow = false;
                });
                // console.log(this);
                this.showWindow = true;
                $scope.$apply();
            }

            function onClose(e) {
                console.log('onCLose', e);
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

	    function olafResultsLink (scope, elem, attrs) {
            scope.resultType = attrs.type || 'list';
        }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/results/results.html',
            link: olafResultsLink,
            controller: ['$scope', olafResultsCtrl ]
        };
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