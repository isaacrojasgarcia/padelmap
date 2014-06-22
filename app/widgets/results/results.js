(function () {
    'use strict';

    var module = angular.module('olaf.widgets.results', ['ui.bootstrap', 'google-maps']);
    module.directive('olafResults', ['$location', 'http', 'events', 'config', OlafResultsDirective ]);

    function OlafResultsDirective ($location, http, events, config) {
        function olafResultsCtrl($scope) {
            $scope.searcherType = "R";

            /* Main data */
            $scope.initCenters = [];
            $scope.centers = [];

            $scope.empty = false;

            /* Map */
            var madrid = {
                longitude: 40.4000,
                latitude: 3.6833
            };

            $scope.map = {
                center: madrid,
                zoom: 13,
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

            


            events.$on(events.sr.FILTER_APPLIED, function(event, centers) {
                $scope.markers.data = getMarkers(centers);
            });


            /* Location */

            // Looking for location
            var path = $location.path().split('/');
            $scope.location = {
                name: ''
            };
            
            // Getting data from API
            events.$on(events.searcher.LOCATION_SELECTED, function(event, loc) {
                getData(loc);
            });




            // Switching behaviour 
            $scope.$watch('resultType', function(value) {
                switch(value) {
                    case 'list':
                        getData({
                            friendly: path[2] + (path[3] ? '/' + path[3] : '')
                        }); 
                        break;

                    case 'details':
                        getData({
                            id: _.last(path)
                        });
                        break;
                }
            });





            /* Functions */
            function getMarkers(data) {
                var result = []
                _.forEach(data, function(item) {
                    result.push({
                        'geometry': item.coordinates,
                        'name': item.name,
                        'showWindow': false,
                        'onClick': onClick,
                        'onClose': onClose
                    });
                });

                $scope.map.center = angular.copy(result[0].geometry) || madrid;

                console.log(result);
                return result;
            }

            function getData(params) {
                if(!_.isEmpty(params)) {
                    var url = '', success, fail;
                    switch($scope.resultType) {
                        case 'list':
                            url = config.apiUrl + 'centers/' + params.friendly;
                            success = function(data) {
                                $scope.location.name = data.location;
                                $scope.initCenters = angular.copy(data.items);
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
                                    zoom: 15
                                });

                                // Setting the marker
                                var marker = {
                                    latitude: data.coordinates.latitude,
                                    longitude: data.coordinates.longitude,
                                    title: data.name
                                };
                                $scope.markers.data.push(marker);

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
            // console.log(scope.resultType);
        }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/results/results.html',
            link: olafResultsLink,
            controller: ['$scope', olafResultsCtrl ]
        };
    }
}());