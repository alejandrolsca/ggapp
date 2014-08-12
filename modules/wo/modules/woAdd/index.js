'use strict';

var clientModule = angular.module('app.woAdd',[]);

clientModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('woAdd', {
        url:'/wo/add',
        templateUrl : 'modules/wo/modules/woAdd/views/woAddView.html',
        controller : 'woAddController',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

clientModule.factory('woAddFactory',require('./services/woAddFactory'));

clientModule.controller('woAddController',require('./controllers/woAddController'));

module.exports = clientModule;