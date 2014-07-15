(function () {
    'use strict';

    var module = angular.module('olaf.components.spainMap', []);
    module.directive('olafSpainMap', [ '$location', 'config', OlafSpainMapDirective ]);

    function OlafSpainMapDirective ($location, config) {
    	function olafSpainMapLink (scope, elem, attr) {
            // Assuming that spain-map.js and raphael.js are loaded
            if(!scope.spainMap) {
                scope.idMap = attr.item
                // console.log('MAP:', document.getElementById('spain-map'));

                scope.spainMap = new SpainMap({
                    id               : attr.item,
                    width            : attr.width || 270,
                    height           : attr.heigh || 225,
                    fillColor        : "#fc5555",
                    strokeColor      : "#FFFFFF",   // bordeline color
                    strokeWidth      : 0.7,         // borderline width
                    selectedColor    : "#DADADA",   // city color on mouseover
                    animationDuration: 200, 
                    onClick          : function(province, mouseevent) {
                        // console.log('path:', '/' + config.paths.searchResult + '/' + province.friendly);
                        $location.path('/' + config.paths.searchResult + '/' + province.friendly);
                        scope.$apply();
                    },
                    onMouseOver: function(province, mouseevent) {},
                    onMouseOut: function(province, mouseevent) {}
                });
            }
        }

        return {
        	restrict: 'E',
            template: '<div id="spain-map"></div>',
            link: olafSpainMapLink
        };
    }
}());

