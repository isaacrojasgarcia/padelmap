(function () {
    'use strict';

    angular.module('olaf.services.locationsSvc', [])
        .factory('locationsSvc', [ '$q', '$location', 'config', 'http', locationsSvcFactory ]);

    function locationsSvcFactory($q, $location, config, http) {
  
        return {
            getLocations: getLocations,
            setPath: setPath
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
    
        function setPath(locationSelected) {
            $location.path('/' + config.paths.searchResult + '/' + locationSelected.friendly);
        }

    }
}());