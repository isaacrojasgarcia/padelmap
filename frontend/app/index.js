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
                ['/' + config.paths.details + '/:center/:id', { template: '<olaf-results type="details"></olaf-results>' }],
                ['/' + config.paths.allCourts, { template: '<olaf-all-courts></olaf-all-courts>' }]
            ];

        routes.forEach(function (row) {
            $routeProvider.when(row[0], row[1]);
        });

        $routeProvider.when('/', { template: '<olaf-home></olaf-home>'});  // , reloadOnSearch: false
        $routeProvider.otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }

    RunCtrl.$inject = ['$rootScope', 'events'];
    function RunCtrl($rootScope, events) {
        var deregisters = [];
        $rootScope.$on('$destroy', _.executor(deregisters));

        $rootScope.site = {
            title: 'Mapa de Padel',
            description: '',
            keywords: '',
            defaultKeywords: 'padel, mapa de padel, pistas de padel',
            og: {
                title: 'Mapa de Padel | by Lt.',
                url: 'https://www.mapadepadel.com/',
                desc: 'El buscador más rápido de la península ibérica',
            }
        };

        deregisters.push(
            events.$on(events.metatags.UPDATE, function(event, data) {
                $rootScope.site.title = data.title;
                $rootScope.site.description = data.description;
                $rootScope.site.keywords = data.keywords
                // console.log('-> Site:', $rootScope.site);
            })
        );

        // Facebook.init();
    }

    function BodyCtrl() {

    }
})();
