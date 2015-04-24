module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink',[
        require('./modules/ink.add').name,
        require('./modules/ink.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('ink', {
            url:'/ink',
            templateUrl : 'modules/ink/ink.view.html',
            controller : 'inkCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('inkFac',require('./ink.fac'))

    .controller('inkCtrl',require('./ink.ctrl'))
    
})(angular);
