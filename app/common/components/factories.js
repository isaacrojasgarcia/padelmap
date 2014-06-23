(function () {
    'use strict';

    angular.module('olaf.components.factories', [])
        .factory('lodash', lodash)
        .factory('bind', bind);
    
    function bind() {
        return function (scope, fn) {
            return function () {
                var args = arguments,
                    self = this;
                return scope.$apply(function () {
                    return fn.apply(self, args);
                });
            };
        };
    }

    function lodash() {
        //Assumes lodash.js has already been loaded on the page
        return window._;
    }
}());