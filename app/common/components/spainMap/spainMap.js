(function () {
    'use strict';

    var module = angular.module('olaf.components.spainMap', []);
    module.directive('olafSpainMap', [ OlafSpainMapDirective ]);

    function OlafSpainMapDirective () {
    	function olafSpainMapCtrl($scope) {
	       
	    }

	    function olafSpainMapLink (scope, elem, attr) {
            // Assuming that spain-map.js and raphael.js are loaded
            // TODO: Validate if SpainMap is defined
            // console.log(scope.spainMap);

            if(!scope.spainMap) {
                // console.log(attr.item);
                scope.spainMap = new SpainMap({
                    id               : attr.item,
                    width            : attr.width || 270,
                    height           : attr.heigh || 225,
                    fillColor        : "#87BA37",
                    strokeColor      : "#FFFFFF", // bordeline color
                    strokeWidth      : 0.7, // borderline width
                    selectedColor    : "#DADADA", // city color on mouseover
                    animationDuration: 200, 
                    onClick          : function(province, mouseevent) {
                        console.log(province);
                    },
                    onMouseOver: function(province, mouseevent) {},
                    onMouseOut: function(province, mouseevent) {}
                });
            }
	    }

        return {
        	restrict: 'E',
        	link: olafSpainMapLink,
            controller: ['$scope', olafSpainMapCtrl ],
            template: '<div id="spain-map"></div>'
        };
    }
}());

        