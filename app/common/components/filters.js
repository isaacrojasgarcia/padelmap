(function () {
    'use strict';

    var module = angular.module('olaf.components.filters', []);
    module.filter('truncate', truncateFilter);
    module.filter('phone', phoneFilter);


    /**
     * Truncate Filter
     * @Param text
     * @Param length, default is 10
     * @Param end, default is "..."
     * @return string
     */
    function truncateFilter() {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    }

    function phoneFilter() {
        return function (tel) {
            if (!tel) { 
                return ''; 
            }

            return tel.slice(0,3) + ' ' + tel.slice(3,6) + ' ' + tel.slice(6);
        };
    }
}());