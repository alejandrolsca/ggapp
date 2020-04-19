module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.split',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woSplit', {
            url:'/wo/split/:cl_id/:wo_id',
            template: require('./wo.split.view.html'),
            controller : 'woSplitController',
            data: {
                requiresLogin: true,
                roles: [
                    'admin',
                    'sales'
                ]
            }    
        });
    }])

    .factory('woSplitFactory',require('./wo.split.fac'))

    .controller('woSplitController',require('./wo.split.ctrl'))

})(angular);