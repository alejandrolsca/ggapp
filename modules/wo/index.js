'use strict';

var clientModule = angular.module('app.wo',[
    require('./modules/woAdd').name,
    require('./modules/woUpdate').name
]);

clientModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('wo', {
        url:'/wo',
        templateUrl : 'modules/wo/views/woView.html',
        controller : 'woController',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

clientModule.factory('woFactory',require('./services/woFactory'));

clientModule.controller('woController',require('./controllers/woController'));

module.exports = clientModule;