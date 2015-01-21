(function () {
    'use strict';
    angular.module('olaf.models.results', []).factory('Results', ResultsFactory);

    ResultsFactory.$inject = ['config'];
    function ResultsFactory(config) {

        function Results() {

        }

        return Results;
    }
}());
