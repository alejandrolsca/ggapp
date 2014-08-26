angular.element(document).ready(function(){
    //ALEJANDRO
    'use strict';
    
    var app = angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'gg-fields',
        require('./auth').name,
        require('./client').name,
        require('./user').name,
        require('./home').name,
        require('./wo').name
    ]);
    
    app.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        // when there is an empty route, redirect to /index   
        $urlRouterProvider.when('', '/auth');
        // when root, redirect to /home  
        $urlRouterProvider.when('/', '/auth');
    }]);
    
    app.run(function ($rootScope, AUTH_EVENTS, credentialsFac, $location) {
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
    });
    
    app.filter('i18n',require('./app/filters/i18n.filter'));
    
    app.factory('langFac',require('./app/services/lang.fac'));
    
    app.factory('logoutFac',require('./app/services/logout.fac'));
    
    app.factory('credentialsFac',require('./app/services/user.credentials.fac'));
    
    app.controller('appCtrl',require('./app/controllers/app.ctrl'));
    
    angular.bootstrap(document, ['app']);
    
});