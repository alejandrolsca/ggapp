module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.machine.add',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('machineAdd', {
            url:'/machine/add',
            template: require('./machine.add.view.html'),
            controller : 'machineAddCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin'
                ]
            }    
        });
    }])

    .factory('machineAddFac',require('./machine.add.fac'))

    .controller('machineAddCtrl',require('./machine.add.ctrl'))

})(angular);