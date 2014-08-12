'use strict';

var ngModule = angular.module('app.client.update',[]);

ngModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('clientUpdate', {
        url:'/client/update/:cl_id',
        templateUrl : 'modules/client/modules/client.update/views/client.update.view.html',
        controller : 'clientUpdateCtrl',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

ngModule.factory('clientUpdateFac',require('./services/client.update.fac'));

ngModule.controller('clientUpdateCtrl',require('./controllers/client.update.ctrl'));

module.exports = ngModule;