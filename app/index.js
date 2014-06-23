(function () {
    'use strict';
    
    var dependecies = [
        'ngRoute', 
        'ngAnimate', 
        'google-maps', 
        'olaf.templates', 
        'olaf.widgets', 
        'olaf.components', 
        'olaf.services',
        'olaf.common.utils'
    ];

    var mod = angular.module('olaf', dependecies);
    mod.config(['$routeProvider', '$locationProvider', '$httpProvider', ConfigCtrl]);
    
    //Register work which should be performed when the injector is done loading all modules.
    mod.run(['$rootScope', RunCtrl])
    mod.controller('bodyCtrl', [BodyCtrl]);
    
    function ConfigCtrl($routeProvider, $locationProvider, $httpProvider) {
        var routes = [
            ['/', { template: '<olaf-home></olaf-home>' }],
            ['/pistas-de-padel/:city', { template: '<olaf-results></olaf-results>' }],
            ['/pistas-de-padel/:city/:town', { template: '<olaf-results></olaf-results>' }],
            ['/centros/:center/:id', { template: '<olaf-results type="details"></olaf-results>' }]
        ];

        routes.forEach(function (row) {
            $routeProvider.when('/:lang' + row[0], { redirectTo: row[0] });
            $routeProvider.when(row[0], row[1]);
        });

        // $routeProvider.when('/:lang', { redirectTo: '/' });
        $routeProvider.when('/', { template: '<olaf-home></olaf-home>'});  // , reloadOnSearch: false

        $routeProvider.otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }

    function RunCtrl($rootScope) {
        $rootScope.site = {
            title: 'PadelTotal.es',
            description: 'PT'
        }
    }

    function BodyCtrl() {
        
    }
})();
