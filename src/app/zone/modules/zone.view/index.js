module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone.view',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('zoneView', {
            url:'/zone/view/:cl_id/:zo_id',
            template: require('./zone.view.view.html'),
            controller : 'zoneViewCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'finishing',
                    'packaging',
                    'production',
                    'quality_assurance',
                    'sales',
                    'warehouse'
                ]
            }    
        });
    }])

    .factory('zoneViewFac',require('./zone.view.fac'))

    .controller('zoneViewCtrl',require('./zone.view.ctrl'))

})(angular);