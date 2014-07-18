(function () {
    'use strict';

    var olafResultsDependencies = [ '$location', '$q', '$timeout', 'http', 'events', 'config', 'olafLocation', 'localRepo', 'centersSvc', 'Location', OlafResultsDirective];

    var module = angular.module('olaf.widgets.results', ['ui.bootstrap', 'google-maps']);
    module.directive('olafResults', olafResultsDependencies);
    module.factory('olafLocation', ['$location', '$route', '$rootScope', '$timeout', locationFactory]);

    function OlafResultsDirective ($location, $q, $timeout, http, events, config, olafLocation, localRepo, centersSvc, Location) {
        return {
            restrict: 'E',
            templateUrl: '/widgets/results/results.html',
            link: olafResultsLink,
            controller: ['$scope', olafResultsCtrl ]
        };

        function olafResultsLink (scope, elem, attrs) {
            // console.log('-->', attrs.type);
            scope.changeView(attrs.type || 'list');
        }

        function olafResultsCtrl($scope) {
            $scope.searcherType = "R";
            
            /* Main data */
            $scope.centers = [];    // Since filters are complex I need a filtered centers list
            $scope.center = {};     // Current center in details view
            $scope.previousList = false;
            $scope.showSidePanel = true;

            $scope.map = {
                center: config.locations.madrid,
                zoom: config.maps.zoom.big,
                clusterOptions: config.maps.clusterOptions
            };

            $scope.markers = {
                data: [],
                doClusterRandomMarkers: true
            };

            $scope.changeView = changeView;
            $scope.toggleCentersList = toggleCentersList;
            $scope.userLocation = null;
            


            // ===== Events ===== //
            $scope.$watch('resultType', function(value) {
                $scope.isList = (value === 'list' || value == 'nearby');
                console.log('isList:', $scope.isList);
            });




            // ===== Events ===== //
            var deregisters = [];
            $scope.$on('$destroy', _.executor(deregisters));

            deregisters.push(
                events.$on(events.sr.FILTER_APPLIED, function(event, filters) {
                    $scope.centers = centersSvc.applyFilters(filters)
                    $scope.markers.data = getMarkers();
                }),

                events.$on(events.sr.CENTER_SELECTED, function(event, center) {
                    centerSelected(center);
                }),

                events.$on(events.sr.GO_BACK_TO_LIST, function(event) {
                    goBackToList();
                })
            );

            
            // ==== Functions ==== //

            // Markers functions
            function getMarkers() {
                var result = []
                _.forEach($scope.centers, function(item) {
                    // console.log(item);
                    result.push(_.extend(item, {
                        'icon': '/img/player.png',
                        'showWindow': false,
                        'onClick': onClickMarker
                    }));
                });
                if(result.length) {
                    $scope.map.center = result[0].coordinates || config.locations.madrid;
                }
                return result;
            }

            function onClickMarker() {
                events.$emit(events.sr.CENTER_SELECTED, this.model);
            }

            function changeView(value) {
                $scope.resultType = value;
                //console.log('Changing view.', value);
                //console.log('Previous list:', $scope.previousList);

                switch(value) {
                    case 'nearby':
                    case 'list':
                        $scope.map.zoom = config.maps.zoom.big;
                        if(!$scope.previousList) {
                            localRepo.set(config.localRepo.srPath, $location.path());
                            getCentersInfo(value);
                        }
                    break;

                    case 'details':
                        getDetailedCenterInfo();
                    break;
                }
            }

            function getCentersInfo(value) {
                function afterData(response) {
                    var defer = $q.defer();
                    $scope.location.setName(response.location);
                    $scope.centers = response.items;
                    $scope.markers.data = getMarkers();
                    events.$emit(events.sr.DATA_LOADED); 
                    $timeout(defer.resolve, 10);
                    return defer.promise;
                }

                switch(value) {
                    case 'list':
                        $scope.location = Location.convertPathToLocation($location.path());
                        // console.log('Location::', $scope.location);
                        centersSvc.getDataByLocation($scope.location).then(afterData);
                    break;

                    case 'nearby': 
                        var search = $location.search(),
                            geoLocation = {
                                latitude: search.lat,
                                longitude: search.long
                            };

                        console.log('GM ani', google.maps.Animation);
                        $scope.userLocation = {
                            coords: geoLocation,
                            icon: '/img/home.png',
                            options: {
                                draggable: true,
                                animation: google.maps.Animation.BOUNCE
                            }
                        };

                        $scope.location = new Location();
                        centersSvc.getDataNearby(geoLocation).then(afterData).then(function() {
                            $scope.map.center = geoLocation;
                        });
                    break;
                }
            }

            function getDetailedCenterInfo() {
                var id = $scope.center.id ? $scope.center.id : _.last(_.compact($location.path().split('/')));
                centersSvc.getCenterById(id).then(function(response) {
                    $scope.center = response;
                    
                    if(!$scope.previousList) {
                        $scope.centers = [ response ];
                        $scope.markers.data = getMarkers();
                    }

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
            }

            function centerSelected(center) {
                var path = '/' + config.paths.details + '/' + center.friendly + '/' + center.id;
                olafLocation.skipReload().path(path);
                $scope.previousList = true;
                $scope.center = center;
                changeView('details');
            }

            function goBackToList() {
                olafLocation.skipReload().path(localRepo.get(config.localRepo.srPath));
                changeView('list');
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