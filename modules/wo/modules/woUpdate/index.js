module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.woUpdate',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('woUpdate', {
            url:'/wo/update/:wo_id',
            templateUrl : 'modules/wo/modules/woUpdate/wo.update.view.html',
            controller : 'woUpdateController',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('woUpdateFactory',require('./wo.update.fac'))

    .controller('woUpdateController',require('./wo.update.ctrl'))

})(angular);