module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.machine.add',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('machineAdd', {
            url:'/machine/add',
            templateUrl : 'modules/machine/modules/machine.add/machine.add.view.html',
            controller : 'machineAddCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('machineAddFac',require('./machine.add.fac'))

    .controller('machineAddCtrl',require('./machine.add.ctrl'))

})(angular);