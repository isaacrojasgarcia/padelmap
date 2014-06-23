(function () {
    'use strict';

    var module = angular.module('olaf.widgets.results', ['ui.bootstrap', 'google-maps']);
    module.directive('olafResults', ['$location', 'http', 'events', 'config', 'olafLocation', 'localRepo', OlafResultsDirective ]);
    module.factory('olafLocation', ['$location', '$route', '$rootScope', '$timeout', locationFactory]);

    function OlafResultsDirective ($location, http, events, config, olafLocation, localRepo) {
        function olafResultsCtrl($scope) {
            $scope.searcherType = "R";

            /* Map */
            var madrid = {
                longitude: 40.4000,
                latitude: 3.6833
            };

            var zoom = {
                big: 13,
                small: 15
            }


            /* Main data */
            $scope.payload = [];    // Original payload from API 
            $scope.centers = [];    // Since filters are complex I need a filtered centers list
            $scope.center = {};     // Current center in details view
            $scope.empty = false;
            $scope.previousList = false;

            $scope.map = {
                center: madrid,
                zoom: zoom.big,
                clusterOptions: {
                    gridSize: 60,
                    ignoreHidden: true,
                    minimumClusterSize: 2,
                    imageSizes: [72]
                }
            };

            $scope.markers = {
                data: [],
                doClusterRandomMarkers: true
            };

            $scope.goBack = function() {
                $scope.resultType = 'list';
                console.log('Getting localRepo:', localRepo.get(config.localRepo.srPath));
                olafLocation.skipReload().path(localRepo.get(config.localRepo.srPath));
            };

            



            events.$on(events.sr.CENTER_SELECTED, function(event, center) {
                $scope.center = center;
                $scope.resultType = 'details';
                console.log(center);
                var path = '/centros/' + center.friendly + '/' + center.id;
                olafLocation.skipReload().path(path);
            });
            
            events.$on(events.sr.FILTER_APPLIED, function(event, centers) {
                $scope.markers.data = getMarkers(centers);
            });


            /* Location */

            // Looking for location
            var path = $location.path().split('/'),
                srPath = path[2] + (path[3] ? '/' + path[3] : '');

            

            $scope.location = {
                name: ''
            };
            
            // Getting data from API
            events.$on(events.searcher.LOCATION_SELECTED, function(event, loc) {
                getData(loc);
            });




            // Switching behaviour 
            $scope.$watch('resultType', function(value) {
                console.log('Previous List:', $scope.previousList);
                switch(value) {
                    case 'list':
                        if(!$scope.previousList) {
                            localRepo.set(config.localRepo.srPath, path.join('/'));
                            $scope.previousList = true;
                            getData( { friendly: srPath } ); 
                        }

                        $scope.map.zoom = zoom.big;
                        break;

                    case 'details':
                        getData( { id: $scope.previousList ?  $scope.center.id : _.last(path) } );    
                        break;
                }
            });





            /* Functions */
            function getMarkers(data) {
                var result = []
                _.forEach(data, function(item) {
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

                $scope.map.center = result[0].geometry || madrid;
                return result;
            }

            function getData(params) {
                console.log('Getting data', params);
                if(!_.isEmpty(params)) {
                    var url = '', success, fail;
                    switch($scope.resultType) {
                        case 'list':
                            url = config.apiUrl + 'centers/' + params.friendly;
                            success = function(data) {
                                $scope.location.name = data.location;
                                $scope.payload = angular.copy(data.items);
                                $scope.centers = data.items;
                                $scope.markers.data = getMarkers(data.items);
                                $scope.empty = false;
                            };
                            fail = function() {
                                $scope.empty = true;        
                            }
                            break;

                        case 'details':
                            url = config.apiUrl + 'details/' + params.id;
                            success = function(data) {
                                $scope.details = data;
                                _.extend($scope.map, {
                                    center: data.coordinates,
                                    zoom: zoom.small
                                });

                                // Looking for booking url
                                _.each(data.services, function(item) {
                                    if(item.abrev === 'booking') {
                                        $scope.details.booking = item.feature;
                                    }
                                });

                                // Locations
                                _.each(data.locations, function(item) {

                                });
                                
                            };
                            fail = function() {

                            }
                            break;
                    }

                    http.get(url).then(success, fail);
                }
            }

            function onClick(e) {
                _.each($scope.markers.data, function(item) {
                    console.log(item);
                    item.showWindow = false;
                });
                console.log(this);
                this.showWindow = true;
                $scope.$apply();
            }

            function onClose(e) {
                console.log('onCLose', e);
                $scope.$apply();
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