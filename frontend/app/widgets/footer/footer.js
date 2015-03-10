(function () {
    'use strict';

    var module = angular.module('olaf.widgets.footer', []);
    module.directive('olafFooter', [ OlafFooterDirective ]);

    function OlafFooterDirective () {

        olafFooterCtrl.$inject = ['$scope', '$location', 'events'];
	    function olafFooterCtrl($scope, $location, events) {
            $scope.showTabs = true;
            $scope.$on('$routeChangeSuccess', function () {
                // console.log('chnaging route', $location.$$path);
                $scope.showTabs = $location.$$path !== '/';
            });

            $scope.changeTabMode = function(type) {
                var view = (type === 'list-view' ? 'LIST' : 'MAP');
                events.$emit(events.footer[view + '_VIEW']);
            }
	    }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/footer/footer.html',
            controller: olafFooterCtrl
        };
    }
}());
