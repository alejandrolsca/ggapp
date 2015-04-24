module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.machine.update',[])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('machineUpdate', {
            url:'/machine/update/:ma_id',
            templateUrl : 'modules/machine/modules/machine.update/machine.update.view.html',
            controller : 'machineUpdateCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('machineUpdateFac',require('./machine.update.fac'))

    .controller('machineUpdateCtrl',require('./machine.update.ctrl'))

})(angular);