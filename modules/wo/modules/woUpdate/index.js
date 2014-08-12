'use strict';

var clientModule = angular.module('app.woUpdate',[]);

clientModule.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.state('woUpdate', {
        url:'/wo/update/:wo_id',
        templateUrl : 'modules/wo/modules/woUpdate/views/woUpdateView.html',
        controller : 'woUpdateController',
        data: {
            authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
        }    
    });
}]);

clientModule.factory('woUpdateFactory',require('./services/woUpdateFactory'));

clientModule.controller('woUpdateController',require('./controllers/woUpdateController'));

module.exports = clientModule;