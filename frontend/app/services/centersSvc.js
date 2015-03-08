(function () {
    'use strict';

    angular.module('olaf.services.centersSvc', [])
        .factory('centersSvc', [ '$q', 'config', 'http', centersSvcFactory ]);

    function centersSvcFactory($q, config, http) {
        var centers;

        return {
            getCenterById: getCenterById,
            getDataByLocation: getDataByLocation,
            applyFilters: applyFilters,
            getDataNearby: getDataNearby,
            getAllCenters: getAllCenters
        };


        function getCenterById(id) {
            var url = config.apiUrl + config.api.paths.details + '/' + id,
                defer = $q.defer();

            makeCall(url, defer);
            return defer.promise;
        }

        // @param Location loc
        function getDataByLocation(loc) {
            var url = config.apiUrl + config.api.paths.centers + '/' + loc.getFriendly(),
                defer = $q.defer();

            makeCall(url, defer, function(data) {
                // console.log('data:', data);
                centers = data.items;
            });

            return defer.promise;
        }

        function getDataNearby(geoLocation) {
            var url = config.apiUrl + config.api.paths.nearby +
                        '?latitude=' + geoLocation.latitude +
                        '&longitude=' + geoLocation.longitude,
                defer = $q.defer();

            makeCall(url, defer, function(data) {
                // console.log('data nearby:', data);
                centers = data.items
            });

            return defer.promise;
        }


        function getAllCenters() {
            var url = config.apiUrl + config.api.paths.allCourts,
                defer = $q.defer();

            makeCall(url, defer, function(data) {
                centers = data.items;
            });

            return defer.promise;
        }

        function makeCall(url, defer, successCallback, failCallback) {
            // console.log('== Making a call', url);
            function success(data) {
                if(successCallback) {
                    successCallback(data);
                }

                defer.resolve(data);
            }

            function fail(status) {
                if(failCallback) {
                    failCallback();
                }

                defer.reject(status);
            }

            http.get(url).then(success, fail);
        }

        // @param Array filters
        function applyFilters(filters) {
            var filtered = _.filter(centers, function(item) {
                return angular.equals(_.intersection(filters, item.summary), filters);
            });

            // console.log('## center', centers, filters, filtered.length, filtered);
            return filtered;
        }

    }
}());
