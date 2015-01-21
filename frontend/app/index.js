(function () {
    'use strict';

    var dependecies = [
        'ngRoute',
        'ngAnimate',
        'uiGmapgoogle-maps',
        'olaf.templates',
        'olaf.widgets',
        'olaf.components',
        'olaf.services',
        'olaf.models',
        'olaf.common.utils'
    ];

    var mod = angular.module('olaf', dependecies);
    mod.config(ConfigCtrl);

    //Register work which should be performed when the injector is done loading all modules.
    mod.run(RunCtrl);
    mod.controller('bodyCtrl', [BodyCtrl]);

    ConfigCtrl.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
    function ConfigCtrl($routeProvider, $locationProvider, $httpProvider) {
        var config = olaf.config,
            routes = [
                ['/', { template: '<olaf-home></olaf-home>' }],
                ['/' + config.paths.nearby, { template: '<olaf-results type="nearby"></olaf-results>' }],
                ['/' + config.paths.searchResult + '/:city', { template: '<olaf-results></olaf-results>' }],
                ['/' + config.paths.searchResult + '/:city/:town', { template: '<olaf-results></olaf-results>' }],
                ['/' + config.paths.details + '/:center/:id', { template: '<olaf-results type="details"></olaf-results>' }]
            ];

        routes.forEach(function (row) {
            // $routeProvider.when('/:lang' + row[0], { redirectTo: row[0] });
            $routeProvider.when(row[0], row[1]);
        });

        // $routeProvider.when('/:lang', { redirectTo: '/' });
        $routeProvider.when('/', { template: '<olaf-home></olaf-home>'});  // , reloadOnSearch: false

        $routeProvider.otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }

    RunCtrl.$inject = ['$rootScope', 'Facebook'];
    function RunCtrl($rootScope, Facebook) {
        $rootScope.site = {
            title: 'PadelWar.com',
            description: '',
            og: {
                title: 'PadelWar | by Lt.',
                url: 'https://www.padelwar.com/',
                desc: '',

            }
        };

        Facebook.init();
    }

    function BodyCtrl() {

    }
})();
