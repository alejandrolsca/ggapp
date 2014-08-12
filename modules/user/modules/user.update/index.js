'use strict';

var ngModule = angular.module('app.user.update',[]);

ngModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('userUpdate', {
        url:'/user/update/:us_id',
        templateUrl : 'modules/user/modules/user.update/views/user.update.view.html',
        controller : 'userUpdateCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

ngModule.factory('userUpdateFac',require('./services/user.update.fac'));

ngModule.controller('userUpdateCtrl',require('./controllers/user.update.ctrl'));

module.exports = ngModule;