(function (angular) {
    //ALEJANDRO SANCHEZ BETANCOURT
    'use strict';

    angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'gg-fields',
        'gg-alerts',
        'wj',
        'ja.qr',
        'auth0',
        'angular-storage',
        'angular-jwt',
        require('./modules/login').name,
        require('./modules/client').name,
        require('./modules/user').name,
        require('./modules/home').name,
        require('./modules/product').name,
        require('./modules/supplier').name,
        require('./modules/machine').name,
        require('./modules/paper').name,
        require('./modules/ink').name,
        require('./modules/wo').name,
        require('./modules/zone').name
    ])

        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'authProvider', 'jwtInterceptorProvider',
            function ($stateProvider, $urlRouterProvider, $httpProvider, authProvider, jwtInterceptorProvider) {
                authProvider.init({
                    domain: 'grupografico.auth0.com',
                    clientID: 'ZexVDEPlqGLMnWXnmyKSsoE8JO3ZS76y',
                    loginState: 'login' // matches login state
                });
                // We're annotating this function so that the `store` is injected correctly when this file is minified
                jwtInterceptorProvider.tokenGetter = ['store', function (store) {
                    // Return the saved token
                    return store.get('token');
                }];

                $httpProvider.interceptors.push('jwtInterceptor');
                // Batching multiple $http responses into one $digest
                $httpProvider.useApplyAsync(true);
                // when there is an empty route, redirect to /index   
                $urlRouterProvider.when('', '/home');
                // when root, redirect to /home  
                $urlRouterProvider.when('/', '/home');
            }])

        .run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location',
            function ($rootScope, auth, store, jwtHelper, $location) {
                // This hooks al auth events to check everything as soon as the app starts
                auth.hookEvents();
                // This events gets triggered on refresh or URL change
                $rootScope.$on('$stateChangeStart', function () {
                    var token = store.get('token');
                    if (token) {
                        if (!jwtHelper.isTokenExpired(token)) {
                            if (!auth.isAuthenticated) {
                                auth.authenticate(store.get('profile'), token);
                            }
                        } else {
                            // Either show the login page or use the refresh token to get a new idToken
                            $location.path('/login');
                        }
                    }
                });

            }])

        .filter('i18n', require('./modules/app/lang.filter.i18n'))

        .factory('langFac', require('./modules/app/lang.fac'))

        .controller('appCtrl', require('./modules/app/app.ctrl'))

})(angular);