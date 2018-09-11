module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.history',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woHistory', {
            url:'/wo/history/:wo_id',
            template: require('./wo.history.view.html'),
            controller : 'woHistoryController',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'quality_assurance'
                ]
            }    
        });
    }])

    .factory('woHistoryFactory',require('./wo.history.fac'))

    .controller('woHistoryController',require('./wo.history.ctrl'))

})(angular);