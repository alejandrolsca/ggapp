module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.auth',[])

    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin: 1, 
        editor: 2, 
        guest: 3,
        all: 4,
    })

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('auth', {
            url:'/auth',
            templateUrl : 'modules/auth/views/auth.view.html',
            controller : 'authCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.guest]
            }    
        });
    }])

    .factory('authFac',require('./services/auth.fac'))

    .controller('authCtrl',require('./controllers/auth.ctrl'))
    
})(angular);