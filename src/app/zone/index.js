module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.zone',[
        require('./modules/zone.add').name,
        require('./modules/zone.update').name,
        require('./modules/zone.view').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('zone', {
            url:'/zone/:cl_id',
            template: require('./zone.view.html'),
            controller : 'zoneCtrl',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'quality_assurance',
                    'sales',
                    'warehouse'
                ]
            }    
        });
    }])

    .factory('zoneFac',require('./zone.fac'))

    .controller('zoneCtrl',require('./zone.ctrl'))
    
})(angular);
