'use strict';

var ngModule = angular.module('app.user',[
    require('./modules/user.add').name,
    require('./modules/user.update').name
]);

ngModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('user', {
        url:'/user',
        templateUrl : 'modules/user/views/user.view.html',
        controller : 'userCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

ngModule.factory('userFac',require('./services/user.fac'));

ngModule.controller('userCtrl',require('./controllers/user.ctrl'));

module.exports = ngModule;