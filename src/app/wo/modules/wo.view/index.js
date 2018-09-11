module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.view',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woView', {
            url:'/wo/view/:cl_id/:wo_id',
            template: require('./wo.view.view.html'),
            controller : 'woViewController',
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

    .factory('woViewFactory',require('./wo.view.fac'))

    .controller('woViewController',require('./wo.view.ctrl'))

})(angular);