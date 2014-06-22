(function () {
    'use strict';

    angular.module('olaf.services.config', [])
        .factory('config', ['$rootScope', configFactory]);

    function configFactory($rootScope) {
        var config = angular.copy(olaf.config);
        config.apiUrl = config.api [ config.env ];
        return config;
    }

}());