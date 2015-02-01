(function () {
    'use strict';

    var module = angular.module('olaf.widgets.footer', []);
    module.directive('olafFooter', [ OlafFooterDirective ]);

    function OlafFooterDirective () {

        olafFooterCtrl.$inject = ['$scope', 'events'];
	    function olafFooterCtrl($scope, events) {
            $scope.changeTabMode = function(ev) {
                ev.preventDefault();
                var view = ev.target.className === 'list-view' ? 'LIST' : 'MAP';
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
