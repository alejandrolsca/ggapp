'use strict';

var ngModule = angular.module('app.client',[
    require('./modules/client.add').name,
    require('./modules/client.update').name
]);

ngModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('client', {
        url:'/client',
        templateUrl : 'modules/client/views/client.view.html',
        controller : 'clientCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

ngModule.factory('clientFac',require('./services/client.fac'));

ngModule.controller('clientCtrl',require('./controllers/client.ctrl'));

module.exports = ngModule;