(function () {
    'use strict';

    angular.module('olaf.services.http', [])
        .factory('http', ['$q', '$http', httpFactory]);

    function httpFactory($q, $http) {
         //Enable cross domain calls
        // $http.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        // delete $http.defaults.headers.common['X-Requested-With'];

        return {
            get: function (url, options) {
                var defer = $q.defer();
                $http.get(url, options)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (data) {
                        defer.reject(data);
                    });
                return defer.promise;
            },
            jsonp: function (url, options) {
                var defer = $q.defer();
                $http.jsonp(url, options)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (data) {
                        defer.reject(data);
                    });
                return defer.promise;
            }
        };
    }
}());