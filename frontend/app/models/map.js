(function () {
    'use strict';
    angular.module('olaf.models.map', []).factory('Map', MapFactory);

    MapFactory.$inject = ['config'];
    function MapFactory(config) {

        function Map(options) {
            options = options || {};

            this.center = options.center || config.locations.madrid;
            this.zoom = options.zoom || config.maps.zoom.big;
            this.clusterOptions = options.clusterOptions || config.maps.clusterOptions;

            this.markers = [];
            this.doClusterRandomMarkers = true;
        }

        Map.prototype.constructor = function() {

        };

        Map.prototype.setCenter = function(center) {
            this.center = center || config.locations.madrid;
        };

        return Map;
    }
}());
