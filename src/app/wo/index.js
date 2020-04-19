module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo',[
        require('./modules/wo.add').name,
        require('./modules/wo.update').name,
        require('./modules/wo.duplicate').name,
        require('./modules/wo.split').name,
        require('./modules/wo.view').name,
        require('./modules/wo.history').name
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('wo', {
            url:'/wo/:cl_id',
            template: require('./wo.view.html'),
            controller : 'woController',
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

    .factory('woFactory',require('./wo.fac'))

    .controller('woController',require('./wo.ctrl'))

})(angular);