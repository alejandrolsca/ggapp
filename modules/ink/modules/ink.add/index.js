module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink.add',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('inkAdd', {
            url:'/ink/add',
            templateUrl : 'modules/ink/modules/ink.add/ink.add.view.html',
            controller : 'inkAddCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('inkAddFac',require('./ink.add.fac'))

    .controller('inkAddCtrl',require('./ink.add.ctrl'))

})(angular);