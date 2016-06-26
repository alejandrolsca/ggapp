module.exports = (function(angular){
    'use strict';
    
    return angular.module('app.wo.duplicate',[])

    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('woDuplicate', {
            url:'/wo/duplicate/:cl_id/:wo_id',
            templateUrl : 'modules/wo/modules/wo.duplicate/wo.duplicate.view.html',
            controller : 'woDuplicateController',
            data: {
                requiresLogin: true
            }    
        });
    }])

    .factory('woDuplicateFactory',require('./wo.duplicate.fac'))

    .controller('woDuplicateController',require('./wo.duplicate.ctrl'))

})(angular);