(function () {
    'use strict';

    var module = angular.module('olaf.widgets.details', []);
    module.directive('olafDetails', OlafDetailsDirective);
    

    function OlafDetailsDirective () {
        return {
        	restrict: 'E',
        	templateUrl: '/widgets/details/details.html'
        };
    }

}());