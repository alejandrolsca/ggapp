module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.machine',[
        require('./modules/machine.add').name,
        require('./modules/machine.update').name
    ])

    .config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider.state('machine', {
            url:'/machine',
            templateUrl : 'modules/machine/machine.view.html',
            controller : 'machineCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
            }    
        });
    }])

    .factory('machineFac',require('./machine.fac'))

    .controller('machineCtrl',require('./machine.ctrl'))
    
})(angular);
