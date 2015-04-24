module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.ink.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('inkUpdate', {
            url:'/ink/update/:in_id',
            templateUrl : 'modules/ink/modules/ink.update/ink.update.view.html',
            controller : 'inkUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('inkUpdateFac',require('./ink.update.fac'))

    .controller('inkUpdateCtrl',require('./ink.update.ctrl'))

})(angular);