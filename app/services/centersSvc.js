(function () {
    'use strict';

    angular.module('olaf.services.centersSvc', [])
        .factory('centersSvc', [ '$q', 'config', 'http', centersSvcFactory ]);

    function centersSvcFactory($q, config, http) {
        var centers;

        return {
            getCenterById: getCenterById,
            getDataByLocation: getDataByLocation,
            applyFilters: applyFilters
        };


        function getCenterById(id) {
            var url = config.apiUrl + 'details/' + id,
                defer = $q.defer();

            makeCall(url, defer);
            return defer.promise;
        }

        // @param Location loc
        function getDataByLocation(loc) {
            var url = config.apiUrl + 'centers/' + loc.getFriendly(),
                defer = $q.defer();

            makeCall(url, defer, function(data) {
                centers = data.items;
            });

            return defer.promise;
        }

        function makeCall(url, defer, successCallback, failCallback) {
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