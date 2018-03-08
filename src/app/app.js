module.exports = (function (angular) {
    'use strict';

    return angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'gg-fields',
        'gg-alerts',
        'wj',
        'ja.qr',
        'auth0.auth0',
        'angular-jwt',
        'angularFileUpload',
        require('./404').name,
        require('./login').name,
        require('./client').name,
        require('./user').name,
        require('./home').name,
        require('./product').name,
        require('./supplier').name,
        require('./machine').name,
        require('./material').name,
        require('./ink').name,
        require('./wo').name,
        require('./zone').name,
        require('./workflow').name,
        require('./traffic-light-report').name,
        require('./traffic-light-report-all').name,
        require('./exportation-invoice').name,
        require('./shipping-list').name,
        require('./printruns').name
    ])

        .service('authService', ['$rootScope', '$state', 'angularAuth0', '$timeout', '$http',
            function authService($rootScope, $state, angularAuth0, $timeout, $http) {

                function login() {
                    angularAuth0.authorize();
                }

                function handleAuthentication() {
                    angularAuth0.parseHash(function (err, authResult) {
                        if (authResult && authResult.accessToken && authResult.idToken) {
                            setSession(authResult);
                            $state.go('home');
                        } else if (err) {
                            $timeout(function () {
                                $state.go('login');
                            });
                            console.log(err);
                        }
                    });
                }

                function setSession(authResult) {
                    // Set the time that the Access Token will expire at
                    console.log(authResult)
                    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
                    localStorage.setItem('access_token', authResult.accessToken);
                    localStorage.setItem('id_token', authResult.idToken);
                    localStorage.setItem('expires_at', expiresAt);
                    getProfile(function (err, profile) {
                        if (err) {
                            throw new Error(err)
                        }
                    })
                }

                function logout() {
                    // Remove tokens and expiry time from localStorage
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('id_token');
                    localStorage.removeItem('expires_at');
                    $rootScope.$broadcast('userProfileSet', false);
                }

                function isAuthenticated() {
                    // Check whether the current time is past the 
                    // Access Token's expiry time
                    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
                    return new Date().getTime() < expiresAt;
                }

                var userProfile;

                function getProfile(cb) {
                    var accessToken = localStorage.getItem('access_token');
                    if (!accessToken) {
                        throw new Error('Access Token must exist to fetch profile');
                    }
                    angularAuth0.client.userInfo(accessToken, async function (err, profile) {
                        console.log(profile)
                        if (profile) {
                            const { picture, nickname } = profile
                            profile = {
                                picture: picture,
                                username: nickname,
                                us_group: profile['https://grupografico:auth0:com/us_group']
                            }
                            setUserProfile(profile);
                        }
                        cb(err, profile);
                    });
                }

                function setUserProfile(profile) {
                    localStorage.setItem('profile', JSON.stringify(profile));
                    $rootScope.$broadcast('userProfileSet', true);
                }

                function profile() {
                    const { picture, username, us_group } = angular.fromJson(localStorage.getItem('profile')) || {}
                    return {
                        picture: picture,
                        username: username,
                        us_group: us_group
                    }
                }

                return {
                    login: login,
                    handleAuthentication: handleAuthentication,
                    logout: logout,
                    isAuthenticated: isAuthenticated,
                    profile: profile
                }
            }])
        .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'angularAuth0Provider', '$httpProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider',
            function ($locationProvider, $stateProvider, $urlRouterProvider, angularAuth0Provider, $httpProvider, jwtOptionsProvider, jwtInterceptorProvider) {
                var ggauthlogo = require('../static/img/ggauth-logo.png');

                // Initialization for the angular-auth0 library
                angularAuth0Provider.init({
                    clientID: 'ZexVDEPlqGLMnWXnmyKSsoE8JO3ZS76y',
                    domain: 'grupografico.auth0.com',
                    responseType: 'token id_token',
                    audience: 'https://grupografico.auth0.com/userinfo',
                    redirectUri: `${window.location.origin}/home`,
                    scope: 'openid profile'
                });

                jwtOptionsProvider.config({
                    loginPath: '/home',
                    unauthenticatedRedirector: ['$state', function ($state) {
                        $state.go('login');
                    }],
                    tokenGetter: function () {
                        return localStorage.getItem('id_token');
                    },
                    whiteListedDomains: [
                        'http://api.geonames.org/'
                    ]
                });

                $httpProvider.interceptors.push('jwtInterceptor');

                $httpProvider.interceptors.push(require('./app.http.interceptor'));

                // Batching multiple $http responses into one $digest
                $httpProvider.useApplyAsync(true);

                // default routes
                $urlRouterProvider.when('', '/home');
                $urlRouterProvider.when('/', '/home');
                $urlRouterProvider.otherwise('/404');

                $locationProvider.hashPrefix('');

                /// Comment out the line below to run the app
                // without HTML5 mode (will use hashes in routes)
                $locationProvider.html5Mode(true);

            }])

        .run(['$rootScope', 'authService', 'authManager', '$location', 'jwtHelper', '$state', 'appFac',
            function ($rootScope, authService, authManager, $location, jwtHelper, $state, appFac) {
                /*
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                    $rootScope.currentState = toState;
                    if (!!toState.data.requiresLogin) {
                        var token = localStorage.getItem('id_token');
                        if (token) {
                            if (!jwtHelper.isTokenExpired(token)) {
                                if (!authManager.isAuthenticated) {
                                    authManager.authenticate();
                                }
                            } else {
                                $location.path('/login');
                            }
                        } else {
                            $location.path('/login');
                        }
                    }
                });*/

                // Handle the authentication
                // result in the hash
                if (!window.location.hash && !authService.isAuthenticated()) {
                    authService.login()
                } else {
                    authService.handleAuthentication();
                }

                // Use the authManager from angular-jwt to check for
                // the user's authentication state when the page is
                // refreshed and maintain authentication
                // authManager.checkAuthOnRefresh();

                // Listen for 401 unauthorized requests and redirect
                // the user to the login page
                authManager.redirectWhenUnauthenticated();

                // Put the authService on $rootScope so its methods
                // can be accessed from the nav bar
                $rootScope.authService = authService;
            }])

        .filter('i18n', require('./lang.filter.i18n'))

        .factory('appFac', require('./app.fac'))

        .controller('appCtrl', require('./app.ctrl'))

})(angular);