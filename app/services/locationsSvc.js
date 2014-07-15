(function () {
    'use strict';

    angular.module('olaf.services.locationsSvc', [])
        .factory('locationsSvc', [ '$q', 'config', 'http', locationsSvcFactory ]);

    function locationsSvcFactory($q, config, http) {
  
        return {
            getLocations: getLocations
        };

        function getLocations() {
            var defer = $q.defer(),
                url = '/js/locations.json';

            http.get(url).then(function(response) {
                defer.resolve(response);
            }, function(status) {
                defer.reject(status);
            });

            return defer.promise;
        }
    }
}());