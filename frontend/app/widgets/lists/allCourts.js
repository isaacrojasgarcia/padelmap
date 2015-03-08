(function () {
    'use strict';

    var module = angular.module('olaf.widgets.allCourts', []);
    module.directive('olafAllCourts', olafAllCourts);

    olafAllCourts.$inject = ['centersSvc'];
    function olafAllCourts (centersSvc) {
        console.log(centersSvc);
        function olafAllCourtsCtrl($scope) {
            $scope.courts = [];
            centersSvc.getAllCenters().then(function(response) {
                console.log(response);
                $scope.courts = response.items;
            });
        }

        return {
            restrict: 'E',
            templateUrl: '/widgets/lists/allCourts.html',
            controller: ['$scope', olafAllCourtsCtrl]
        };
    }
}());
