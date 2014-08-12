'use strict';

var ngModule = angular.module('app.home',[]);

ngModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('home', {
        url:'/home',
        templateUrl : 'modules/home/views/home.view.html',
        controller : 'homeCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }    
    });
}]);

ngModule.factory('homeFac',require('./services/home.fac'));

ngModule.controller('homeCtrl',require('./controllers/home.ctrl'));

module.exports = ngModule;