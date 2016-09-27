module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.workflow',[
    ])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('workflow', {
            url:'/workflow',
            templateUrl : 'app/workflow/workflow.view.html',
            controller : 'workflowController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('workflowFactory',require('./workflow.fac'))

    .controller('workflowController',require('./workflow.ctrl'))

})(angular);