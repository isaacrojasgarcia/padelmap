(function () {
    'use strict';

    var module = angular.module('olaf.widgets.map', ['ui.bootstrap']);
    module.directive('olafMap', [OlafMapDirective ]);

    function OlafMapDirective () {
        function olafMapCtrl($scope) {

        }

        return {
            restrict: 'E',
            templateUrl: '/widgets/map/map.html',
            controller: ['$scope', olafMapCtrl ]
        };
    }
}());
