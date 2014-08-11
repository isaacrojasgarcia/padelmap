(function () {
    'use strict';

    // in memory storage implementation, mimic local storage
    // useful when localStorage isn't available

    angular.module('olaf.services.memStorage', [])
        .factory('memStorage', [function () {
            var MemStorage = function () {

                MemStorage.prototype.getItem = function (key) {
                    if (this.hasOwnProperty(key)) {
                        return String(this[key]);
                    }
                    return null;
                };

                MemStorage.prototype.setItem = function (key, val) {
                    this[key] = String(val);
                };

                MemStorage.prototype.removeItem = function (key) {
                    delete this[key];
                };

                MemStorage.prototype.clear = function () {
                    var self = this;
                    Object.keys(self).forEach(function (key) {
                        self[key] = undefined;
                        delete self[key];
                    });
                };

                MemStorage.prototype.key = function (i) {
                    i = i || 0;
                    return Object.keys(this)[i];
                };

                //Using ’Object.defineProperty’ rather than ’__defineGetter__’ which is not supported by IE9
                Object.defineProperty(MemStorage.prototype, 'length', {
                    get: function() {
                        return Object.keys(this).length;
                    }
                });
            };

            return new MemStorage();
        }]);
})();