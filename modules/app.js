(function(angular){
    //ALEJANDRO
    'use strict';
    
    angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'gg-fields',
        'wj',
        require('./auth').name,
        require('./client').name,
        require('./user').name,
        require('./home').name,
        require('./wo').name,
        require('./zone').name
    ])
    
    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        // when there is an empty route, redirect to /index   
        $urlRouterProvider.when('', '/auth');
        // when root, redirect to /home  
        $urlRouterProvider.when('/', '/auth');
    }])
    
    .run(function ($rootScope, AUTH_EVENTS, credentialsFac, $location) {
        credentialsFac.credentials().then(function(promise){
            if(promise.data.success) {
                $rootScope.user = promise.data;
            }
            console.log(JSON.stringify(promise.data));
        }).then(function(){
            $rootScope.$on('$stateChangeStart', function (event, next) {
                var authorizedRoles = next.data.authorizedRoles;
                if (authorizedRoles.indexOf($rootScope.user.userRole) == -1) {
                    event.preventDefault();
                    if (!!$rootScope.user.user) {
                        console.log('user is not allowed');
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        $location.path('/auth');
                    } else {
                        console.log('user is not logged in');
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        $location.path('/auth');
                    }
                }
            });
        });
    })
    
    .filter('i18n',require('./app/lang.filter.i18n'))
    
    .factory('langFac',require('./app/lang.fac'))
    
    .factory('logoutFac',require('./app/logout.fac'))
    
    .factory('credentialsFac',require('./app/user.credentials.fac'))
    
    .controller('appCtrl',require('./app/app.ctrl'))
    
})(angular);
