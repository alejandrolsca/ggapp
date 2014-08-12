'use strict';

var ngModule = angular.module('app.client.add',[]);

ngModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('clientAdd', {
        url:'/client/add',
        templateUrl : 'modules/client/modules/client.add/views/client.add.view.html',
        controller : 'clientAddCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

ngModule.factory('clientAddFac',require('./services/client.add.fac'));

ngModule.controller('clientAddCtrl',require('./controllers/client.add.ctrl'));

module.exports = ngModule;