'use strict';

var ngModule = angular.module('app.user.add',[]);

ngModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('userAdd', {
        url:'/user/add',
        templateUrl : 'modules/user/modules/user.add/views/user.add.view.html',
        controller : 'userAddCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

ngModule.factory('userAddFac',require('./services/user.add.fac'));

ngModule.controller('userAddCtrl',require('./controllers/user.add.ctrl'));

module.exports = ngModule;