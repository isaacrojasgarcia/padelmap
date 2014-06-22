(function () {
    'use strict';

    angular.module('olaf.services.events', [])
        .factory('events', ['$rootScope', eventsFactory]);

    function eventsFactory($rootScope) {
        var events = angular.copy(olaf.events);
        events.$emit = function () {
            $rootScope.$emit.apply($rootScope, arguments);
        };

        events.$broadcast = function () {
            $rootScope.$broadcast.apply($rootScope, arguments);
        };

        events.$on = function () {
            return $rootScope.$on.apply($rootScope, arguments);
        };

        events.$clear = function (name) {
            $rootScope.$$listeners[name].length = 0;
        };

        return events;
    }

}());