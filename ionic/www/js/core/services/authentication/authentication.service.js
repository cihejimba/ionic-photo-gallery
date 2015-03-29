(function () {
    'use strict';

    /**
     * @ngInject
     */
    function AuthenticationProvider() {
        this.$get = function($http, Restangular, Token, localStorageService) {
            var currentUser = null;
            var saveUserAndToken = function(token) {
                // store token to local storage
                Token.set(token);
                // decode user data from payload token
                currentUser = Token.decodeToken(token);
                // save user to locale storage
                localStorageService.set('user', currentUser);
            };

            return {
                signup: function(params) {
                    return Restangular
                        .all('auth/signup')
                        .post(params)
                        .then(function(response) {
                            saveUserAndToken(response.token);
                        });
                },
                signin: function(params) {
                    return Restangular
                        .all('auth/signin')
                        .post(params)
                        .then(function(response) {
                            saveUserAndToken(response.token);
                        });
                },
                signout: function() {
                    return Restangular
                        .one('auth/signout')
                        .get()
                        .then(function(){
                            currentUser = null;
                            Token.remove();
                        });
                },
                isAuthenticated: function() {
                    return !!Token.get();
                },
                currentUser: currentUser || localStorageService.get('user')
            };
        };
    }

    angular
        .module('app.core')
        .provider('Authentication', AuthenticationProvider);
})();