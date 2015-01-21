(function () {
    'use strict';

    var module = angular.module('olaf.widgets.header', []);

    module.directive('olafHeader', OlafHeaderDirective);
    module.controller('olafHeaderController', olafHeaderController);

    olafHeaderController.$inject = ['$scope', 'Facebook'];
    function olafHeaderController($scope, Facebook) {
        //$scope.loginStatus = false;
        $scope.user = {
            connected: false
        };

        $scope.loginCall = loginCall;

        // // TODO: Improve then add Facebook connection
        // Facebook.getLoginStatus().then(successfulConnect);
        //
        // function loginCall() {
        //     Facebook.login().then(successfulConnect);
        // }
        //
        // function successfulConnect(response) {
        //     // console.log('Success', response);
        //     $scope.user.connected = response.status === 'connected';
        //     if($scope.user.connected) {
        //         _.extend($scope.user, response.me);
        //     }
        // }
    }

    OlafHeaderDirective.$inject = [];
    function OlafHeaderDirective () {
	    function olafHeaderLink (scope, elm, attr) {

	    }

        return {
        	restrict: 'E',
        	templateUrl: '/widgets/header/header.html',
            link: olafHeaderLink,
            controller: olafHeaderController
        };
    }
}());
