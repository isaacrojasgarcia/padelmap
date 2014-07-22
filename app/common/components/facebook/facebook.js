(function () {
    'use strict';

    var module = angular.module('olaf.components.facebook', []);
    module.factory('facebook', OlafFacebookFactory);

    OlafFacebookFactory.$inject = ['$q', 'config']
    function OlafFacebookFactory($q, config) {
    	var ready = false;

        return {
        	init: init,
            login: login
        };

        function isReady() {
            return ready;
        }

        function init() {
            var defer = $q.defer();
            console.log('CONFIG', config);

            window.fbAsyncInit = function() {
                FB.init({
                    appId      : config.facebook.app.id,
                    xfbml      : true,
                    version    : 'v2.0'
                });

                ready = true;
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

        function login() {
            if( !isReady() ) {
                init().then(loginFunction);
            }
            else {
                loginFunction();
            }

            function loginFunction() {
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        console.log('Logged in.');
                    }
                    else {
                        FB.login();
                    }
                });
            }
        }
    }
}());