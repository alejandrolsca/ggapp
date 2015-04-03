module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.woAdd',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('woAdd', {
            url:'/wo/add/:cl_id',
            templateUrl : 'modules/wo/modules/woAdd/views/wo.add.view.html',
            controller : 'woAddController',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('woAddFactory',require('./services/wo.add.fac'))

    .controller('woAddController',require('./controllers/wo.add.ctrl'))

})(angular);