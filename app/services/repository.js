(function () {
    'use strict';
    angular.module('olaf.services.repository', ['olaf.services.memStorage', 'olaf.common.utils'])
        .factory('repositoryFact', [
            'memStorage', 'tryParseJson', function (memStorage, tryParseJson) {

                function Repository(repository) {
                    this.clear = function () {
                        repository.clear();
                        return this;
                    };

                    this.count = function count() {
                        return repository.length;
                    };

                    this.key = function key(index) {
                        return repository.key(index);
                    };

                    this.keys = function keys() {
                        var index;
                        var _keys = [];
                        var count = this.count();
                        for (index = 0; index < count; index++) {
                            _keys.push(this.key(index));
                        }
                        return _keys;
                    };

                    this.hasKey = function hasKey(key) {
                        return repository.hasOwnProperty(key);
                    };

                    this.get = function get(key) {
                        //TODO: Change to; angular.fromJson(repository.getItem(key))
                        return tryParseJson(repository.getItem(key));
                    };

                    this.set = function set(key, value) {
                        //TODO: Add try/catch for QUOTA_EXCEEDED_ERR or if iOS device in private browsing
                        repository.setItem(key, angular.toJson(value));
                        return this;
                    };

                    this.remove = function remove(key) {
                        repository.removeItem(key);
                        return this;
                    };
                }

                return {
                    create: function (repository) {
                        return new Repository(repository || memStorage);
                    }
                };
            }
        ])
        .factory('localRepo', [
            'repositoryFact', function (repositoryFact) {
                return repositoryFact.create(window.localStorage);
            }
        ])
        .factory('sessionRepo', [
            'repositoryFact', function (repositoryFact) {
                return repositoryFact.create(window.sessionStorage);
            }
        ]);
})();