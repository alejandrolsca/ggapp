module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo',[
        require('./modules/woAdd').name,
        require('./modules/woUpdate').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('wo', {
            url:'/wo',
            templateUrl : 'modules/wo/views/wo.view.html',
            controller : 'woController',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('woFactory',require('./services/wo.fac'))

    .controller('woController',require('./controllers/wo.ctrl'))

})(angular);