(function () {
    'use strict';

    var module = angular.module('olaf.components.Facebook', []);
    module.service('Facebook', OlafFacebookService);

    OlafFacebookService.$inject = ['$q', 'config'];
    function OlafFacebookService($q, config) {
    	function Facebook() {
            this.ready = false;
            this.user = {};
        }

        Facebook.init = init;
        Facebook.isReady = isReady;

        Facebook.login = methodFactory(login, 'login');
        Facebook.getLoginStatus = methodFactory(getLoginStatus, 'getLoginStatus');
        

        // ===== Functions ==== //
        function isReady() {
            return Facebook.ready;
        }

        function methodFactory(callback, method) {
            return function() {
                var promise;

                if(!isReady()) {
                    promise = init().then(callback);
                }
                else {
                    promise = callback();
                }

                return promise;
            };
        }

        function init() {
            var defer = $q.defer();
            console.log('Initializing Facebook service');

            window.fbAsyncInit = function() {
                FB.init({
                    appId      : config.facebook.app.id,
                    xfbml      : true,
                    version    : 'v2.0'
                });

                Facebook.ready = true;
                defer.resolve();                
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            return defer.promise;
        }

        function getLoginStatus() {
            var defer = $q.defer();
            FB.getLoginStatus(function(response) {
                evalAuth(defer, response);
            });
            return defer.promise;
        }

        function login() {
            var defer = $q.defer();
            FB.login(function(response) {
                evalAuth(defer, response);
            });
            return defer.promise;
        }

        function me() {
            var defer = $q.defer();
            FB.api('/me', function(me) {
                defer.resolve(me);
            });
            return defer.promise;
        }

        


        // ==== Private ==== //
        function evalAuth(defer, response) {
            if (response.authResponse) {
                me().then(function(me) {
                    defer.resolve(_.extend(response, {
                        me: me
                    }));
                });
            } 
            else {
                defer.resolve(response);
            }
        }

        // ==== Returning Factory ==== //
        return Facebook;
    }
}());