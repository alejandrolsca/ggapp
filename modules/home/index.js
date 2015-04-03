module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.home',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('home', {
            url:'/home',
            templateUrl : 'modules/home/views/home.view.html',
            controller : 'homeCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
            }    
        });
    }])

    .factory('homeFac',require('./services/home.fac'))

    .controller('homeCtrl',require('./controllers/home.ctrl'))

})(angular);